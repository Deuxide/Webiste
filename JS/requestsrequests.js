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
const movedCommentsContainer = document.getElementById('moved-comments-container'); // New container for moved comments


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
    commentEmail.textContent = commentData.email; // Display the email

    const commentText = document.createElement('div');
    commentText.classList.add('the-request');
    commentText.textContent = commentData.comment;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';

    const moveButton = document.createElement('button'); // New move button
    moveButton.classList.add('move-btn');
    moveButton.textContent = 'Complete';

    if (currentUser && commentData.uid === '0qqSwMKOO9ZSYsipmEV0T3ImbAb2') {
        commentName.classList.add('owner-comment-name');
        commentEmail.classList.add('owner-comment-email');
        commentEmail.textContent = commentData.email + ' - owner';
    } else {
        commentText.textContent = commentData.comment;
    }

    // Check if the comment has been moved
    const isMoved = commentData.moved || false;
    const targetContainer = isMoved ? movedCommentsContainer : commentsContainer; // Use moved container if moved

    // Check if the current user's UID matches the comment's UID
    if (currentUser && commentData.uid === currentUser.uid) {
        // Hide delete button if the comment is moved
        if (isMoved === false) {
            deleteButton.style.display = 'block'; // Show delete button only if the comment is not moved
            moveButton.style.display = 'block';
        } else {
            deleteButton.style.display = 'none'; // Hide delete button if the comment is moved
            moveButton.style.display = 'none';
        }

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
        deleteButton.style.display = 'none'; // Hide delete button if not the current user
    }

    if (isMoved === true) {
        commentName.style.color = '#22c55e'
        commentText.style.width = '90%';
        deleteButton.style.margin = '10px 0 1.5rem 0';
        commentElement.style.width = '90%';
        commentElement.style.background = 'none';
        commentElement.style.borderBottom = '1.5px solid #a7b0c033';
        commentElement.style.borderRadius = '0';
    }

    if (currentUser && currentUser.uid === '0qqSwMKOO9ZSYsipmEV0T3ImbAb2') {
        if(isMoved === false) {
            moveButton.style.display = 'block';
            deleteButton.style.display = 'block'; // Show move button for the specific user
        } else {
            deleteButton.style.display = 'block';
            moveButton.style.display = 'none';
        }
    } else {
        moveButton.style.display = 'none'; // Hide move button for all other users
        commentText.style.margin = '0 0 1.5rem 0';
    }
    // Move comment to new container and update moved status in Firebase
    moveButton.addEventListener('click', function() {
        // Update the 'moved' status in Firebase
        const commentRef = ref(database, 'comments/' + commentKey);
        set(commentRef, {
            ...commentData, // Retain the existing comment data
            moved: true      // Set the 'moved' flag to true
        }).then(() => {
            // Move the comment to the moved-comments-container
            movedCommentsContainer.appendChild(commentElement);
            // Disable delete button after moving the comment
            deleteButton.style.display = 'none';
            console.log('Comment moved and delete disabled');
        }).catch((error) => {
            console.error('Error updating move status:', error);
        });
    });

    commentElement.appendChild(commentName);
    commentElement.appendChild(commentEmail); // Add email element
    commentElement.appendChild(commentText);
    commentElement.appendChild(deleteButton);
    commentElement.appendChild(moveButton); // Add the move button

    targetContainer.appendChild(commentElement); // Append to the correct container (original or moved)
});