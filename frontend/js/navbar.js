// js/navbar.js

// Load global notification system
if (!document.getElementById('ur-toast-container')) {
  const s = document.createElement('script');
  s.src = 'js/notifications.js';
  document.head.appendChild(s);
}

// Load Groot AI globally
if (!document.getElementById('groot-btn')) {
  const g = document.createElement('script');
  g.src = 'js/groot.js';
  document.head.appendChild(g);
}

// Inject CSS for the Sidebar Navigation dynamically
const style = document.createElement('style');
style.innerHTML = `
  /* Legacy Top Nav Hiding */
  nav.glass.sticky { display: none !important; }

  /* Side Nav Container */
  .side-nav-container {
    position: fixed;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }


  /* ── Fixed Top-Left Brand Logo ── */
  .ur-topleft-logo {
    position: fixed;
    top: 24px;
    left: 20px;
    z-index: 1100;
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    cursor: pointer;
  }
  .ur-topleft-logo-icon {
    width: 48px;
    height: 48px;
    background: #10b981;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
    box-shadow: 0 4px 12px rgba(16,185,129,0.2);
    transition: transform 0.3s;
    flex-shrink: 0;
  }
  .ur-topleft-logo:hover .ur-topleft-logo-icon {
    transform: scale(1.05) rotate(-5deg);
  }
  .ur-topleft-logo-text {
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
    line-height: 1.1;
    transition: color 0.2s;
  }
  .ur-topleft-logo:hover .ur-topleft-logo-text {
    color: #16a34a;
  }


  .side-nav-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 15px rgba(0,0,0,0.06);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: #1e293b;
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
    width: 48px;
    height: 48px;
    white-space: nowrap;
  }

  /* Hover & Active States */
  .side-nav-item:hover, .side-nav-item.active {
    width: 145px;
    background: #10b981;
    border-color: #34d399;
    color: white;
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  }

  /* Icon */
  .side-nav-icon {
    font-size: 1.25rem;
    min-width: 26px;
    display: flex;
    justify-content: center;
    transition: transform 0.3s, color 0.3s;
  }
  .side-nav-item:hover .side-nav-icon, .side-nav-item.active .side-nav-icon {
    transform: scale(1.15);
    color: white !important;
  }

  /* Text */
  .side-nav-text {
    font-weight: 700;
    font-size: 0.85rem;
    margin-left: 10px;
    opacity: 0;
    transform: translateX(-15px);
    transition: all 0.3s ease-out;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  
  .side-nav-item:hover .side-nav-text, .side-nav-item.active .side-nav-text {
    opacity: 1;
    transform: translateX(0);
  }

  /* Global Layout Adjustments to avoid fixed element overlaps */
  body {
    padding-top: 110px !important;
    padding-left: 90px !important;
  }

  /* Push body content to avoid overlap on smaller screens */
  @media (max-width: 1024px) {
    body { 
      padding-left: 75px !important; 
      padding-top: 120px !important;
    }
    .side-nav-container { left: 8px; gap: 8px; }
    .ur-topleft-logo { left: 15px; }
  }
  
  @media (max-width: 640px) {
    body {
      padding-left: 15px !important;
      padding-bottom: 80px !important;
    }
    .side-nav-container {
      left: 50% !important;
      bottom: 20px !important;
      top: auto !important;
      transform: translateX(-50%) !important;
      flex-direction: row !important;
      width: max-content !important;
      padding: 6px !important;
      background: rgba(255,255,255,0.9) !important;
      border-radius: 100px !important;
    }
  }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
  // Hide any existing old top navbars instantly
  document.querySelectorAll('nav').forEach(n => n.style.display = 'none');

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const isAuth = token && userStr;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Define navigation layout
  const navItems = [
    { href: 'index.html', icon: '<i class="fa-solid fa-house text-orange-500"></i>', text: 'Home' },
    { href: 'gardens.html', icon: '<i class="fa-solid fa-leaf text-emerald-500"></i>', text: 'Gardens' },
    { href: 'marketplace.html', icon: '<i class="fa-solid fa-cart-shopping text-blue-500"></i>', text: 'Market' },
    { href: 'events.html', icon: '<i class="fa-solid fa-calendar-days text-purple-500"></i>', text: 'Events' },
    { href: 'feed.html', icon: '<i class="fa-solid fa-comment-dots text-pink-500"></i>', text: 'Feed' },
    { href: 'knowledge.html', icon: '<i class="fa-solid fa-book-atlas text-teal-500"></i>', text: 'Grow Guide' }
  ];

  if (isAuth) {
    navItems.push({ href: 'dashboard.html', icon: '<i class="fa-solid fa-chart-pie text-indigo-500"></i>', text: 'Dashboard' });
    navItems.push({ href: '#', icon: '<i class="fa-solid fa-right-from-bracket text-red-500"></i>', text: 'Logout', action: 'logout()' });
  } else {
    navItems.push({ href: 'login.html', icon: '<i class="fa-solid fa-right-to-bracket text-blue-500"></i>', text: 'Login' });
  }

  // Inject fixed top-left logo
  const logoEl = document.createElement('a');
  logoEl.href = 'index.html';
  logoEl.className = 'ur-topleft-logo';
  logoEl.title = 'UrbanRoots Home';
  logoEl.innerHTML = `
    <div class="ur-topleft-logo-icon"><i class="fa-solid fa-leaf"></i></div>
    <div class="ur-topleft-logo-text">Urban<br>Roots</div>
  `;
  document.body.appendChild(logoEl);

  // Build the sidebar
  const sideNav = document.createElement('div');
  sideNav.className = 'side-nav-container';

  // Logo at the top
  let navHTML = '';


  navItems.forEach(item => {
    // Exact match or handle empty path for index
    const isActive = (currentPath === item.href) || (currentPath === '' && item.href === 'index.html') ? 'active' : '';
    const onClick = item.action ? `onclick="${item.action}"` : '';
    const href = item.action ? 'javascript:void(0)' : item.href;

    navHTML += `
      <a href="${href}" ${onClick} class="side-nav-item ${isActive}" title="${item.text}">
        <span class="side-nav-icon">${item.icon}</span>
        <span class="side-nav-text">${item.text}</span>
      </a>
    `;
  });

  sideNav.innerHTML = navHTML;
  document.body.appendChild(sideNav);
});

function logout() {
  if (typeof showConfirm === 'function') {
    showConfirm(
      'Are you sure you want to log out of your account?',
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
      },
      { title: 'Log Out?', icon: '<i class="fa-solid fa-right-from-bracket text-red-500"></i>', confirmText: 'Yes, Log Out', confirmClass: 'red' }
    );
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
}
