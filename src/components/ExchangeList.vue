<!---------------------------- TEMPLATE ----------->
<template>
  <section class="posts">
    <div class="container">
      <div class="posts-type">Latest Posts</div>
      <div class="columns is-multiline">
        <!-- ---- -->
        <div
          class="column is-12-mobile is-6-tablet is-4-widescreen is-6-desktop"
          :key="exchange.id"
          v-for="exchange in exchanges"
        >
          <div class="item post-card bottom-border">
            <router-link class="item-link" :to="'/exchanges/' + exchange.slug">
              <figure
                class="image is-2by1 item-figure background-img"
                :style="{
                  'background-image': 'url(' + exchange.image + ')',
                }"
                alt=""
              ></figure>
              <div class="item-featured exchange-icon">
                <font-awesome-icon icon="star" />
              </div>
            </router-link>
            <div class="item-tags">
              <a
                class="button is-rounded"
                :title="tag"
                v-for="tag in exchange.tags"
                :key="tag"
                >#{{ tag }}</a
              >
            </div>
            <h2 class="title item-title is-size-4 has-text-weight-extra-bold">
              <router-link
                class="item-link"
                :to="{
                  name: 'ExchangeDetail',
                  params: { slug: exchange.slug },
                }"
                >{{ exchange.title }}</router-link
              >
            </h2>
            <div class="level">
              <div class="level-left">
                <!-- <div class="item-author">{{ exchange.user.username }}</div> -->
              </div>
              <div class="level-right">
                {{ exchange.createdAt.toDate().toDateString() }}
              </div>
            </div>
          </div>
        </div>
        <!-------->
      </div>
    </div>
  </section>
</template>
<!----------------------------- SCRIPTS ---------->
<script>
// import {mapState} from 'vuex';
export default {
  name: "ExchangeList",
  // components: {},
  //	props: [''],
  props: {
    exchanges: {
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
<style scoped lang="scss">
.posts {
  padding-top: 70px;
}
.posts-type {
  font-size: 34px;
  margin-bottom: 10px;
  font-weight: bold;
}
.exchange-icon {
  color: #ffbc8c;
  // height: 25px;
  // width: 25px;
  // font-size: 25px;
}
</style>
