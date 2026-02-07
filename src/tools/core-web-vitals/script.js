/**
 * Core Web Vitals Checker
 * Analyzes website performance using Google PageSpeed Insights API
 */

import '../../styles/main.css';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createAdUnit, adStyles } from '../../components/AdUnit.js';
import { formatURL, showToast, getDomain } from '../../utils/common.js';

// Google PageSpeed Insights API endpoint
const PAGESPEED_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const API_KEY = 'AIzaSyCXtfM2OsYIXz9WOjHQ-6-1-pKHFciGDUs';

// Initialize page
function initPage() {
  const app = document.getElementById('app');

  // Inject styles
  document.head.insertAdjacentHTML('beforeend', headerStyles);
  document.head.insertAdjacentHTML('beforeend', footerStyles);
  document.head.insertAdjacentHTML('beforeend', adStyles);

  // Build page content
  app.innerHTML = `
    ${createHeader()}
    
    <main>
      <section class="tool-hero section">
        <div class="container container-lg">
          <div class="tool-header">
            <div class="tool-icon-large">📊</div>
            <h1>Core Web Vitals Checker</h1>
            <p class="tool-description">
              Analyze your website's Core Web Vitals using Google's PageSpeed Insights API. 
              Get detailed performance metrics and optimization recommendations.
            </p>
          </div>
        </div>
      </section>
      
      ${createAdUnit('banner')}
      
      <section class="tool-content section">
        <div class="container container-lg">
          <!-- Input Section -->
          <div class="tool-input-section">
            <h2>Enter Website URL</h2>
            <p>We'll analyze your website's Core Web Vitals and provide optimization tips:</p>
            
            <div class="input-group">
              <label for="urlInput" class="label">Website URL</label>
              <input 
                type="url" 
                id="urlInput" 
                class="input" 
                placeholder="https://example.com"
                autocomplete="url"
              />
            </div>
            
            <div class="device-selector">
              <label class="label">Device Type:</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" name="device" value="mobile" checked />
                  <span>📱 Mobile</span>
                </label>
                <label class="radio-label">
                  <input type="radio" name="device" value="desktop" />
                  <span>💻 Desktop</span>
                </label>
              </div>
            </div>
            
            <div class="tool-actions">
              <button id="analyzeBtn" class="btn btn-primary btn-lg">
                Analyze Performance
              </button>
              <button id="clearBtn" class="btn btn-secondary">
                Clear
              </button>
            </div>
          </div>
          
          <!-- Results Section -->
          <div id="resultsSection" class="tool-results-section hidden">
            <div id="loadingState" class="loading-overlay">
              <div class="spinner"></div>
              <p>Analyzing your website performance...</p>
              <small>This may take 10-30 seconds</small>
            </div>
            <div id="resultsContent" class="hidden"></div>
          </div>
        </div>
      </section>
      
      ${createAdUnit('rectangle')}
      
      <!-- Info Section -->
      <section class="info-section section">
        <div class="container container-md">
          <div class="card-solid">
            <h2>What are Core Web Vitals?</h2>
            <p>
              Core Web Vitals are a set of metrics that Google uses to measure user experience on the web. 
              They are part of Google's page experience signals used in ranking.
            </p>
            
            <h3>The Three Core Web Vitals:</h3>
            <div class="vitals-info">
              <div class="vital-card">
                <h4>📏 LCP - Largest Contentful Paint</h4>
                <p>Measures loading performance. Should occur within 2.5 seconds of when the page first starts loading.</p>
                <ul>
                  <li>Good: ≤ 2.5s</li>
                  <li>Needs Improvement: 2.5s - 4.0s</li>
                  <li>Poor: > 4.0s</li>
                </ul>
              </div>
              
              <div class="vital-card">
                <h4>⚡ FID - First Input Delay</h4>
                <p>Measures interactivity. Should be less than 100 milliseconds for a good experience.</p>
                <ul>
                  <li>Good: ≤ 100ms</li>
                  <li>Needs Improvement: 100ms - 300ms</li>
                  <li>Poor: > 300ms</li>
                </ul>
              </div>
              
              <div class="vital-card">
                <h4>📐 CLS - Cumulative Layout Shift</h4>
                <p>Measures visual stability. Should maintain a CLS of less than 0.1.</p>
                <ul>
                  <li>Good: ≤ 0.1</li>
                  <li>Needs Improvement: 0.1 - 0.25</li>
                  <li>Poor: > 0.25</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    ${createFooter()}
  `;

  // Initialize header functionality
  initHeader();

  // Initialize checker
  initChecker();
}

