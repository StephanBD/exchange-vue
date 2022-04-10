import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { db } from "@/db"
export default {
	// ----
	namespaced: true,
	// ----
	state() {
		return {
			auth: {
				isProcessing: false,
				error: ""
			},
			data: null
		}
	},
	// ----
	mutations: {
		setauthIsProcessing(state, isProcessing) {
			state.auth.isProcessing = isProcessing
		},
		setAuthError(state, error) {
			state.auth.error = error
		},
		setUser(state, user) {
			state.data = user
			// console.log(user);
		},
		updateProfile(state, profile) {
			state.data = { ...state.data, ...profile }
		},
		updateCredit(state, credit) {
			state.data.credit += credit
		},
	},

	// ----
	actions: {
		async uploadImage(_, { bytes, name, onSuccess, onProgress }) {
			const storage = getStorage()
			const storageRef = ref(storage, name)

			// const uploadResult = await uploadBytesResumable(storageRef, bytes)
			// const downloadURL = await getDownloadURL(uploadResult.ref)

			const uploadTask = uploadBytesResumable(storageRef, bytes)

			uploadTask.on("state_changed", (snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				onProgress(progress)
			},
				(error) => {
					console.log(error);
				},
				async () => {
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
					onSuccess(downloadURL)
				}
			)


		},
		// ----
		onAuthChange({ dispatch, commit }, callback) {
			commit("setauthIsProcessing", true)
			onAuthStateChanged(getAuth(), async (user) => {
				if (user) {
					// console.log(user);
					await dispatch("getUserProfile", user)
					commit("setauthIsProcessing", false)
					callback(user)
					// console.log(userProfile);
				} else {
					// console.log("logged out");
					commit("setauthIsProcessing", false)
					callback(null)
				}
			})

		},
		// ----
		async getUserProfile({ commit }, user) {
			const docRef = doc(db, "users", user.uid)
			const docSnap = await getDoc(docRef)
			const userProfile = docSnap.data()
			// ----
			const docQuery = query(
				collection(db, "exchanges"),
				where("user", "==", user.uid))

			const querySnap = await getDocs(docQuery)
			// const exchanges = querySnap.docs.map(doc => doc.data())
			const exchanges = querySnap.docs.map(doc => ({ ...doc.data(), id: doc.id }))
			// console.log(exchanges);
			// ----
			const userWithProfile = {
				id: user.uid,
				email: user.email,
				...userProfile,
				exchanges
			}
			// console.log(docRef);
			commit("setUser", userWithProfile)
		},
		// ----
		async register({ commit, dispatch }, { email, password, username }) {
			// console.log(email, password);

			commit("setauthIsProcessing", true)
			commit("setAuthError", "")

			const auth = getAuth()
			try {
				const { user } = await createUserWithEmailAndPassword(auth, email, password)
				await dispatch("createUserProfile", {
					id: user.uid,
					credit: 0,
					username,
					exchanges: [],
					avatar: "https://365psd.com/images/istock/previews/1009/100996291-male-avatar-profile-picture-vector.jpg",
				})
				// alert("User has been registered")
				// return userCredentials.user
				// ----
			} catch (error) {
				// console.log(error);
				commit("setAuthError", error.message)
				dispatch("toast/error", error.message, { root: true })
			}
			finally {
				commit("setauthIsProcessing", false)
			}
		},
		// ----
		async createUserProfile(_, { id, ...profile }) {
			await setDoc(doc(db, "users", id), { ...profile, id })
		},
		// ----
		async logout({ commit }) {
			try {
				await signOut(getAuth())
				commit("setUser", null)
			} catch (e) {
				console.log("Cannot logout");
			}
		},
		// ----
		async login({ commit, dispatch }, { email, password }) {
			commit("setauthIsProcessing", true)
			commit("setAuthError", "")

			// const auth = getAuth()

			try {
				// const { user } =
				await signInWithEmailAndPassword(getAuth(), email, password)
				// await dispatch("setUser", {
				// 	id: user.uid,
				// 	credit: 0,
				// 	username,
				// 	exchanges: [],
				// 	avatar: "https://365psd.com/images/istock/previews/1009/100996291-male-avatar-profile-picture-vector.jpg",
				// })
			} catch (e) {
				commit("setAuthError", e.message)
				dispatch("toast/error", e.message, { root: true })
			}
			finally {
				commit("setauthIsProcessing", false)
			}
		},

		async updateProfile({ commit, dispatch }, { data, onSuccess }) {
			try {
				const userRef = doc(db, "users", data.id)
				if (data.exchanges) {
					delete data.exchanges
				}
				await updateDoc(userRef, data)
				commit("updateProfile", data)
				dispatch("toast/success", "Profile has been updated!", { root: true })
				onSuccess()
			} catch (error) {
				console.log(error);
			}
		}
	},

	// ----
	getters: {
		isAuthenticated(state) {
			return !!state.data;
		},
		exchangeOwner: state => exchangeUserId => (
			state.data &&
			exchangeUserId &&
			state.data.id === exchangeUserId),


	}

	// exchangeOwner(state) {
	// 	return function (exchangeUserId) {
	// 		return (
	// 			state.data &&
	// 			exchangeUserId &&
	// 			state.data.id === exchangeUserId
	// 		)
	// 	}
	// }
}
