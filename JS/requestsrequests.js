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
const movedCommentsContainer = document.getElementById('moved-comments-container');

// Post comment to Firebase
submitBtn.addEventListener('click', function () {
    if (!currentUser) {
        alert('You must be signed in to post a comment.');
        return;
    }

    const name = nameInput.value || currentUser.displayName;
    const comment = commentInput.value;

    if (comment) {
        const newCommentRef = push(ref(database, 'comments'));
        const timestamp = Date.now();

        set(newCommentRef, {
            name: name,
            comment: comment,
            timestamp: timestamp,
            uid: currentUser.uid,
            email: currentUser.email
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
    const commentKey = snapshot.key;
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.setAttribute('data-key', commentKey);

    const commentName = document.createElement('div');
    commentName.classList.add('comment-name');
    commentName.textContent = commentData.name;

    const commentEmail = document.createElement('div');
    commentEmail.classList.add('comment-email');
    commentEmail.textContent = commentData.email;

    const commentText = document.createElement('div');
    commentText.classList.add('the-request');
    commentText.textContent = commentData.comment;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';

    const moveButton = document.createElement('button');
    moveButton.classList.add('move-btn');
    moveButton.textContent = 'Complete';

    const linkInput = document.createElement('input');
    linkInput.classList.add('link-input');
    linkInput.type = 'text';
    linkInput.placeholder = 'Enter download link';

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download-btn');
    downloadButton.textContent = 'Download';

    // Determine target container
    const isMoved = commentData.moved || false;
    const targetContainer = isMoved ? movedCommentsContainer : commentsContainer;

    // owner tag and color for website owener
    if (commentData.uid === '0qqSwMKOO9ZSYsipmEV0T3ImbAb2') {
        commentEmail.classList.add('owner-comment-email');
        commentEmail.textContent = commentData.email + ' - owner';
        commentName.classList.add('owner-comment-name');
    }

    // Update UI for moved comments
    if (isMoved) {
        commentName.style.color = '#22c55e';
        commentElement.style.background = 'none';
        commentElement.style.borderBottom = '1.5px solid #a7b0c033';
        commentElement.style.borderRadius = '0';
        linkInput.style.display = 'none'; // Hide input for moved comments
        downloadButton.style.display = commentData.downloadLink ? 'block' : 'none'; // Show download button if link exists
    } else {
        downloadButton.style.display = 'none'; // Hide download button for unmoved comments
    }

    // Delete button visibility logic
    if (currentUser && (commentData.uid === currentUser.uid || currentUser.uid === '0qqSwMKOO9ZSYsipmEV0T3ImbAb2')) {
        if (currentUser.uid === '0qqSwMKOO9ZSYsipmEV0T3ImbAb2') {
            deleteButton.style.display = 'block'; // Always show delete button for this unique UID
        } else {
            deleteButton.style.display = isMoved ? 'none' : 'block'; // Hide delete button for moved comments
            deleteButton.style.margin = '10px 0 1rem 0';
        }
    } else {
        deleteButton.style.display = 'none'; // Hide delete button for other users
        commentText.style.margin = '0 0 1rem 0';
    }
    // Move button visibility logic
    if (currentUser && currentUser.uid === '0qqSwMKOO9ZSYsipmEV0T3ImbAb2' && !isMoved) {
        moveButton.style.display = 'block';
    } else {
        moveButton.style.display = 'none';
        linkInput.style.display = 'none';
    }

    // Download button visibility logic
    if (currentUser && (commentData.uid === currentUser.uid || currentUser.uid === '0qqSwMKOO9ZSYsipmEV0T3ImbAb2')) {
        if (isMoved === true) {
            downloadButton.style.display = 'block'; // Show download button for the sender and unique uid
        }
    } else {
        downloadButton.style.display = 'none'; // Hide download button for all other users
    }

    // Download button functionality
    if (commentData.downloadLink) {
        downloadButton.addEventListener('click', function () {
            const anchor = document.createElement('a');
            anchor.href = commentData.downloadLink;
            anchor.download = 'download';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        });
    }

    // Move button functionality
    moveButton.addEventListener('click', function () {
        const linkValue = linkInput.value;

        if (!linkValue) {
            alert('Please enter a link before moving the comment.');
            return;
        }

        const commentRef = ref(database, 'comments/' + commentKey);
        set(commentRef, {
            ...commentData,
            moved: true,
            downloadLink: linkValue
        }).then(() => {
            movedCommentsContainer.appendChild(commentElement);
            deleteButton.style.display = 'none'; // Hide delete button after moving
            moveButton.style.display = 'none';
            linkInput.style.display = 'none';
            downloadButton.style.display = 'block'; // Show the download button after moving
        }).catch((error) => {
            console.error('Error updating move status:', error);
        });

        setTimeout(function(){
            location.reload();
        }, 200);
    });

    // Delete button functionality
    deleteButton.addEventListener('click', function () {
        const commentRef = ref(database, 'comments/' + commentKey);

        // Remove the comment from Firebase
        remove(commentRef).then(() => {
            commentElement.remove(); // Remove from DOM
            console.log('Comment deleted successfully');
        }).catch((error) => {
            console.error('Error deleting comment:', error);
        });
    });

    commentElement.appendChild(commentName);
    commentElement.appendChild(commentEmail);
    commentElement.appendChild(commentText);
    commentElement.appendChild(deleteButton);
    commentElement.appendChild(moveButton);
    commentElement.appendChild(linkInput);
    commentElement.appendChild(downloadButton);

    targetContainer.appendChild(commentElement);
});
