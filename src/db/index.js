import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, getDocs, query, where, getDoc, doc, limit, startAfter, startAt } from "firebase/firestore"
// import { getDatabase, ref, set, get, child, push, update, remove } from "firebase/database";


// ----
// const firebaseApp =
// initializeApp({
// 	apiKey: "AIzaSyB3SmyVQezFqB1slr4onBaTlv68qz4XQIU",
// 	authDomain: "fire-nuxt-6e717.firebaseapp.com",
// 	projectId: "fire-nuxt-6e717",
// 	storageBucket: "fire-nuxt-6e717.appspot.com",
// 	messagingSenderId: "983880750103",
// 	appId: "1:983880750103:web:904eff4a92cfcfb90cb852"
// });
initializeApp({
	apiKey: process.env.VUE_APP_API_KEY,
	authDomain: process.env.VUE_APP_AUTH_DOMAIN,
	projectId: process.env.VUE_APP_PROJECT_ID,
	storageBucket: process.env.VUE_APP_STORAGE_BUCKETS,
	messagingSenderId: process.env.VUE_APP_SENDER_ID,
	appId: process.env.VUE_APP_APP_ID
});

// ----
export const db = getFirestore()
// ----


// ----
async function getExchangeUser(id) {
	const docRef = doc(db, "users", id);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data()
	} else {
		// doc.data() will be undefined in this case
		console.log("No such document!");
	}
}
// ----
export async function setExchanges(data) {
	// Add a new document with a generated id.
	const docRef = await addDoc(collection(db, "exchanges"), data);
	console.log("Document written with ID: ", docRef.id);
}

// ----
export async function getMoreExchanges(from, limitNum) {
	const q = query(
		collection(db, "exchanges"),
		startAfter(from),
		limit(limitNum));

	const querySnapshot = await getDocs(q);
	return querySnapshot
	// const toSend = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
	// setLastItem("setLastItem", querySnapshot.docs[querySnapshot.docs.length - 1])
	// return toSend
}
// ----
export async function getLessExchanges(at, limitNum, setLastItem) {
	const q = query(
		collection(db, "exchanges"),
		startAt(at),
		limit(limitNum));

	const querySnapshot = await getDocs(q);
	const toSend = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
	setLastItem("setLastItem", querySnapshot.docs[querySnapshot.docs.length - 1])
	return toSend
}
// ----
export async function getExchange(limitNum, commit) {
	const q = query(collection(db, "exchanges"), limit(limitNum));

	const querySnapshot = await getDocs(q);
	const toSend = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
	commit("setLastItem", querySnapshot.docs[querySnapshot.docs.length - 1])
	commit("setPaginationHistory", querySnapshot.docs[0])
	return toSend

}

// ----
export async function getExchangeBySlugFire(slug) {
	const q = query(collection(db, "exchanges"), where("slug", "==", slug));
	let toSend = {}
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		toSend = { ...doc.data() }
		toSend.id = doc.id
		// console.log(doc.id);
	});
	// ----
	const userSnap = await getExchangeUser(toSend.user)
	// console.log(userSnap);
	// console.log(toSend.user);
	toSend.user = { ...userSnap, id: toSend.user }
	// toSend.user.id = "xxxx"


	return toSend

}


