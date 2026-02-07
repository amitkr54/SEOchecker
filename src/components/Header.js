/**
 * Header Component
 * Global navigation header for all pages
 */

export function createHeader() {
  return `
    <header class="site-header">
      <div class="container">
        <nav class="navbar">
          <a href="/" class="logo">
            <span class="logo-icon">🔍</span>
            <span class="logo-text">SEO Tools</span>
          </a>
          
          <button class="mobile-toggle hide-desktop" id="mobileMenuToggle" aria-label="Toggle menu">
            <span class="hamburger"></span>
          </button>
          
          <div class="nav-container" id="navContainer">
            <ul class="nav-menu" id="navMenu">
                <li><a href="/" class="nav-link">Home</a></li>
                <li><a href="/src/tools/schema-validator/" class="nav-link">Schema<br>Validator</a></li>
                <li><a href="/src/tools/core-web-vitals/" class="nav-link">Core Web<br>Vitals</a></li>
                <li><a href="/src/tools/alt-text-checker/" class="nav-link">Alt Text<br>Checker</a></li>
                <li><a href="/src/tools/meta-description-generator/" class="nav-link">Meta Tag<br>Gen</a></li>
                <li><a href="/src/tools/keyword-density-checker/" class="nav-link">Keyword<br>Density</a></li>
                <li><a href="/src/tools/canonical-url-checker/" class="nav-link">Canonical<br>Check</a></li>
                <li><a href="/src/tools/open-graph-generator/" class="nav-link">OG<br>Generator</a></li>
                <li><a href="/src/tools/website-speed-test/" class="nav-link">Speed<br>Test</a></li>
                <li><a href="/src/tools/seo-audit-tool/" class="nav-link">SEO<br>Audit</a></li>
                <li><a href="/src/tools/favicon-generator/" class="nav-link">Favicon<br>Gen</a></li>
                <li><a href="/src/tools/robots-txt-generator/" class="nav-link">Robots.txt<br>Gen</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  `;
}

export function initHeader() {
  // Mobile menu toggle
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navContainer = document.getElementById('navContainer');

  if (toggleBtn && navContainer) {
    toggleBtn.addEventListener('click', () => {
      navContainer.classList.toggle('active');
      toggleBtn.classList.toggle('active');
    });

    // Close menu when clicking a link (mobile)
    const links = navContainer.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navContainer.classList.remove('active');
        toggleBtn.classList.remove('active');
      });
    });
  }
}

// Add header styles
export const headerStyles = `
<style>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
  padding: 0.5rem 0;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  transition: transform var(--transition-base);
  z-index: 1001;
  flex-shrink: 0;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 1.8rem;
}

.logo-text {
  background: linear-gradient(135deg, var(--primary-light), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-container {
  display: flex;
  align-items: center;
  margin-left: 2rem;
  flex-grow: 1;
  justify-content: flex-end;
}

.nav-menu {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.25rem 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 950px;
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  font-size: 0.75rem; /* Even smaller to fit well */
  text-decoration: none;
  text-align: center; /* Center align text */
  line-height: 1.2; /* Tight line height */
  display: inline-block;
}

.nav-link:hover {
  color: var(--primary-light);
  background: rgba(255,255,255,0.05);
}

.nav-link.active {
  color: var(--primary-light);
  background: rgba(255,255,255,0.1);
}

/* Mobile Menu Toggle */
.mobile-toggle {
  display: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  position: relative;
  transition: background var(--transition-fast);
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  transition: transform var(--transition-base);
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.mobile-toggle.active .hamburger {
  background: transparent;
}

.mobile-toggle.active .hamburger::before {
  transform: translateY(8px) rotate(45deg);
}

.mobile-toggle.active .hamburger::after {
  transform: translateY(-8px) rotate(-45deg);
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .mobile-toggle {
    display: block;
  }
  
  .nav-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    margin: 0;
    background: var(--bg-secondary);
    border-left: 1px solid var(--glass-border);
    padding: 5rem 1.5rem 2rem;
    transform: translateX(100%);
    transition: transform var(--transition-base);
    box-shadow: var(--shadow-xl);
    z-index: 1000;
    display: block;
    flex-direction: column;
  }
  
  .nav-container.active {
    transform: translateX(0);
  }
  
  .nav-menu {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
  
  .nav-link {
    font-size: 1rem;
    display: block;
    width: 100%;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    text-align: left; /* Reset alignment for mobile */
  }
}
</style>
`;
