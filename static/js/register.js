console.log("JS 'script' Start");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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
const database = getDatabase(app); // Initialize the Firebase Realtime Database

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

            // Validate the form before proceeding
            if (!validateForm(name, password, email)) {
                errorMsg.textContent = "All Fields Are Required";
                return;
            }

            // Firebase authentication (create user) after validation
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User created successfully: ", user.uid);

                    // Get the Firebase ID token
                    user.getIdToken()
                        .then((idToken) => {
                            // Call the function to send data to the backend with the ID token
                            sendDataToBackend(name, email, idToken)
                                .then(() => {
                                    alert("Account created and data saved successfully!");
                                    window.location.href = "login.html"//"templates/login.html";
                                })
                                .catch((error) => {
                                    console.error("Error saving data to backend: ", error);
                                    errorMsg.textContent = "Error saving data. Please try again.";
                                });
                        })
                        .catch((error) => {
                            console.error("Error getting ID token: ", error);
                        });
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    console.error("Error creating user: ", errorMessage);
                    alert(errorMessage);
                });
        });
    } else {
        console.log("Form not found");
    }
});

// Function to validate form fields
function validateForm(name, password, email) {
    return name !== "" && password !== "" && email !== "";
}

// Function to send data to the backend with Firebase ID token
function sendDataToBackend(name, email, idToken) {
    return fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idToken: idToken,  // Firebase ID token
            name: name,
            email: email
        })
    }).then(response => {
        return response.text().then(text => {
            console.log("Server response:", text);  // Log the raw response
            try {
                return JSON.parse(text);  // Try to parse as JSON
            } catch (error) {
                throw new Error("Invalid JSON response from server");
            }
        });
    });
}

// Function to get element value by ID
const getElementByVal = (id) => {
    const element = document.getElementById(id);
    return element ? element.value.trim() : null;
};
console.log("JS 'script' Terminated");