// Checker functionality
function initChecker() {
  const urlInput = document.getElementById('urlInput');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultsSection = document.getElementById('resultsSection');
  const loadingState = document.getElementById('loadingState');
  const resultsContent = document.getElementById('resultsContent');

  analyzeBtn.addEventListener('click', () => analyzeWebsite());
  clearBtn.addEventListener('click', () => clearResults());

  // Enter key to analyze
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') analyzeWebsite();
  });

  async function analyzeWebsite() {
    const url = urlInput.value.trim();
    const formattedURL = formatURL(url);

    if (!formattedURL) {
      showToast('Please enter a valid URL', 'error');
      return;
    }

    const device = document.querySelector('input[name="device"]:checked').value;

    // Show loading state
    resultsSection.classList.remove('hidden');
    loadingState.classList.remove('hidden');
    resultsContent.classList.add('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';

    try {
      const data = await fetchPageSpeedData(formattedURL, device);
      displayResults(data, formattedURL, device);
    } catch (error) {
      displayError(error.message);
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze Performance';
      loadingState.classList.add('hidden');
      resultsContent.classList.remove('hidden');
    }
  }

  async function fetchPageSpeedData(url, strategy) {
    // Using PageSpeed Insights API
    const apiUrl = `${PAGESPEED_API}?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${API_KEY}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      let errorMsg = 'Unable to analyze the website.';
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.message) {
          errorMsg = errorData.error.message;
        }
      } catch (e) {
        // ignore
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  }

  function displayResults(data, url, device) {
    const lighthouse = data.lighthouseResult;
    const loadingExperience = data.loadingExperience;

    // Safety check for audits
    if (!lighthouse || !lighthouse.audits) {
      displayError("Incomplete data received from API.");
      return;
    }

    // Extract Core Web Vitals
    const metrics = {
      lcp: lighthouse.audits['largest-contentful-paint'],
      fid: lighthouse.audits['max-potential-fid'] || lighthouse.audits['total-blocking-time'],
      cls: lighthouse.audits['cumulative-layout-shift'],
      fcp: lighthouse.audits['first-contentful-paint'],
      si: lighthouse.audits['speed-index'],
      tti: lighthouse.audits['interactive']
    };

    const performanceScore = lighthouse.categories.performance.score * 100;

    let html = `
      <div class="results-header">
        <h2>Performance Analysis for ${getDomain(url)}</h2>
        <span class="device-badge badge ${device === 'mobile' ? 'badge-info' : 'badge-success'}">
          ${device === 'mobile' ? '📱 Mobile' : '💻 Desktop'}
        </span>
      </div>
      
      <!-- Performance Score -->
      <div class="performance-score">
        <div class="score-circle ${getScoreClass(performanceScore)}">
          <svg viewBox="0 0 120 120">
            <circle class="score-bg" cx="60" cy="60" r="54" />
            <circle class="score-fill" cx="60" cy="60" r="54" 
                    style="stroke-dashoffset: ${339.3 - (339.3 * performanceScore / 100)}" />
          </svg>
          <div class="score-number">${Math.round(performanceScore)}</div>
        </div>
        <h3>Performance Score</h3>
        <p class="score-desc">${getScoreDescription(performanceScore)}</p>
      </div>
      
      <!-- Core Web Vitals -->
      <div class="vitals-grid">
        <h3>Core Web Vitals</h3>
        <div class="grid grid-cols-3">
          ${createMetricCard('LCP', 'Largest Contentful Paint', metrics.lcp, 2.5, 4.0, 's')}
          ${createMetricCard('FID', 'First Input Delay', metrics.fid, 100, 300, 'ms')}
          ${createMetricCard('CLS', 'Cumulative Layout Shift', metrics.cls, 0.1, 0.25, '')}
        </div>
      </div>
      
      <!-- Other Metrics -->
      <div class="other-metrics">
        <h3>Additional Metrics</h3>
        <div class="grid grid-cols-3">
          ${createMetricCard('FCP', 'First Contentful Paint', metrics.fcp, 1.8, 3.0, 's')}
          ${createMetricCard('SI', 'Speed Index', metrics.si, 3.4, 5.8, 's')}
          ${createMetricCard('TTI', 'Time to Interactive', metrics.tti, 3.8, 7.3, 's')}
        </div>
      </div>
      
      <!-- Opportunities -->
      ${displayOpportunities(lighthouse.audits)}
      
      <!-- Test Again -->
      <div class="test-actions">
        <a href="https://pagespeed.web.dev/report?url=${encodeURIComponent(url)}" target="_blank" class="btn btn-primary">
          View Full Report on PageSpeed Insights
        </a>
      </div>
    `;

    resultsContent.innerHTML = html;
  }

  function createMetricCard(label, title, audit, goodThreshold, poorThreshold, unit) {
    if (!audit) return '';

    const value = audit.numericValue;
    const displayValue = audit.displayValue || `${value.toFixed(2)} ${unit}`;

    let status = 'good';
    if (unit === 's') {
      status = value <= goodThreshold ? 'good' : (value <= poorThreshold ? 'average' : 'poor');
    } else if (unit === 'ms') {
      status = value <= goodThreshold ? 'good' : (value <= poorThreshold ? 'average' : 'poor');
    } else {
      status = value <= goodThreshold ? 'good' : (value <= poorThreshold ? 'average' : 'poor');
    }

    return `
      <div class="metric-card card status-${status}">
        <div class="metric-label">${label}</div>
        <div class="metric-value">${displayValue}</div>
        <div class="metric-title">${title}</div>
        <div class="metric-status badge badge-${status === 'good' ? 'success' : (status === 'average' ? 'warning' : 'error')}">
          ${status === 'good' ? 'Good' : (status === 'average' ? 'Needs Improvement' : 'Poor')}
        </div>
      </div>
    `;
  }

  function displayOpportunities(audits) {
    const opportunities = [];

    // Common performance audits
    const opportunityAudits = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'duplicated-javascript'
    ];

    opportunityAudits.forEach(key => {
      const audit = audits[key];
      if (audit && audit.score !== null && audit.score < 1) {
        opportunities.push({
          title: audit.title,
          description: audit.description,
          savings: audit.displayValue
        });
      }
    });

    if (opportunities.length === 0) {
      return '<div class="alert alert-success"><strong>Great!</strong> No major optimization opportunities found.</div>';
    }

    return `
      <div class="opportunities-section">
        <h3>🚀 Optimization Opportunities</h3>
        <div class="opportunities-list">
          ${opportunities.map(opp => `
            <div class="opportunity-item">
              <div class="opportunity-header">
                <strong>${opp.title}</strong>
                ${opp.savings ? `<span class="savings badge badge-warning">Save: ${opp.savings}</span>` : ''}
              </div>
              <p>${opp.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function getScoreClass(score) {
    if (score >= 90) return 'score-good';
    if (score >= 50) return 'score-average';
    return 'score-poor';
  }

  function getScoreDescription(score) {
    if (score >= 90) return 'Excellent performance!';
    if (score >= 50) return 'Room for improvement';
    return 'Needs significant optimization';
  }

  function displayError(message) {
    resultsContent.innerHTML = `
      <div class="alert alert-error">
        <strong>Error:</strong> ${message}
      </div>
      <div class="help-section">
        <h4>Troubleshooting Tips:</h4>
        <ul>
          <li>Make sure the URL is publicly accessible</li>
          <li>Check if the website is online</li>
          <li>Verify the URL format (should include http:// or https://)</li>
          <li>Some websites may block automated testing tools</li>
        </ul>
      </div>
    `;
  }

  function clearResults() {
    urlInput.value = '';
    resultsSection.classList.add('hidden');
    // Hide results content when clearing
    resultsContent.classList.add('hidden');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

// Page-specific styles
const pageStyles = `
  .tool-hero {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1));
    border-bottom: 1px solid var(--glass-border);
    padding: 3rem 0;
  }
  
  .tool-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .tool-icon-large {
    font-size: 4rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 8px 16px rgba(99, 102, 241, 0.3));
  }
  
  .tool-description {
    font-size: 1.125rem;
    color: var(--text-secondary);
    line-height: 1.8;
  }
  
  .tool-input-section,
  .tool-results-section {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .device-selector {
    margin-bottom: 1.5rem;
  }
  
  .radio-group {
    display: flex;
    gap: 1rem;
  }
  
  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--bg-secondary);
    border: 2px solid var(--glass-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
  }
  
  .radio-label:hover {
    border-color: var(--primary);
    background: var(--bg-tertiary);
  }
  
  .radio-label input[type="radio"] {
    margin: 0;
  }
  
  .radio-label input[type="radio"]:checked + span {
    color: var(--primary-light);
    font-weight: 600;
  }
  
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .device-badge {
    font-size: 0.875rem;
  }
  
  .performance-score {
    text-align: center;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .score-circle {
    width: 150px;
    height: 150px;
    margin: 0 auto 1rem;
    position: relative;
  }
  
  .score-circle svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }
  
  .score-bg {
    fill: none;
    stroke: var(--bg-tertiary);
    stroke-width: 8;
  }
  
  .score-fill {
    fill: none;
    stroke-width: 8;
    stroke-dasharray: 339.3;
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 1s ease;
    stroke-linecap: round;
  }
  
  .score-good .score-fill {
    stroke: var(--accent);
  }
  
  .score-average .score-fill {
    stroke: var(--warning);
  }
  
  .score-poor .score-fill {
    stroke: var(--error);
  }
  
  .score-number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  .score-desc {
    color: var(--text-tertiary);
    font-size: 1rem;
  }
  
  .vitals-grid,
  .other-metrics {
    margin-bottom: 2rem;
  }
  
  .metric-card {
    text-align: center;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
  }
  
  .metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }
  
  .metric-card.status-good::before {
    background: var(--accent);
  }
  
  .metric-card.status-average::before {
    background: var(--warning);
  }
  
  .metric-card.status-poor::before {
    background: var(--error);
  }
  
  .metric-label {
    font-size: 0.875rem;
    color: var(--text-tertiary);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .metric-title {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
  }
  
  .metric-status {
    font-size: 0.75rem;
  }
  
  .opportunities-section {
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    margin-bottom: 2rem;
  }
  
  .opportunities-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .opportunity-item {
    padding: 1rem;
    background: var(--bg-primary);
    border-left: 3px solid var(--warning);
    border-radius: var(--radius-sm);
  }
  
  .opportunity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .savings {
    font-size: 0.75rem;
  }
  
  .test-actions {
    text-align: center;
    padding: 1.5rem;
  }
  
  .vitals-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .vital-card {
    padding: 1.5rem;
    background: var(--bg-primary);
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
  }
  
  .vital-card h4 {
    margin-bottom: 1rem;
    color: var(--primary-light);
  }
  
  .vital-card ul {
    margin-top: 1rem;
    padding-left: 1.5rem;
    color: var(--text-secondary);
  }
  
  @media (max-width: 768px) {
    .radio-group {
      flex-direction: column;
    }
    
    .radio-label {
      width: 100%;
    }
    
    .results-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
