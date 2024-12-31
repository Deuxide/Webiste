// script.js
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const section = document.getElementById(searchTerm);

    if (section) {
      // If the section exists, scroll to it
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Searched word not found');
    }
  }
});
