import { getExchange, setExchanges, getExchangeBySlugFire, getMoreExchanges, getLessExchanges } from "@/db"
import { Timestamp } from "firebase/firestore"
// import { doc, addDoc, collection } from "firebase/firestore";
// import {  getDoc, doc } from "firebase/firestore"
import slugify from "slugify"
/*************************exchange*************************/

const initPagination = () => ({
	itemCount: 4,
	lastItem: null,
	paginationHistory: [],
	isFetchingData: false
})

export default {
	namespaced: true,
	// ----
	state() {
		return {
			items: [],
			item: {},
			pagination: initPagination()
		}
	},
	// ----
	mutations: {
		setExchanges(state, exchanges) {
			state.items = exchanges
		},
		setExchange(state, exchange) {
			state.item = exchange
		},
		setLastItem(state, item) {
			state.pagination.lastItem = item
		},
		setPaginationHistory(state, item) {
			state.pagination.paginationHistory.push(item)
		},
		setIsFetching(state, isFetching) {
			state.pagination.isFetchingData = isFetching
		},
		resetPagination(state) {
			state.pagination = initPagination()
		},
	},
	// ----
	getters: {
		curentPage(state) {
			if (!state.pagination.paginationHistory) return 1
			return state.pagination.paginationHistory.length
		},
		filterExchanges: state => searchedTitle => {
			const { items } = state;


			if (!searchedTitle) return items

			const filterExchanges = items.filter(item => {
				return item.title && item.title.toLowerCase().includes(searchedTitle.toLowerCase())
			})

			return filterExchanges
		},

	},
	// ----
	actions: {
		// ------------------
		async getExchangeBySlug({ commit }, slug) {
			const exchange = await getExchangeBySlugFire(slug);
			// console.log(exchange);
			commit("setExchange", exchange)
		},
		// ------------------
		async getMoreExchanges({ state, commit }, { page }) {
			if (state.pagination.isFetchingData) return
			commit("setIsFetching", true)

			let exchanges, querySnapshot
			if (page === "next") {
				querySnapshot = await getMoreExchanges(state.pagination.lastItem, state.pagination.itemCount, commit);
				// ----
				exchanges = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
				commit("setLastItem", querySnapshot.docs[querySnapshot.docs.length - 1])
			} else {
				const lastItemIndex = state.pagination.paginationHistory.length - 1
				const previousItem = state.pagination.paginationHistory[lastItemIndex - 1]
				if (!previousItem) {
					commit("setIsFetching", false)
					return
				}
				state.pagination.paginationHistory.splice(lastItemIndex, 1)
				exchanges = await getLessExchanges(previousItem, state.pagination.itemCount, commit);
			}
			commit("setIsFetching", false)

			if (exchanges.length === 0) return

			// console.log(exchanges);
			commit("setExchanges", exchanges)
			if (page === "next") {
				commit("setPaginationHistory", querySnapshot.docs[0])
			}
		},
		// ------------------
		async getExchanges({ commit, state }) {
			commit("resetPagination")
			const exchanges = await getExchange(state.pagination.itemCount, commit);
			commit("setExchanges", exchanges)
			// console.log(exchanges[exchanges.length - 1]);
			// commit("setLastItem", exchanges[exchanges.length - 1])
			// commit("setPaginationHistory", exchanges[0])
		},
		// ------------------
		async setExchanges({ commit }, exchange) {
			setExchanges(exchange)
			commit("setExchanges", exchange)
		},
		// ------------------
		async createExchange({ rootState, dispatch }, { data, onSuccess }) {
			// console.log(rootState.user.data.id);
			data.slug = slugify(`${data.title} ${Date.now()}`, { lower: true, strict: true })
			data.user = rootState.user.data.id
			data.createdAt = Timestamp.fromDate(new Date())
			// ---
			await setExchanges(data)
			// const userRef = doc(db, "users", rootState.user.data.id)
			// data.user = userRef
			// await addDoc(collection(db, "exchanges", data))
			dispatch("toast/success", "Exchange was created sucesfuly!", { root: true })
			// 
			onSuccess()
		}
	}
}
