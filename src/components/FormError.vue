<!---------------------------- TEMPLATE ----------->
<template>
  <div class="form-error" v-for="error of errors" :key="error.$uid">
    <div class="help is-danger">
      {{ error.$message }}
    </div>
  </div>
</template>
<!----------------------------- SCRIPTS ---------->
<script>
// import {mapState} from 'vuex';
export default {
  name: "FormError",
  // components: {},
  props: {
    errors: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  //	computed: {},
  //	created() {	},
  //	methods: {},
};
</script>
<!----------------------------- STYLES ---------->
<style scoped lang="scss"></style>
