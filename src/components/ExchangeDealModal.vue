<!---------------------------- TEMPLATE ----------->
<template>
  <modal
    :onModalSubmit="createOpportunity"
    :isDisabled="!isAllowedPrice || hasNotEnoughCredit"
    ref="exchangeModal"
  >
    <template #activator>
      <button class="button is-block is-success is-fullwidth">
        Make a deal
      </button>
    </template>
    <!-- body modal -->
    <div class="deal">
      <div class="deal-highlight">{{ exchange.user.username }}´s Offer</div>
      <div class="deal-wrapper">
        <div>Offering {{ exchange.type }}</div>
        <div>{{ exchange.title }}</div>
      </div>
      <div class="deal-highlight">Your Offer</div>
      <div class="counter-offer">
        <div class="field">
          Would you prefer to exchange credit ?
          <label class="checkbox is-large">
            <input type="checkbox" v-model="isPriceExchange" />
            Yes
          </label>
        </div>
        <div class="field">
          <label class="label">How Much Credit ?</label>
          <div class="control">
            <input
              v-model="selectedPrice"
              :disabled="!isPriceExchange"
              class="input"
              type="number"
              placeholder="40"
            />
            <i> You don't have enough of credit </i>
          </div>
        </div>
        <div class="field">
          <label class="label">Exchange</label>
          <div class="control">
            <div class="select">
              <select :disabled="isPriceExchange" v-model="selectedExchanged">
                <option
                  v-for="exchange in availableExchanges"
                  :value="exchange"
                  :key="exchange.slug"
                >
                  {{ exchange.title }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div v-if="offeredPrice">
          <span>Your price is:</span>
          <span class="deal-highlight">{{ offeredPrice }}$</span>
        </div>

        <div
          v-if="percentedDiference !== null"
          :class="`mb-1 message is-small ${percentedDiffClass}`"
        >
          <div class="message-body">
            {{ priceDifferenceText }}
          </div>
        </div>

        <div class="message is-danger is-small" v-if="hasNotEnoughCredit">
          <div class="message-body">
            You don´t have enogh credit for this transaction, Remaining credit:
            ${{ user.credit }}
          </div>
        </div>

        <i
          >Allowed difference is not less than {{ ALLOWED_PRICE_DIFERENCE }}%</i
        >
      </div>
    </div>
  </modal>
</template>
<!----------------------------- SCRIPTS ---------->
<script>
import Modal from "./Modal.vue";
export default {
  components: { Modal },
  // ----
  name: "ExchangeDealModal",
  // ----
  props: {
    exchange: {
      type: Object,
      required: true,
    },
    availableExchanges: {
      type: Array,
      required: true,
    },
  },

  // ----
  data() {
    return {
      isPriceExchange: false,
      selectedPrice: null,
      selectedExchanged: null,
      ALLOWED_PRICE_DIFERENCE: 20,
    };
  },

  // ----
  watch: {
    isPriceExchange(value) {
      if (value) {
        this.selectedExchanged = null;
      } else {
        this.selectedPrice = null;
      }
    },
  },

  // ----
  computed: {
    hasNotEnoughCredit() {
      if (!this.isPriceExchange) return false;
      return this.user.credit < this.selectedPrice;
    },
    modal() {
      return this.$refs.exchangeModal;
    },
    offeredPrice() {
      if (this.isPriceExchange) {
        return this.selectedPrice;
      } else if (this.selectedExchanged) {
        return this.selectedExchanged.price;
      }
      return null;
    },
    percentedDiference() {
      if (this.offeredPrice === null || this.offeredPrice === "") return null;
      const priceDiference = this.offeredPrice - this.exchange.price;
      return (priceDiference / this.exchange.price) * 100;
    },
    priceDifferenceText() {
      if (this.percentedDiference === null) return "";
      if (this.percentedDiference === 0) return "Same amount";
      const roundedPercentageDiff =
        Math.round(this.percentedDiference * 100) / 100;
      const differenceText = this.percentedDiference > 0 ? "Higher" : "lower";

      return `Offer price is ${roundedPercentageDiff}% ${differenceText} than exchange price`;
    },

    isAllowedPrice() {
      if (!this.offeredPrice) return false;

      return (
        this.percentedDiference <= this.ALLOWED_PRICE_DIFERENCE &&
        this.percentedDiference >= -this.ALLOWED_PRICE_DIFERENCE
      );
    },
    percentedDiffClass() {
      return this.isAllowedPrice ? "is-success" : "is-danger";
    },
    user() {
      return this.$store.state.user.data;
    },
  },

  // ----
  methods: {
    createOpportunity() {
      // this.modal.close();

      const data = {
        title: this.exchange.title,
        fromUserId: this.user.id,
        fromExchangeId: this.selectedExchanged?.id,
        toExchangeId: this.exchange.id,
        toUserId: this.exchange.user.id,
        price: this.selectedPrice,
      };

      this.$store.dispatch("opportunity/createOpportunity", {
        data,
        onSuccess: this.modal.close,
      });
    },
  },
};
</script>
<!----------------------------- STYLES ---------->
<style scoped lang="scss">
.price {
  padding: 7px;
  &-allowed {
    background-color: #cdeacd;
  }
  &-declined {
    background-color: #ffc2c2;
  }
}
.deal-wrapper {
  margin-bottom: 10px;
}
.counter-offer,
.deal-wrapper {
  border: 2px solid grey;
  padding: 10px;
  margin-top: 10px;
  &-title {
    font-size: 21px;
    margin: 5px 0;
    font-weight: bold;
  }
}
.deal {
  font-size: 19px;
  &-highlight {
    font-size: 19px;
    font-weight: bold;
  }
}
.disabled {
  &.field {
    input,
    textarea,
    select {
      pointer-events: none;
      color: grey;
    }
    label {
      color: grey;
    }
  }
}
</style>
