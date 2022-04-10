import { createWebHistory, createRouter } from "vue-router";
import Home from "@/pages/Home"
import About from "@/pages/About"
import Faq from "@/pages/Faq"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Profile from "@/pages/Profile"
import ExchangeCreate from "@/pages/ExchangeCreate"
import ExchangeDetail from "@/pages/ExchangeDetail"
import { getAuth } from "firebase/auth";



const routes = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/about",
		name: "About",
		component: About
	},
	{
		path: "/faq",
		name: "Faq",
		component: Faq
	},

	{
		path: "/login",
		name: "Login",
		component: Login,
		meta: { onlyGuestUser: true }
	},
	{
		path: "/register",
		name: "Register",
		component: Register,
		meta: { onlyGuestUser: true }
	},
	{
		path: "/profile",
		name: "Profile",
		component: Profile,
		meta: { onlyAuthUser: true }
	},
	{
		path: "/exchanges/new",
		name: "ExchangeCreate",
		component: ExchangeCreate,
		meta: { onlyAuthUser: true }
	},
	{
		path: "/exchanges/:slug",
		name: "ExchangeDetail",
		component: ExchangeDetail,
		// meta: { onlyAuthUser: true }
	},
]

// ----
const router = createRouter({
	history: createWebHistory(),
	routes
})
// ----

router.beforeEach(async (to, _, next) => {

	const isAuth = await !!getAuth().currentUser
	if (to.meta.onlyAuthUser) {
		if (isAuth) {
			next()
		} else {
			next({ name: "Login" })
		}
	} else if (to.meta.onlyGuestUser) {
		if (isAuth) {
			next({ name: "Home" })
		}
		next()
	} else {
		next()
	}
})

export default router