document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navMenu = document.getElementById('nav-menu');

  if (navMenu) {
    if (token && user) {
      // User is logged in
      const isDashboardOrFeed = window.location.pathname.includes('dashboard') || window.location.pathname.includes('feed') || window.location.pathname.includes('events') || window.location.pathname.includes('add-garden') || window.location.pathname.includes('gardens');
      
      // We will leave the links mostly handled by the HTML but let's hide Login/Register dynamically if they exist
      const loginLink = Array.from(navMenu.querySelectorAll('a')).find(a => a.textContent.trim() === 'Login');
      const registerLink = Array.from(navMenu.querySelectorAll('a')).find(a => a.textContent.trim() === 'Register');
      
      if (loginLink) loginLink.parentElement.style.display = 'none';
      if (registerLink) registerLink.parentElement.style.display = 'none';
      
      // Ensure Dashboard and Logout show
      if (!isDashboardOrFeed) {
         const li1 = document.createElement('li');
         li1.innerHTML = `<a href="dashboard.html" class="btn btn-outline">Dashboard</a>`;
         navMenu.appendChild(li1);
      }
    } else {
      // Not logged in
      const logoutLink = document.getElementById('logout-btn');
      if (logoutLink) logoutLink.parentElement.style.display = 'none';
    }
  }
});
