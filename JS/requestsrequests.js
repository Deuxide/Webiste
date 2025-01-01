// Import Firebase functions (modular SDK)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { getDatabase, ref, set, onChildAdded, push, remove } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js';

// Firebase configuration (replace with your own config from Firebase Console)
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

let currentUser = null;

// Monitor auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        console.log('Signed in as:', currentUser.displayName);
    } else {
        console.error('User is not signed in.');
        window.location.href = "../login.html"; // Redirect to login page if not signed in
    }
});

// DOM Elements
const nameInput = document.getElementById('name');
const commentInput = document.getElementById('comment');
const submitBtn = document.getElementById('submitBtn');
const commentsContainer = document.getElementById('comments');

// Post comment to Firebase
submitBtn.addEventListener('click', function() {
    if (!currentUser) {
        alert('You must be signed in to post a comment.');
        return;
    }

    const name = nameInput.value || currentUser.displayName;
    const comment = commentInput.value;

    if (comment) {
        const newCommentRef = push(ref(database, 'comments'));
        const timestamp = Date.now();  // Get the current timestamp

        set(newCommentRef, {
            name: name,
            comment: comment,
            timestamp: timestamp, // Save the timestamp along with the comment
            uid: currentUser.uid,  // Save the user's UID
            email: currentUser.email  // Save the user's email address
        }).then(() => {
            nameInput.value = '';
            commentInput.value = '';
        }).catch((error) => {
            console.error('Error posting comment:', error);
        });
    }
});

// Display comments from Firebase
const commentsRef = ref(database, 'comments');
onChildAdded(commentsRef, (snapshot) => {
    const commentData = snapshot.val();
    const commentKey = snapshot.key; // Get the unique key for each comment
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.setAttribute('data-key', commentKey); // Add the data-key for easy reference

    const commentName = document.createElement('div');
    commentName.classList.add('comment-name');
    commentName.textContent = commentData.name;

    const commentEmail = document.createElement('div'); // New element for email
    commentEmail.classList.add('comment-email');
    commentEmail.textContent = commentData.email + ' - website owner'; // Display the email

    const commentText = document.createElement('div');
    commentText.classList.add('the-request');
    commentText.textContent = commentData.comment;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';

    // Check if the current user's UID matches the comment's UID
    if (currentUser && commentData.uid === currentUser.uid) {
        deleteButton.style.display = 'block'; // Show delete button

        // Delete comment from Firebase and remove from DOM
        deleteButton.addEventListener('click', function() {
            const commentRef = ref(database, 'comments/' + commentKey); // Get reference to the comment by its key

            // Remove the comment from Firebase
            remove(commentRef).then(() => {
                // Find and remove the comment from the DOM immediately
                commentElement.remove(); 
                console.log('Comment deleted successfully');
            }).catch((error) => {
                console.error('Error deleting comment:', error);
            });
        });
    } else {
        deleteButton.style.display = 'none'; // Hide delete button
    }

    commentElement.appendChild(commentName);
    commentElement.appendChild(commentEmail); // Add email element
    commentElement.appendChild(commentText);
    commentElement.appendChild(deleteButton);

    commentsContainer.appendChild(commentElement);
});
