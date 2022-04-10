<!---------------------------- TEMPLATE ----------->
<template>
  <div>
    <template v-if="$slots.activator">
      <div @click="open">
        <slot name="activator" />
      </div>
    </template>
    <button
      v-else
      @click="open"
      class="button is-block is-success is-light is-fullwidth"
    >
      Update Info
    </button>
    <div :class="['modal', { 'is-active': isOpen }]">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ headerText }}</p>
          <button @click="close" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <!-- modal body -->
          <slot />
        </section>
        <footer class="modal-card-foot">
          <template v-if="$slots.footerButtons">
            <slot name="footerButtons" />
          </template>
          <button
            v-else
            :disabled="isDisabled"
            @click="onModalSubmit"
            class="button is-block is-success is-light is-fullwidth"
          >
            Update Info
          </button>

          <!-- <button
            :disabled="isDisabled"
            @click="onModalSubmit"
            class="button is-success"
          >
            Save changes
          </button> -->
          <button @click="close" class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>
<!----------------------------- SCRIPTS ---------->
<script>
// import {mapState} from 'vuex';
export default {
  name: "ModalPage",
  // components: {},
  props: {
    headerText: {
      default: "Confirmation window",
      type: String,
      required: false,
    },
    onModalSubmit: {
      type: Function,
      required: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
      // required: false,
    },
    //  isOpen: {
    //    type: Boolean,
    //    required: false,
    // 	default: false
    //  },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  //	computed: {},
  //	created() {	},
  methods: {
    submitModal() {
      this.onModalSubmit({ onSuccess: () => this.close });
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
};
</script>
<!----------------------------- STYLES ---------->
<style scoped lang="scss"></style>
