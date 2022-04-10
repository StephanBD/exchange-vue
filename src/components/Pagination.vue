<!---------------------------- TEMPLATE ----------->
<template>
  <nav
    class="pagination is-rounded is-centered"
    role="navigation"
    aria-label="pagination"
  >
    <ul class="pagination-list">
      <li>
        <button
          :disabled="isFetching"
          @click="() => onNextPage({ page: 'previous' })"
          type="button"
          class="pagination-previous has-text-weight-bold"
        >
          Previous
        </button>
      </li>
      <li>
        <button
          type="button"
          class="pagination-link button has-text-weight-bold is-primary"
        >
          Page {{ curentPage }}
        </button>
      </li>
      <li>
        <button
          :disabled="isFetching"
          @click="() => onNextPage({ page: 'next' })"
          type="button"
          class="pagination-next has-text-weight-bold"
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
</template>
<!----------------------------- SCRIPTS ---------->
<script>
// import {mapState} from 'vuex';
export default {
  name: "pagiNation",
  // components: {},
  props: {
    onNextPage: {
      type: Function,
      required: true,
    },
    isFetching: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    curentPage() {
      return this.$store.getters["exchange/curentPage"];
    },
  },
  //	created() {	},
  //	methods: {},
};
</script>
<!----------------------------- STYLES ---------->
<style scoped lang="scss"></style>
