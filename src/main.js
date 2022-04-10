import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from '@/router'
import store from '@/store'
// 
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

let app;

library.add(faStar, faUpload)

store.dispatch("user/onAuthChange", () => {
	if (!app) {
		app = createApp(App)

		app.use(Toast)
			.use(router)
			.use(store)
			.component('font-awesome-icon', FontAwesomeIcon)

		app.mount('#app')
	}

})

	// const options = {
	// 	// You can set your default options here
	// };