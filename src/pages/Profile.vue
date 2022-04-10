<template>
  <div class="page-wrapper">
    <div class="columns">
      <div class="container profile">
        <div class="section profile-heading">
          <div class="columns is-mobile is-multiline">
            <div class="column is-2">
              <figure class="image header-icon user-profile-image">
                <img class="is-rounded" :src="user?.avatar" />
              </figure>
            </div>
            <div class="column is-4-tablet is-10-mobile name">
              <div class="user-info">
                <p>
                  <span class="title is-bold">{{ user?.username }}</span>
                  <br />
                </p>
                <p class="tagline">{{ user?.info }}</p>
              </div>
              <!-- <button class="button is-success">Update Info</button> -->
              <profile-modal :user="user" />
              <!--  -->
            </div>
            <div
              @click="selectedOpportunities = 'recived'"
              :class="{ 'is-active': selectedOpportunities === 'recived' }"
              class="stats-tab stats-tab-interactive column is-2-tablet is-4-mobile has-text-centered"
            >
              <p class="stat-val">Received</p>
              <p class="stat-key">Opportunities {{ opportunities.length }}</p>
            </div>
            <div
              @click="selectedOpportunities = 'sent'"
              :class="{ 'is-active': selectedOpportunities === 'sent' }"
              class="stats-tab stats-tab-interactive column is-2-tablet is-4-mobile has-text-centered"
            >
              <p class="stat-val">Sent</p>
              <p class="stat-key">
                Opportunities {{ sendOpportunities.length }}
              </p>
            </div>
            <div
              class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
            >
              <p class="stat-val">{{ user?.credit }}</p>
              <p class="stat-key">Credits</p>
            </div>
          </div>
        </div>
        <!-----recived---->
        <div
          class="columns is-mobile is-multiline"
          v-show="selectedOpportunities === 'recived'"
        >
          <template v-if="opportunities && opportunities.length > 0">
            <div
              class="column is-3-tablet is-6-mobile"
              v-for="opportunity in opportunities"
              :key="opportunity.id"
            >
              <div class="card">
                <div class="card-image" v-if="opportunity.fromExchange">
                  <figure class="image is-4by3">
                    <img :src="opportunity.fromExchange.image" />
                  </figure>
                </div>
                <div class="card-image" v-else>
                  <figure class="image is-4by3">
                    <img
                      src="https://media-cdn.tripadvisor.com/media/photo-s/15/a4/9b/77/legacy-hotel-at-img-academy.jpg"
                    />
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <!-- <p class="title is-6 mb-2"><b>Offer:</b> 1000$</p> -->
                      <p class="title is-6" v-if="opportunity.fromExchange">
                        <b>Offer:</b> {{ opportunity.fromExchange.title }}
                      </p>

                      <p class="title is-6" v-else>
                        <b>Offer:</b> {{ opportunity.price }}
                      </p>
                      <p class="title is-6">
                        <b>Request:</b> {{ opportunity.title }}
                      </p>
                      <p class="subtitle is-6">
                        <span
                          :class="[
                            { 'is-success': opportunity.status === 'accepted' },
                            { 'is-danger': opportunity.status === 'declined' },
                            { 'is-warning': opportunity.status === 'pending' },
                          ]"
                          class="tag subtitle"
                          >{{ opportunity.status }}</span
                        >
                      </p>
                    </div>
                  </div>
                  <div class="content">
                    <p v-if="opportunity.fromExchange">
                      {{ opportunity.fromExchange.description }}
                    </p>
                    <p v-else>user want to exchange yor item for money</p>
                  </div>
                </div>
                <footer class="card-footer">
                  <opportunity-deal-modal
                    :opportunity="opportunity"
                    v-if="opportunity.status === 'pending'"
                  >
                  </opportunity-deal-modal>
                  <!--  -->
                  <opportunity-result-modal v-else :opportunity="opportunity">
                  </opportunity-result-modal>
                </footer>
              </div>
              <br />
            </div>
          </template>
        </div>
        <!-----sent---->
        <div
          class="columns is-mobile is-multiline"
          v-show="selectedOpportunities === 'sent'"
        >
          <template v-if="sendOpportunities && sendOpportunities.length > 0">
            <div
              class="column is-3-tablet is-6-mobile"
              v-for="opportunity in sendOpportunities"
              :key="opportunity.id"
            >
              <div class="card">
                <div class="card-image" v-if="opportunity.toExchange">
                  <figure class="image is-4by3">
                    <img :src="opportunity.toExchange.image" />
                  </figure>
                </div>

                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <!-- <p class="title is-6 mb-2"><b>Offer:</b> 1000$</p> -->
                      <p class="title is-6" v-if="opportunity.fromExchange">
                        <b>Offer:</b> {{ opportunity.fromExchange.title }}
                      </p>

                      <p class="title is-6" v-else>
                        <b>Offer:</b> {{ opportunity.price }}
                      </p>
                      <p class="title is-6">
                        <b>Request:</b> {{ opportunity.title }}
                      </p>
                      <p class="subtitle is-6">
                        <span
                          :class="[
                            { 'is-success': opportunity.status === 'accepted' },
                            { 'is-danger': opportunity.status === 'declined' },
                            { 'is-warning': opportunity.status === 'pending' },
                          ]"
                          class="tag is-dark subtitle"
                          >{{ opportunity.status }}</span
                        >
                      </p>
                    </div>
                  </div>
                  <div class="content">
                    <p v-if="opportunity.fromExchange">
                      {{ opportunity.fromExchange.description }}
                    </p>
                    <p v-else>Price exchange</p>
                  </div>
                </div>
                <!-- <footer class="card-footer">
                  <button
                    type="button"
                    class="button is-block is-success is-light is-fullwidth"
                  >
                    Check deal
                  </button>
                </footer> -->
              </div>
              <br />
            </div>
          </template>
        </div>
        <!--------->
      </div>
    </div>
  </div>
