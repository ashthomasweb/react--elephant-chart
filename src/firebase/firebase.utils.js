import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

const config = {
  apiKey: 'AIzaSyB6OaOSeCCN2KYaf8-9Oel6jiRUkpGB9QU',
  authDomain: 'flow-post-6ab92.firebaseapp.com',
  projectId: 'flow-post-6ab92',
  storageBucket: 'flow-post-6ab92.appspot.com',
  messagingSenderId: '280575994279',
  appId: '1:280575994279:web:8584a1bcdf507573a6ee82',
}

firebase.initializeApp(config)
export const auth = firebase.auth()
export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })
export const signInWithGoogle = () => auth.signInWithPopup(provider)

export default firebase