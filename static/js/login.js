console.log("JS 'login' Start");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcpvlMingxcG9TG7ORaAjk5I3ABFMzg9I",
    authDomain: "dataentry-908.firebaseapp.com",
    projectId: "dataentry-908",
    storageBucket: "dataentry-908.appspot.com",
    messagingSenderId: "740806456718",
    appId: "1:740806456718:web:075ca62baa73e48a8260df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");

    const form = document.getElementById("FormBox");
    const errorMsg = document.getElementById("error-message");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = getElementByVal("name");
            const password = getElementByVal("password");
            const email = getElementByVal("email");

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    LoadData();
                    alert("Logged in successfully!");
                    //                     window.location.href = "templates/home.html";
                    console.log("Redirect to Home");
                    window.location.href = "/home.html";
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    errorMsg.textContent = errorMessage;
                });

            // form.reset();
        });
    } else {
        console.log("Form Not Found");
    }
});

// Function to get element value by ID
const getElementByVal = (id) => {
    const element = document.getElementById(id);
    return element ? element.value.trim() : null;
};


function LoadData() {
    const username = document.getElementById('name').value;
    const userRef = ref(database, 'users/' + username);

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("User Data: ", userData);
            document.getElementById('email').value = userData.email;
            document.getElementById('password').value = userData.password;
        } else {
            console.log("No data available for this user.");
            alert("User not found.");
        }
    }).catch((error) => {
        console.error("Error fetching user data: ", error);
    });
}

console.log("JS 'login' Terminated");
