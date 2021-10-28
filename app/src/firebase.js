import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyBNU-AffpKQRWX4pY0EeGEj8cj0efTuwAU",
    authDomain: "devs-united-732ec.firebaseapp.com",
    projectId: "devs-united-732ec",
    storageBucket: "devs-united-732ec.appspot.com",
    messagingSenderId: "620557966148",
    appId: "1:620557966148:web:34055605991fb26d909511"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// Exporta la funcionalidad de la DB
export const firestore = firebase.firestore()
//el modulo de autenticación
export const auth = firebase.auth();
//el proveedor de autenticación
export const provider = new firebase.auth.GoogleAuthProvider();
//la utilidad para hacer login con el pop-up
export const loginConGoogle = () => auth.signInWithPopup(provider);
//la utilidad para hacer logout
export const logout = () => auth.signOut();
// exporta el paquete de firebase para poder usarlo
export default firebase
