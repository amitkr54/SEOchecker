/**
 * Main Homepage JavaScript
 * AuditBreeze
 */

import './styles/main.css';
import { createHeader, initHeader, headerStyles } from './components/Header.js';
import { createFooter, footerStyles } from './components/Footer.js';
import { createAdUnit, adStyles } from './components/AdUnit.js';
import { createToolCard, toolCardStyles } from './components/ToolCard.js';
import { circularIconStyles } from './components/CircularIconBadge.js';

// Tools data
const tools = [
  {
    title: 'Comprehensive SEO Audit',
    description: 'Analyze your website with 50+ SEO checks. Get detailed insights on meta tags, performance, security, mobile-friendliness, and more.',
    icon: '🔍',
    iconCircular: true,
    link: '/src/tools/seo-audit/',
    category: 'Complete Analysis',
    features: [
      '50+ comprehensive SEO checks',
      'Detailed test results with priorities',
      'Category breakdown and scores'
    ]
  },
  {
    title: 'Schema Markup Validator',
    description: 'Validate and test your JSON-LD structured data for errors. Ensure search engines can properly understand your content.',
    icon: '📋',
    iconCircular: true,
    link: '/src/tools/schema-validator/',
    category: 'Technical SEO',
    features: [
      'Support for all Schema.org types',
      'Real-time validation',
      'Error detection with line numbers'
    ]
  },
  {
    title: 'Core Web Vitals Checker',
    description: 'Analyze your website\'s Core Web Vitals (LCP, FID, CLS) using Google\'s API. Get actionable optimization tips.',
    icon: '📊',
    iconCircular: true,
    link: '/src/tools/core-web-vitals/',
    category: 'Performance',
    features: [
      'Powered by Google PageSpeed API',
      'Mobile & Desktop analysis',
      'Detailed recommendations'
    ]
  },
  {
    title: 'Image Alt Text Checker',
    description: 'Scan your web pages for images missing alt text. Improve accessibility and SEO with proper image descriptions.',
    icon: '🖼️',
    iconCircular: true,
    link: '/src/tools/alt-text-checker/',
    category: 'Accessibility',
    features: [
      'Detects missing alt attributes',
      'Identifies poor alt text',
      'Export results as CSV'
    ]
  }
];

// Initialize page
function initPage() {
  const app = document.getElementById('app');

  // Inject styles
  document.head.insertAdjacentHTML('beforeend', headerStyles);
  document.head.insertAdjacentHTML('beforeend', footerStyles);
  document.head.insertAdjacentHTML('beforeend', adStyles);
  document.head.insertAdjacentHTML('beforeend', toolCardStyles);
  document.head.insertAdjacentHTML('beforeend', circularIconStyles);

  // Build page content
  app.innerHTML = `
    ${createHeader()}
    
    <main>
      <!-- Hero Section -->
      <section class="hero section">
        <div class="container text-center">
          <h1 class="hero-title fade-in">
            Free SEO Tools for Better Rankings
          </h1>
          <p class="hero-subtitle fade-in">
            Powerful, fast, and 100% free tools to optimize your website for search engines.
            No signup required.
          </p>
          <div class="hero-cta fade-in">
            <a href="#tools" class="btn btn-primary btn-lg">Explore Tools</a>
            <a href="#about" class="btn btn-secondary btn-lg">Learn More</a>
          </div>
        </div>
      </section>
      
      <!-- Ad Unit - Banner -->
      ${createAdUnit('banner')}
      
      <!-- Tools Grid -->
      <section id="tools" class="tools-section section">
        <div class="container">
          <div class="section-header text-center mb-xl">
            <h2>SEO Tools Collection</h2>
            <p class="section-subtitle">
              Choose from our growing collection of free SEO tools
            </p>
          </div>
          
          <div class="grid grid-cols-3">
            ${tools.map(tool => createToolCard(tool)).join('')}
          </div>
        </div>
      </section>
      
      <!-- Ad Unit - Rectangle -->
      ${createAdUnit('rectangle')}
      
      <!-- Features Section -->
      <section class="features-section section">
        <div class="container">
          <div class="section-header text-center mb-xl">
            <h2>Why Choose Our SEO Tools?</h2>
          </div>
          
          <div class="grid grid-cols-3">
            <div class="feature-card card-solid">
              <div class="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Get instant results without waiting. Our tools are optimized for speed.</p>
            </div>
            
            <div class="feature-card card-solid">
              <div class="feature-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>We don't store your data. All analysis happens in real-time and stays private.</p>
            </div>
            
            <div class="feature-card card-solid">
              <div class="feature-icon">🆓</div>
              <h3>100% Free</h3>
              <p>No hidden fees, no signup required. All tools are completely free to use.</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- About Section -->
      <section id="about" class="about-section section">
        <div class="container container-md">
          <div class="about-content card-solid text-center">
            <h2>About AuditBreeze</h2>
            <p>
              Our mission is to make professional SEO tools accessible to everyone. 
              Whether you're a seasoned SEO expert or just starting out, our tools 
              help you optimize your website for better search engine rankings.
            </p>
            <p>
              All tools are built with the latest web technologies and follow 
              Google's best practices for SEO and Core Web Vitals.
            </p>
          </div>
        </div>
      </section>
    </main>
    
    ${createFooter()}
  `;

  // Initialize header functionality
  initHeader();

  // Add intersection observer for fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tool-card, .feature-card').forEach(el => {
    observer.observe(el);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

// Add page-specific styles
const pageStyles = `
  .hero {
    padding: 4rem 0;
  }
  
  .hero-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    margin-bottom: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: clamp(1.125rem, 2vw, 1.5rem);
    color: var(--text-secondary);
    max-width: 800px;
    margin: 0 auto 2rem;
  }
  
  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .section-header {
    margin-bottom: 3rem;
  }
  
  .section-subtitle {
    font-size: 1.125rem;
    color: var(--text-tertiary);
    max-width: 600px;
    margin: 0 auto;
  }
  
  .feature-card {
    text-align: center;
    padding: 2rem;
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3));
  }
  
  .feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .feature-card p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  .about-content {
    padding: 3rem;
  }
  
  .about-content h2 {
    margin-bottom: 2rem;
  }
  
  .about-content p {
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--text-secondary);
  }
  
  @media (max-width: 768px) {
    .hero {
      padding: 2rem 0;
    }
    
    .hero-cta {
      flex-direction: column;
      align-items: stretch;
    }
    
    .hero-cta .btn {
      width: 100%;
    }
  }
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
