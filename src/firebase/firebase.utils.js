import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
		apiKey: "AIzaSyBdpbwOTK2I8NY_Ntc4CzxAAeaK923gmSI",
		authDomain: "crwn-db-80e82.firebaseapp.com",
		databaseURL: "https://crwn-db-80e82.firebaseio.com",
		projectId: "crwn-db-80e82",
		storageBucket: "crwn-db-80e82.appspot.com",
		messagingSenderId: "821604616189",
		appId: "1:821604616189:web:e679ab437d1e1a3774bb94",
		measurementId: "G-D8MVPF5DLC"
	};

	firebase.initializeApp(config);

	export const createUserProfileDocument = async (userAuth, additionalData) => {
		if(!userAuth) return;

		const userRef = firestore.doc(`users/${userAuth.uid}`);
		const snapShot = await userRef.get();

		if(!snapShot.exists) {
			const { displayName, email } = userAuth;
			const createdAt = new Date();

			try {
				await userRef.set({
					displayName,
					email,
					createdAt,
					...additionalData
				})
			} catch (error) {
				console.log('error creating user', error.message)
			}
		}

		return userRef;
	}

	export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
		const collectionRef = firestore.collection(collectionKey);
		const batch = firestore.batch();
		objectsToAdd.forEach(obj => {
			const newDocRef = collectionRef.doc();
			batch.set(newDocRef, obj)
		});

		return await batch.commit()
	}

	export const convertCollectionsSnapshotToMap = (collections) => {
		const transformedCollection = collections.docs.map(doc => {
			const { title, items } = doc.data();

			return {
				routeName: encodeURI(title.toLowerCase()),
				id: doc.id,
				title,
				items
			}
		})

		return transformedCollection.reduce((accumulator, collection) => {
			accumulator[collection.title.toLowerCase()] = collection;
			return accumulator;
		}, {})
	}

	export const auth = firebase.auth();
	export const firestore = firebase.firestore();

	const provider = new firebase.auth.GoogleAuthProvider();
	provider.setCustomParameters({ prompt: 'select_account' });
	export const signInWithGoogle = () => auth.signInWithPopup(provider);

	export default firebase;
