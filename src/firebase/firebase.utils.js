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

export const createNewUserProfile = async (userAuth, additionalData) => {
  if (!userAuth) return

  const userRef = firestore.doc(`users/${userAuth.uid}`)

  const snapShot = await userRef.get()
  
  if (!snapShot.exists) {
    const { displayName, email } = userAuth
    const createdAt = new Date()

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

}

export const getUserRef = async (userAuth) => {
  if (!userAuth) return
  const userRef = firestore.doc(`users/${userAuth.uid}`)
  return userRef
}

export const saveUserBoard = async (userAuth, boardObj) => {
  const boardRef = firestore.doc(`users/${userAuth.uid}/boards/${boardObj.name}`)

  const snapShot = await boardRef.get()

  if (!snapShot.exists) {
    const { name, notes } = boardObj

    try {
      await boardRef.set({
        name,
        notes
      })
    } catch (error) {
      console.log('error creating board', error.message)
    }
  } else if (snapShot.exists) {
    const { notes } = boardObj
    
    try {
      await boardRef.update({
        notes
      })
    } catch (error) {
      console.log('error creating board', error.message)
    }
  }

  getUserBoards(userAuth)
  
}

export const getUserBoards = (userAuth) => {
  if (!userAuth) return

  userBoards = []
  firestore.collection('users').doc(`${userAuth.uid}`).collection('boards').get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      userBoards.push(doc.data())
    })
    console.log('0', userBoards)

  })
  .then(() => {
    console.log('1', userBoards)
  })
  console.log('2', userBoards)
  
}

export var userBoards = []

firebase.initializeApp(config)
export const auth = firebase.auth()
export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })
export const signInWithGoogle = () => auth.signInWithPopup(provider)

export default firebase