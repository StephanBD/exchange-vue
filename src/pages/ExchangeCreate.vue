<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="form-container">
        <form @submit.prevent="">
          <!-------->
          <div class="field">
            <label class="label">Type</label>
            <div class="control">
              <div class="select">
                <select v-model="form.type">
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                </select>
              </div>
            </div>
          </div>
          <!-------->
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input
                v-model="form.title"
                class="input"
                type="text"
                placeholder="Some Nice Product"
              />
              <form-error :errors="v$.form.title.$errors" />
              <!-- <div class="form-error" v-if="v$.form.title.$errors">  
    <div
                class="form-error"
                v-for="error of v$.form.title.$errors"
                :key="error.$uid"
              >
                <div class="help is-danger">
                  {{ error.$message }}
                </div>
                
              </div>  -->
            </div>
          </div>
          <!-------->
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea
                v-model="form.description"
                class="textarea"
                placeholder="Some catchy description about product"
              >
              </textarea>
              <form-error :errors="v$.form.description.$errors" />
              <!-- <div class="form-error" v-if="v$.form.description.$error">
                <div
                  v-if="v$.form.description.required.$invalid"
                  class="help is-danger"
                >
                  Description required
                </div>
              </div> -->
            </div>
          </div>
          <!-------->
          <div class="field">
            <label class="label">Image Link</label>
            <div class="control">
              <input
                v-model="form.image"
                class="input"
                type="text"
                placeholder="https://unsplash...."
              />
              <form-error :errors="v$.form.image.$errors" />
              <!-- <div class="form-error" v-if="v$.form.image.$error">
                <div
                  v-if="v$.form.image.required.$invalid"
                  class="help is-danger"
                >
                  image required
                </div>
                <div v-if="v$.form.image.url.$invalid" class="help is-danger">
                  image url is wrong format
                </div>
              </div> -->
            </div>
          </div>
          <!-------->
          <div class="field">
            <label class="label">Price</label>
            <div class="control">
              <input
                v-model="form.price"
                class="input"
                type="number"
                placeholder="249"
              />
              <form-error :errors="v$.form.price.$errors" />
              <!-- <div class="form-error" v-if="v$.form.price.$error">
                <div
                  v-if="v$.form.price.required.$invalid"
                  class="help is-danger"
                >
                  price required
                </div>
                <div
                  v-if="v$.form.price.minValue.$invalid"
                  class="help is-danger"
                >
                  price must be at least 1!
                </div>
              </div> -->
            </div>
          </div>
          <!-------->
          <div class="field">
            <label class="label">Country</label>
            <div class="control">
              <input
                v-model="form.country"
                class="input"
                type="text"
                placeholder="Slovakia"
              />
              <form-error :errors="v$.form.country.$errors" />
              <!-- <div class="form-error" v-if="v$.form.country.$error">
                <div
                  v-if="v$.form.country.required.$invalid"
                  class="help is-danger"
                >
                  country required
                </div>
              </div> -->
            </div>
          </div>
          <!-------->
          <div class="field">
            <label class="label">City</label>
            <div class="control">
              <input
                v-model="form.city"
                class="input"
                type="text"
                placeholder="Bratislava"
              />
              <form-error :errors="v$.form.city.$errors" />
              <!-- <div class="form-error" v-if="v$.form.city.$error">
                <div
                  v-if="v$.form.city.required.$invalid"
                  class="help is-danger"
                >
                  city required
                </div>
              </div> -->
            </div>
          </div>

          <!-- TODO: provide tags inputs -->
          <!-------->
          <div class="field">
            <label class="label">Tags</label>
            <div class="control">
              <input
                @input="handleTags"
                class="input"
                type="text"
                placeholder="programming"
              />
              <div
                v-for="tag in form.tags"
                :key="tag"
                class="tag is-primary is-medium"
              >
                {{ tag }}
              </div>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button
                @click.prevent="createExchange"
                type="button"
                class="button is-link"
              >
                Submit
              </button>
            </div>
            <div class="control">
              <button class="button is-text">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<!---------------------------------------------->
<script>
import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  url,
  minValue,
  helpers,
} from "@vuelidate/validators";
import FormError from "@/components/FormError.vue";
// import { supportedFileType } from "@/helpers/validators";

const setupInitialData = {
  title: "",
  description: "",
  type: "",
  image: "",
  price: null,
  country: "",
  city: "",
  tags: [],
};

export default {
  components: { FormError },
  name: "ExchangesPage",
  // ----
  data() {
    return {
      form: {
        title: "Soy un titulo bonito",
        description: "descripción",
        type: "que tipo",
        image: "http://algo.com/img.jpg",
        price: 10,
        country: "Aqui",
        city: "Pastico",
        tags: ["car"],
      },
    };
  },
  // ----
  validations() {
    return {
      form: {
        title: {
          required: helpers.withMessage("Title connot be empty!", required),
          minLength: helpers.withMessage(
            "Title must be at least 10!",
            minLength(10)
          ),
          // minLength: minLength(10),
        },
        description: { required },
        type: { required },
        image: {
          required,
          url,
          // supportedFileType: helpers.withMessage(
          //   "supportedFileType",
          //   supportedFileType
          // ),
        },
        price: { required, minValue: minValue(1) },
        country: { required },
        city: { required },
        // tags: {required},
      },
    };
  },
  // ----
  setup() {
    return { v$: useVuelidate() };
  },
  // ----
  methods: {
    async createExchange() {
      const isValid = await this.v$.$validate();
      if (isValid) {
        this.v$.$reset();
        this.$store.dispatch("exchange/createExchange", {
          data: this.form,
          onSuccess: () => {
            this.form = setupInitialData;
          },
        });
      }
    },
    // ----
    handleTags(event) {
      const { value } = event.target;

      if (
        (value && value.trim().length > 1 && value.substr(-1) === ",") ||
        value.substr(-1) === " "
      ) {
        const _value = value.split(",")[0].trim();

        if (!this.form.tags.includes(_value)) {
          this.form.tags.push(_value);
          event.target.value = "";
        }
        // console.log(_value);
      }
    },
  },
  // ----
};
</script>
<!---------------------------------------------->
<style scoped>
.form-container {
  max-width: 960px;
  margin: 0 auto;
  margin-top: 40px;
}
.tag {
  margin: 3px;
}
</style>
