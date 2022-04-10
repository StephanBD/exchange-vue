import { db } from "@/db"
import { addDoc, collection, doc, getDoc, getDocs, increment, query, Timestamp, updateDoc, where } from "firebase/firestore"

const extractDataFromOpportunity = async (opportunity, id) => {

	if (opportunity.fromExchange) {
		const fromExchangeDoc = await getDoc(opportunity.fromExchange)
		opportunity.fromExchange = { ...fromExchangeDoc.data(), id: fromExchangeDoc.id }
	}

	const toExchangeDoc = await getDoc(opportunity.toExchange)
	opportunity.toExchange = { ...toExchangeDoc.data(), id: toExchangeDoc.id }

	const fromUserDoc = await getDoc(opportunity.fromUser)
	opportunity.fromUser = { ...fromUserDoc.data(), id: fromUserDoc.id }
	// ----
	opportunity.id = id

	return opportunity
}


export default {
	namespaced: true,

	state() {
		return {
			opportunities: [],
			sendOpportunities: []
		}
	},

	mutations: {
		setopportunities(state, { resource, opportunities }) {
			state[resource] = opportunities
		},
		changeOpportunityStatus(state, { id, status }) {
			const index = state.opportunities.findIndex(o => o.id === id)
			state.opportunities[index].status = status
		},
	},


	actions: {
		async acceptOpportunity({ commit, dispatch }, { opportunity, onSuccess }) {
			const oppRef = doc(db, "opportunity", opportunity.id)
			await updateDoc(oppRef, { status: "accepted" })

			// ----
			if (opportunity.price) {
				const toUserRef = doc(db, "users", opportunity.toUser.id)
				await updateDoc(toUserRef,
					{ credit: increment(opportunity.price) })
				commit("user/updateCredit", opportunity.price, { root: true })
			}
			// ----
			commit("changeOpportunityStatus", { status: "accepted", id: opportunity.id })
			dispatch("toast/success", "Opportunity accepted", { root: true })

			onSuccess()
		},
		// ----
		async declineOpportunity({ commit, dispatch }, { opportunity, onSuccess }) {
			const oppRef = doc(db, "opportunity", opportunity.id)
			await updateDoc(oppRef, { status: "declined" })

			// ----
			if (opportunity.price) {
				const fromUserRef = doc(db, "users", opportunity.fromUser.id)
				await updateDoc(fromUserRef,
					{ credit: increment(opportunity.price) })
			}
			// ----
			dispatch("toast/success", "Opportunity was declined!", { root: true })
			commit("changeOpportunityStatus", { status: "declined", id: opportunity.id })
			onSuccess()
		},
		// ----
		async getOpportunities({ rootState, commit, dispatch }) {
			const { id } = rootState.user.data
			if (!id) dispatch("toast/error", "USer is not Logged in", { root: true })
			// ----
			const docRef = doc(db, "users", id)

			const docQuery = query(
				collection(db, "opportunity"),
				where("toUser", "==", docRef))
			const querySnap = await getDocs(docQuery)
			const opportunities = await Promise.all(
				querySnap.docs.map(doc => (
					extractDataFromOpportunity(doc.data(), doc.id)
				)))
			// const opportunities = querySnap.docs.map(doc => ({ ...doc.data(), id: doc.id }))
			// console.log(opportunities);

			commit("setopportunities", { resource: "opportunities", opportunities })
		},
		// ----
		async sendOpportunities({ rootState, commit, dispatch }) {
			const { id } = rootState.user.data
			if (!id) dispatch("toast/error", "USer is not Logged in", { root: true })
			// ----
			const docRef = doc(db, "users", id)
			// console.log("docRef: " + docRef);
			const docQuery = query(
				collection(db, "opportunity"),
				where("fromUser", "==", docRef))
			const querySnap = await getDocs(docQuery)
			const opportunities = await Promise.all(
				querySnap.docs.map(doc => (
					extractDataFromOpportunity(doc.data(), doc.id)
				)))
			// const opportunities = querySnap.docs.map(doc => ({ ...doc.data(), id: doc.id }))
			// console.log(opportunities);

			commit("setopportunities", { resource: "sendOpportunities", opportunities })
		},

		// ----

		async createOpportunity({ dispatch, commit }, { data, onSuccess }) {
			// const { id } = rootState.user.data
			const opportunity = {
				title: data.title,
				createAt: Timestamp.fromDate(new Date()),
				// toUser: id ? id : doc(db, "users", data.toUserId),
				toUser: doc(db, "users", data.toUserId),
				fromUser: doc(db, "users", data.fromUserId),
				toExchange: doc(db, "exchanges", data.toExchangeId),
				status: "pending"
			}

			if (data.fromExchangeId) {
				opportunity.fromExchange = doc(db, "exchanges", data.fromExchangeId)
			} else {
				opportunity.price = data.price
			}
			await addDoc(collection(db, "opportunity"), opportunity)

			if (opportunity.price) {
				await updateDoc(opportunity.fromUser,
					{ credit: increment(-opportunity.price) })
				commit("user/updateCredit", -opportunity.price, { root: true })
			}

			dispatch("toast/success", "Opportunity was send!", { root: true })
			// ----
			onSuccess()
		}
	}
}