</template>
<!---------------------------------------------->
<script>
import useAuth from "@/composition/useAuth";
import ProfileModal from "@/components/ProfileModal.vue";
import OpportunityDealModal from "@/components/OpportunityDealModal.vue";
import OpportunityResultModal from "@/components/OpportunityResultModal.vue";
// ----
export default {
  components: { ProfileModal, OpportunityDealModal, OpportunityResultModal },
  name: "ProfilePage",

  setup() {
    return useAuth();
  },

  data() {
    return {
      selectedOpportunities: "recived",
    };
  },

  computed: {
    opportunities() {
      return this.$store.state.opportunity.opportunities;
    },
    sendOpportunities() {
      return this.$store.state.opportunity.sendOpportunities;
    },
  },

  watch: {
    isAuthenticated(isAuth) {
      if (!isAuth) {
        this.$router.push("/");
      }
    },
  },

  created() {
    this.$store.dispatch("opportunity/getOpportunities");
    this.$store.dispatch("opportunity/sendOpportunities");
  },
};
</script>
<!---------------------------------------------->
<style scoped>
.link {
  font-weight: 500;
  color: rgb(79, 79, 172);
  text-decoration: underline;
}
.user-info {
  margin-bottom: 10px;
}
.stats-error {
  font-size: 40px;
  font-weight: bold;
  margin-top: 30px;
}
.delete-item {
  color: red;
}
.stats-tab {
  border-bottom: 2px solid transparent;
  transition: 0.5s;
}
.stats-tab:hover {
  cursor: pointer;
  border-bottom: 2px solid black;
}
.stats-tab.is-active {
  border-bottom: 2px solid black;
}
.stat-val {
  font-size: 2em;
  padding-top: 20px;
  font-weight: bold;
}
.stat-key {
  font-size: 1.4em;
  font-weight: 200;
}
.section.profile-heading
  .column.is-2-tablet.has-text-centered
  + .has-text-centered {
  border-left: 1px dotted rgba(0, 0, 0, 0.2);
}
.container.profile {
  margin-top: 1%;
}
.control.is-pulled-left span.select {
  margin-right: 5px;
  border-radius: 2px;
}
.modal-card .content h1 {
  padding: 40px 10px 10px;
  border-bottom: 1px solid #dadada;
}
.container.profile .profile-options .tabs ul li.link a {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f1f1f1;
}
.card-footer {
  justify-content: center;
  padding: 5px;
}
</style>
