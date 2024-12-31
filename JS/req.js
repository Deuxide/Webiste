const sidebar = document.getElementById('sidebar');
const toggleButton = document.getElementById('shownav');

// Set the initial state
sidebar.classList.add('dontshow');
toggleButton.textContent = 'Open Sidebar';

function toggleSidebar() {
    if (sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
        sidebar.classList.add('dontshow');
        toggleButton.textContent = 'Open Sidebar'; // Update button text
    } else {
        sidebar.classList.remove('dontshow');
        sidebar.classList.add('show');
        toggleButton.textContent = 'Close Sidebar'; // Update button text
    }
}


//copy email
const copyTextElement = document.getElementById('userEmail');

// Add event listener for click event
copyTextElement.addEventListener('click', function() {
    // Create a temporary text area element to hold the text
    const textToCopy = copyTextElement.textContent;

    // Use the Clipboard API to copy the text to clipboard
    navigator.clipboard.writeText(textToCopy).then(function() {
        alert('Text copied to clipboard!');
    }).catch(function(err) {
        console.error('Error copying text: ', err);
    });
});


// search
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const section = document.getElementById(searchTerm);

        if (section) {
        // If the section exists, scroll to it
        section.scrollIntoView({ behavior: 'smooth' });
        } else {
        //alert('Searched word not found');
        document.getElementById('searchInput').style.background = '#721919';
        document.getElementById('searchInput').style.color = 'var(--colors)';
        }

        if (document.getElementById('searchInput').style.color === 'var(--colors)') {
            setTimeout(function(){
                document.getElementById('searchInput').style.background = 'var(--colors)';
                document.getElementById('searchInput').style.color = 'var(--colorp)';
            }, 400);
        }
    }

});

