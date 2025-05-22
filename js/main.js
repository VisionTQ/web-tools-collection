// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    // Initialize any necessary functionality
    console.log('Website loaded successfully!');
});

// Utility function to add new page links dynamically
function addPageLink(title, url, description) {
    const grid = document.querySelector('.grid');
    const linkElement = document.createElement('div');
    linkElement.className = 'page-card';
    
    linkElement.innerHTML = `
        <h3><a href="${url}">${title}</a></h3>
        <p>${description}</p>
    `;
    
    grid.appendChild(linkElement);
}

// Function to update navigation menu
function updateNavigation(pages) {
    const navLinks = document.querySelector('.nav-links');
    pages.forEach(page => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${page.url}">${page.title}</a>`;
        navLinks.appendChild(li);
    });
} 