import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDh-yS0dsCY8ByYLFPiOU9h11m8kV5JFzk",
    authDomain: "deuxite.firebaseapp.com",
    databaseURL: "https://deuxite-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "deuxite",
    storageBucket: "deuxite.firebasestorage.app",
    messagingSenderId: "477722605776",
    appId: "1:477722605776:web:a1e077450c894b4653c6d5",
    measurementId: "G-5G6484FCCL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const user = auth.currentUser;

function updateUserProfile(user) {
    const userName = user.displayName;
    const userEmail = user.email;
    const userProfilePicture = user.photoURL;

    document.getElementById("userName").textContent = userName;    
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userProfilePicture").src = userProfilePicture;    
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, call the updateUserProfile function
        updateUserProfile(user);
        const uid = user.uid;
        return uid;
    } else {
        // User is not signed in, redirect to the registration page
        alert("Create Account & login");
    }
});