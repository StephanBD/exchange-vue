<template>
  <modal
    :onModalSubmit="updateProfile"
    ref="exchangeModal"
    headerText="Update profile"
  >
    <!-- ---- -->
    <template #activator>
      <button class="button is-block is-primary is-light is-fullwidth">
        Update profile
      </button>
    </template>
    <!-- ---- -->
    <form>
      <div class="field">
        <label class="title">Username</label>
        <input v-model="userProfile.username" class="input" />
      </div>
      <div class="field">
        <label class="title">Avatar</label>
        <!-- <input v-model="userProfile.avatar" class="input" /> 
        -->
        <div class="file has-name">
          <label class="file-label">
            <input
              @change="handleUpload"
              class="file-input"
              type="file"
              name="resume"
            />
            <span class="file-cta">
              <span class="file-icon">
                <font-awesome-icon icon="upload" />
              </span>
              <span class="file-label"> Choose a file… </span>
            </span>
          </label>
        </div>
        <progress class="progress" :value="progress" max="100">
          {{ progress }}%
        </progress>
        <img
          :src="userProfile.avatar"
          v-if="userProfile.avatar"
          class="image-preview"
          alt=""
        />
      </div>
      <div class="field">
        <label class="title">address about user</label>
        <input v-model="userProfile.address" class="input" />
      </div>
      <div class="field">
        <label class="title">info about user</label>
        <input v-model="userProfile.info" class="input" />
      </div>
      <div class="field">
        <label class="title">country about user</label>
        <input v-model="userProfile.country" class="input" />
      </div>
      <div class="field">
        <label class="title">Phone about user</label>
        <input v-model="userProfile.Phone" class="input" />
      </div>
    </form>
  </modal>
</template>
<!---------------------------------------------->
<script>
import Modal from "./Modal.vue";

export default {
  components: { Modal },
  name: "profileModal",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  computed: {
    modal() {
      return this.$refs.exchangeModal;
    },
  },

  data() {
    return {
      isOpen: false,
      userProfile: { ...this.user },
      progress: 0,
    };
  },

  methods: {
    updateProfile() {
      this.$store.dispatch("user/updateProfile", {
        data: this.userProfile,
        // onSuccess: () => (this.isOpen = false),
        onSuccess: this.modal.close,
      });
    },
    handleUpload(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      const self = this;
      reader.onload = function () {
        // console.log(reader.result);
        self.$store.dispatch("user/uploadImage", {
          bytes: reader.result,
          name: file.name,
          onSuccess: (url) => {
            self.userProfile.avatar = url;
          },
          onProgress: (progress) => {
            self.progress = progress;
          },
        });
      };
    },
  },
};
</script>
<!---------------------------------------------->
<style scoped>
.image-preview {
  height: 200px;
}
.progress {
  margin-top: 15px;
}
</style>
