

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

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
const analytics = getAnalytics(app);

import {getDatabase, ref, set, remove} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const db = getDatabase();

let FnameInp = document.getElementById('FnameInp');
let AnswerInp = document.getElementById('AnswerInp')

let addbtn = document.getElementById('addbtn')
let delbtn = document.getElementById('delbtn')

function adddata(){
    set(ref(db, 'Answer/' + FnameInp.value), {
    answer: AnswerInp.value
    })
    .catch(()=>{
    alert("unsuccsesful");
    console.log(error);
    })
}

function deletedata(){
    remove(ref(db, 'Answer/' + FnameInp.value))
    .catch(()=>{
    alert("unsuccsesful");
    console.log(error);
    })
}

addbtn.addEventListener('click', adddata);
delbtn.addEventListener('click', deletedata);

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "u") {
        event.preventDefault();
        alert("Viewing the source code is disabled!");
    }
    // Disable F12
    if (event.key === "F12") {
        event.preventDefault();
        alert("Developer tools are disabled!");
    }
    // Disable Ctrl+Shift+I or Ctrl+Shift+C
    if (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "C")) {
        event.preventDefault();
        alert("Inspect functionality is disabled!");
    }
});