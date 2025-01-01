// Import Firebase functions (modular SDK)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
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
const database = getDatabase(app);

// Generate or retrieve a unique client ID for the current device
let clientId = localStorage.getItem('clientId');
if (!clientId) {
    clientId = crypto.randomUUID(); // Generate a new UUID
    localStorage.setItem('clientId', clientId);
}

// DOM Elements
const nameInput = document.getElementById('name');
const commentInput = document.getElementById('comment');
const submitBtn = document.getElementById('submitBtn');
const commentsContainer = document.getElementById('comments');

// Post comment to Firebase
submitBtn.addEventListener('click', function() {
    const name = nameInput.value;
    const comment = commentInput.value;

    if (name && comment) {
        const newCommentRef = push(ref(database, 'comments'));
        const timestamp = Date.now();  // Get the current timestamp

        set(newCommentRef, {
            name: name,
            comment: comment,
            timestamp: timestamp, // Save the timestamp along with the comment
            clientId: clientId    // Save the client ID
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

    const commentText = document.createElement('div');
    commentText.classList.add('the-request');
    commentText.textContent = commentData.comment;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';

    // Check if the current device matches the comment's clientId
    if (commentData.clientId === clientId) {
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
    commentElement.appendChild(commentText);
    commentElement.appendChild(deleteButton);

    commentsContainer.appendChild(commentElement);
});
