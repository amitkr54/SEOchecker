/**
 * Header Component
 * Global navigation header for all pages
 */

export function createHeader() {
  const currentPath = window.location.pathname;

  const navLinks = [
    { name: 'Home', path: '/' },
  ];

  const toolLinks = [
    { name: 'SEO Audit', path: '/src/tools/seo-audit/' },
    { name: 'Schema Validator', path: '/src/tools/schema-validator/' },
    { name: 'Core Web Vitals', path: '/src/tools/core-web-vitals/' },
    { name: 'Alt Text Checker', path: '/src/tools/alt-text-checker/' },
    { name: 'Meta Tag Gen', path: '/src/tools/meta-description-generator/' },
    { name: 'Keyword Density', path: '/src/tools/keyword-density-checker/' },
    { name: 'Canonical Check', path: '/src/tools/canonical-url-checker/' },
    { name: 'OG Generator', path: '/src/tools/open-graph-generator/' },
    { name: 'Speed Test', path: '/src/tools/website-speed-test/' },
    { name: 'Favicon Gen', path: '/src/tools/favicon-generator/' },
    { name: 'Robots.txt Gen', path: '/src/tools/robots-txt-generator/' },
  ];

  const isToolActive = toolLinks.some(link => currentPath.includes(link.path));

  return `
    <header class="site-header">
      <div class="containerHeader">
        <nav class="navbar">
          <a href="/" class="logo">
            <span class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="10" stroke="currentColor" stroke-width="2.5"/>
                <path d="M21 21L28 28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M10 10C11 8 13.5 7.5 16 8.5C18.5 9.5 19 12 18 14C17 16 14.5 16.5 12 15.5C9.5 14.5 9 12 10 10Z" fill="url(#featherGradient)" opacity="0.8"/>
                <defs>
                  <linearGradient id="featherGradient" x1="10" y1="8" x2="18" y2="16" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2DD4BF"/>
                    <stop offset="1" stop-color="#3B82F6"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span class="logo-text">AuditBreeze</span>
          </a>
          
          <button class="mobile-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
            <span class="hamburger"></span>
          </button>
          
          <div class="nav-container" id="navContainer">
            <ul class="nav-menu">
              ${navLinks.map(link => `
                <li><a href="${link.path}" class="nav-link ${currentPath === link.path || (link.path !== '/' && currentPath.includes(link.path)) ? 'active' : ''}">${link.name}</a></li>
              `).join('')}
              
              <li class="dropdown">
                <a href="#" class="nav-link dropdown-toggle ${isToolActive ? 'active' : ''}" id="toolsDropdown">
                  Tools <span class="arrow">▾</span>
                </a>
                <ul class="dropdown-menu">
                  ${toolLinks.map(link => `
                    <li><a href="${link.path}" class="dropdown-link ${currentPath.includes(link.path) ? 'active' : ''}">${link.name}</a></li>
                  `).join('')}
                </ul>
              </li>
              
              <li><a href="/#about" class="nav-link">About</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  `;
}

export function initHeader() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navContainer = document.getElementById('navContainer');
  const dropdownToggle = document.getElementById('toolsDropdown');

  if (toggleBtn && navContainer) {
    toggleBtn.addEventListener('click', () => {
      navContainer.classList.toggle('active');
      toggleBtn.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navContainer.contains(e.target) && !toggleBtn.contains(e.target)) {
        navContainer.classList.remove('active');
        toggleBtn.classList.remove('active');
      }
    });

    // Close menu when clicking a link (mobile)
    const links = navContainer.querySelectorAll('.nav-link, .dropdown-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (!link.classList.contains('dropdown-toggle')) {
          navContainer.classList.remove('active');
          toggleBtn.classList.remove('active');
        }
      });
    });
  }

  // Dropdown functionality for touch devices
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        dropdownToggle.parentElement.classList.toggle('active');
      }
    });
  }
}

export const headerStyles = `
<style>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eee;
  padding: 0;
}

.containerHeader {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  z-index: 1001;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0d9488 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.03em;
}

.nav-container {
  display: flex;
  align-items: center;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #4b5563;
  font-weight: 500;
  font-size: 0.9375rem;
  text-decoration: none;
  padding: 20px 0;
  display: block;
  position: relative;
  transition: color 0.2s;
}

.nav-link:hover, .nav-link.active {
  color: #0d9488;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #0d9488, #2563eb);
}

/* Dropdown Styles */
.dropdown {
  position: relative;
}

.dropdown-toggle .arrow {
  font-size: 0.8rem;
  margin-left: 2px;
  display: inline-block;
  transition: transform 0.2s;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 8px 0;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  list-style: none;
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown:hover .dropdown-toggle .arrow {
  transform: rotate(180deg);
}

.dropdown-link {
  display: block;
  padding: 10px 20px;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 400;
  transition: background 0.2s, color 0.2s;
}

.dropdown-link:hover {
  background: #f0fdfa;
  color: #0d9488;
}

.dropdown-link.active {
  color: #0d9488;
  font-weight: 600;
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: #333;
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background: #333;
  transition: 0.2s;
}

.hamburger::before { top: -8px; }
.hamburger::after { bottom: -8px; }

.mobile-toggle.active .hamburger { background: transparent; }
.mobile-toggle.active .hamburger::before { transform: translateY(8px) rotate(45deg); }
.mobile-toggle.active .hamburger::after { transform: translateY(-8px) rotate(-45deg); }

@media (max-width: 1024px) {
  .mobile-toggle { display: block; }
  
  .nav-container {
    position: fixed;
    top: 64px;
    left: 0;
    width: 100%;
    background: white;
    height: 0;
    overflow: hidden;
    transition: height 0.3s;
    border-bottom: 0 solid #eee;
    display: block;
  }
  
  .nav-container.active {
    height: calc(100vh - 64px);
    border-bottom-width: 1px;
    overflow-y: auto;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 0;
    padding: 20px;
    align-items: stretch;
  }
  
  .nav-link {
    padding: 15px 0;
    border-bottom: 1px solid #f9f9f9;
  }
  
  .nav-link.active::after { display: none; }
  
  .dropdown-menu {
    position: static;
    transform: none;
    opacity: 1;
    visibility: visible;
    box-shadow: none;
    border: none;
    padding: 0 0 0 20px;
    display: none;
  }
  
  .dropdown.active .dropdown-menu {
    display: block;
  }
  
  .dropdown.active .dropdown-toggle .arrow {
    transform: rotate(180deg);
  }
}
</style>
`;
