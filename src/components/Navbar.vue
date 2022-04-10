<template>
  <header class="header">
    <nav class="navbar" :class="$route.path === '/' ? '' : 'with-background'">
      <div class="container">
        <div class="navbar-brand">
          <router-link
            class="navbar-item has-text-white is-size-2 has-text-weight-bold"
            to="/"
          >
            {{ brandName }}
          </router-link>
          <span
            @click="isMenuOpen = !isMenuOpen"
            role="button"
            tabindex="0"
            :class="{ 'is-active': isMenuOpen }"
            class="navbar-burger burger has-text-white"
            data-target="navbar-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <!-------->
        <div
          id="navbar-menu"
          class="navbar-menu"
          :class="{ 'is-active': isMenuOpen }"
        >
          <div class="navbar-end">
            <div class="navbar-item" v-if="isAuthenticated">
              {{ user.username }}
            </div>
            <router-link
              class="navbar-item nav-home"
              v-for="(item, index) in menuItems"
              :to="item.link"
              :key="index"
              >{{ item.text }}</router-link
            >
            <!-------->
            <template v-if="!isAuthenticated">
              <router-link class="navbar-item" to="/login">login</router-link>
              <router-link class="navbar-item nav-home" to="/register"
                >Register</router-link
              >
            </template>
            <!---->
            <template v-else>
              <router-link class="navbar-item nav-home" to="/exchanges/new"
                >exchanges</router-link
              >
              <router-link class="navbar-item nav-home" to="/profile"
                >profile</router-link
              >
              <div
                class="navbar-item clickable"
                @click="$store.dispatch('user/logout')"
              >
                logout
              </div>
            </template>
            <!---->
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
<!----------------------------- SCRIPTS ---------->
<script>
import useAuth from "@/composition/useAuth";
// import {mapState} from 'vuex';
export default {
  name: "navBar",
  // components: {},
  //   props: ["menuItems", "brandName"],
  props: {
    brandName: {
      type: String,
      required: true,
    },
    menuItems: {
      type: Array,
      required: true,
    },
  },

  setup() {
    return useAuth();
  },

  data() {
    return {
      isMenuOpen: false,
    };
  },

  methods: {
    handleWindowResizing(e) {
      if (this.isMenuOpen && e.target.innerWidth > 1020) {
        this.isMenuOpen = false;
      }
    },
  },

  created() {
    window.addEventListener("resize", this.handleWindowResizing);
  },

  unmounted() {
    window.removeEventListener("resize", this.handleWindowResizing);
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters["user/isAuthenticated"];
    },
  },

  //   data() {
  //     return {
  //       brandName: "Exchangario",
  //       menuItems: [
  //         { text: "Home", link: "/" },
  //         { text: "about", link: "/" },
  //         { text: "fag", link: "/" },
  //         { text: "login", link: "/" },
  //         { text: "register", link: "/" },
  //       ],
  //     };
  //   },
  //	computed: {},
  //	created() {	},
  //	methods: {},
};
</script>
