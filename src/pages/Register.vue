<template>
  <div class="page-wrapper">
    <div class="container has-text-centered">
      <div class="column is-4 is-offset-4">
        <h3 class="title has-text-grey">Register</h3>
        <div class="box">
          <form>
            <div class="field">
              <div class="control">
                <input
                  v-model="form.email"
                  class="input is-large"
                  type="email"
                  placeholder="Email"
                  autocomplete="email"
                />
                <form-error :errors="v$.form.email.$errors" />
                <!-- <div class="form-error">
                  <div class="help is-danger">Invalid Value</div>
                </div> -->
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  v-model="form.username"
                  class="input is-large"
                  type="text"
                  placeholder="Username"
                />
                <form-error :errors="v$.form.username.$errors" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  v-model="form.password"
                  class="input is-large"
                  type="password"
                  placeholder="Password"
                  autocomplete="current-password"
                />
                <form-error :errors="v$.form.password.$errors" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  v-model="form.passwordConfirmation"
                  class="input is-large"
                  type="password"
                  placeholder="Repeat the password"
                />
                <form-error :errors="v$.form.passwordConfirmation.$errors" />
              </div>
            </div>
            <button
              @click="register"
              :disabled="isProcessing"
              type="button"
              class="button is-block is-info is-large is-fullwidth"
            >
              Sign Up
            </button>
          </form>
        </div>
        <p class="has-text-grey">
          <a>Sign In With Google</a>&nbsp; <a>Sign Up</a>&nbsp;·&nbsp;
          <a href="../">Need Help?</a>
        </p>
      </div>
    </div>
  </div>
</template>
<!---------------------------------------------->
<script>
// import FormError from "@/components/FormError.vue";
// import useRegister from "@/composition/useRegister";
import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers, email } from "@vuelidate/validators";
import useAuth from "@/composition/useAuth";
import FormError from "@/components/FormError.vue";
// import { mapState } from "vuex";
export default {
  components: { FormError },
  name: "registerPage",

  data() {
    return {
      form: {
        email: "",
        username: "",
        password: "",
        passwordConfirmation: "",
      },
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
        username: { required },
        password: { required },
        passwordConfirmation: {
          required,
          sameAs: helpers.withMessage(
            "Must be same as the password",
            sameAs(this.form.password)
          ),
        },
      },
    };
  },

  setup() {
    // const { register } = useRegister();
    // return { register };
    // return { ...useRegister(), ...useAuth() };
    //  @click="() => register(form)"
    return { ...useAuth(), v$: useVuelidate() };
  },
  watch: {
    isAuthenticated(isAuth) {
      if (isAuth) {
        this.$router.push("/");
      }
    },
  },

  // watch: {
  //   // error(message) {
  //   //   if (message) {
  //   //     alert(message);
  //   //   }
  //   // },

  //   isProcessing(newVal, oldVal) {
  //     if (!newVal && oldVal && !this.error) {
  //       // console.log("created user");
  //       this.$router.push("/");
  //     }
  //   },
  // },

  // computed: {
  //   ...mapState("user", {
  //     error: ({ register }) => register.error,
  //     isProcessing: ({ register }) => register.isProcessing,
  //   }),
  // },

  // error() {
  //   return this.$store.state.user.register.error;
  // },
  // isProcessing() {
  //   return this.$store.state.user.register.isProcessing;
  // },

  methods: {
    async register() {
      const isValid = await this.v$.$validate();
      // alert(JSON.stringify(this.form));
      // console.log(this.$store);
      if (isValid) {
        this.$store.dispatch("user/register", this.form);
      }
    },
  },
};
</script>
<!---------------------------------------------->
<style scoped>
/* Left formatting  */
/* .form-error {
    text-align: initial;
  } */
.hero.is-success {
  background: #f2f6fa;
}
.hero .nav,
.hero.is-success .nav {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.box {
  margin-top: 1rem;
}
.avatar {
  margin-top: -70px;
  padding-bottom: 20px;
}
.avatar img {
  padding: 5px;
  background: #fff;
  border-radius: 50%;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
input {
  font-weight: 300;
}
p {
  font-weight: 700;
}
p.subtitle {
  padding-top: 1rem;
}
</style>
