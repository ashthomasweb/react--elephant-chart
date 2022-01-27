import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

let config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
}

// returns reference object for user login
export const getUserRef = async (userAuth) => {
  if (!userAuth) return
  const userRef = firestore.doc(`users/${userAuth.uid}`)
  return userRef
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
        ...additionalData,
      })
    } catch (error) {
      console.log('error creating user', error.message)
    }
  }
}

export const saveUserBoard = async (userAuth, boardObj) => {
  if (boardObj.name === '') return

  const boardRef = firestore.doc(
    `users/${userAuth.uid}/boards/${boardObj.name}`
  )

  const snapShot = await boardRef.get()

  if (!snapShot.exists) {
    const { name, notes, backgroundColor } = boardObj
    try {
      await boardRef.set({
        name,
        notes,
        backgroundColor
      })
    } catch (error) {
      console.log('error creating board', error.message)
    }
  } else if (snapShot.exists) {
    const { notes, backgroundColor } = boardObj
    try {
      await boardRef.update({
        notes,
        backgroundColor
      })
    } catch (error) {
      console.log('error creating board', error.message)
    }
  }

  getUserBoards(userAuth)
}

export const deleteUserBoard = async (userAuth, boardName) => {
  const boardRef = firestore.doc(
    `users/${userAuth.uid}/boards/${boardName}`
  )

  const snapShot = await boardRef.get()

 
  if (snapShot.exists) {
    try {
      await boardRef.delete()
    } catch (error) {
      console.log('error deleting board', error.message)
    }
  }

  getUserBoards(userAuth)
}


// retrieves saves user boards from firestore db
// called when App.js mounts and when user saves a board
// userboard obj gets passed back to Board Component
export const getUserBoards = (userAuth) => {
  if (!userAuth) return
  userBoards = []
  firestore
    .collection('users')
    .doc(`${userAuth.uid}`)
    .collection('boards')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        userBoards.push(doc.data())
      })
    })
}

export const clearBoards = () => {
  userBoards = []
}
export var userBoards = []

firebase.initializeApp(config)
export const auth = firebase.auth()
export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })
export const signInWithGoogle = () => auth.signInWithPopup(provider)

export default firebase