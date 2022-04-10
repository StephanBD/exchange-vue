<template>
  <div>
    <!-- NAVBAR -->
    <navbar :brandName="brandName" :menuItems="menuItems" />

    <router-view />
  </div>
</template>

<!-----------------------scripts----------------------->
<script>
import Navbar from "./components/Navbar.vue";
// import Home from "./pages/Home.vue";
// -----------------------------------------
export default {
  components: { Navbar },
  // components: {
  //   Home,
  // },
  name: "App",
  // ----
  data() {
    return {
      brandName: "Exchangario",
      menuItems: [
        { text: "Home", link: "/" },
        { text: "about", link: "/about" },
        { text: "faq", link: "/faq" },
        // { text: "login", link: "/login" },
        // { text: "register", link: "/register" },
        // { text: "profile", link: "/profile" },
      ],
    };
  },
};
</script>

<!-----------------------styles----------------------->
<style lang="scss">
@import "assets/styles/variables.scss";
@import "~bulma/bulma.sass";
@import "assets/styles/main.scss";
</style>
