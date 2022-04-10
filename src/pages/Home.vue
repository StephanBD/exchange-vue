<template>
  <div>
    <!-- HERO START -->
    <hero :onSearch="filterExchanges" />
    <!-- POST LIST START -->
    <exchange-list v-if="exchanges" :exchanges="exchanges" />

    <!-- PAGINATION START -->
    <pagination
      :onNextPage="getMoreExchanges"
      :isFetching="isFetchingMoreData"
    />
  </div>
</template>

<!-----------------------scripts----------------------->
<script>
import ExchangeList from "@/components/ExchangeList.vue";
import Pagination from "@/components/Pagination.vue";
import Hero from "@/components/Hero.vue";
// import { mapState } from "vuex";
// -----------------------------------------
export default {
  // ----
  components: { ExchangeList, Pagination, Hero },
  // ----
  name: "HomePage",
  // ----
  data() {
    return {
      searchExchangeTitle: "",
    };
  },
  // ----
  computed: {
    // ...mapState({ exchange: (state) => state.items }),
    exchanges() {
      // return this.$store.state.exchange.items;
      return this.$store.getters["exchange/filterExchanges"](
        this.searchExchangeTitle
      );
    },
    // ----
    isFetchingMoreData() {
      // console.log(this.$store.state.pagination);
      return this.$store.state.exchange.pagination.isFetchingData;
    },
  },
  // ----
  created() {
    this.$store.dispatch("exchange/getExchanges");
  },
  // ----
  methods: {
    getMoreExchanges({ page }) {
      // console.log("Getting more exchanges from: ", page);
      this.$store.dispatch("exchange/getMoreExchanges", { page });
    },
    filterExchanges(searchValue) {
      this.searchExchangeTitle = searchValue;
    },
  },
};
</script>

<!-----------------------styles----------------------->
<style lang="scss"></style>
