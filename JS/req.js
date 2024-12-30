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
