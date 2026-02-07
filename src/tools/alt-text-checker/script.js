/**
 * Image Alt Text Checker
 * Scans HTML for images missing alt text
 */

import '../../styles/main.css';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createAdUnit, adStyles } from '../../components/AdUnit.js';
import { showToast, escapeHTML, downloadFile } from '../../utils/common.js';

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
            <div class="tool-icon-large">🖼️</div>
            <h1>Image Alt Text Checker</h1>
            <p class="tool-description">
              Scan your web pages for images missing alt text. Improve accessibility and SEO 
              by ensuring all images have proper descriptions.
            </p>
          </div>
        </div>
      </section>
      
      ${createAdUnit('banner')}
      
      <section class="tool-content section">
        <div class="container container-lg">
          <div class="tool-input-section">
            <h2>Check Your Images</h2>
            <p>Enter a URL or paste your HTML code below:</p>
            
            <div class="input-tabs">
              <button class="tab-btn active" data-tab="url">Enter URL</button>
              <button class="tab-btn" data-tab="html">Paste HTML</button>
            </div>
            
            <!-- URL Tab -->
            <div id="urlTab" class="tab-content active">
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
              <button id="checkUrlBtn" class="btn btn-primary btn-lg">
                Check Images
              </button>
            </div>
            
            <!-- HTML Tab -->
            <div id="htmlTab" class="tab-content">
              <div class="input-group">
                <label for="htmlInput" class="label">HTML Code</label>
                <textarea 
                  id="htmlInput" 
                  class="textarea code-input" 
                  placeholder="Paste your HTML code here..."
                  rows="10"
                ></textarea>
              </div>
              <div class="tool-actions">
                <button id="checkHtmlBtn" class="btn btn-primary btn-lg">
                  Check Images
                </button>
                <button id="clearBtn" class="btn btn-secondary">
                  Clear
                </button>
                <button id="sampleBtn" class="btn btn-secondary">
                  Load Sample
                </button>
              </div>
            </div>
          </div>
          
          <!-- Results Section -->
          <div id="resultsSection" class="tool-results-section hidden">
            <div id="resultsContent"></div>
          </div>
        </div>
      </section>
      
      ${createAdUnit('rectangle')}
      
      <!-- Info Section -->
      <section class="info-section section">
        <div class="container container-md">
          <div class="card-solid">
            <h2>Why Alt Text Matters</h2>
            <p>
              Alt text (alternative text) is crucial for both accessibility and SEO. It helps:
            </p>
            <ul class="info-list">
              <li><strong>Screen readers:</strong> Describe images to visually impaired users</li>
              <li><strong>Search engines:</strong> Understand image content for better rankings</li>
              <li><strong>User experience:</strong> Display when images fail to load</li>
              <li><strong>Compliance:</strong> Meet WCAG accessibility standards</li>
            </ul>
            
            <h3>Best Practices for Alt Text:</h3>
            <ul class="info-list">
              <li>Be descriptive but concise (aim for 125 characters or less)</li>
              <li>Include relevant keywords naturally, don't keyword stuff</li>
              <li>Don't start with "image of" or "picture of"</li>
              <li>For decorative images, use alt=""</li>
              <li>For complex images (charts/graphs), provide detailed descriptions</li>
            </ul>
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
  const htmlInput = document.getElementById('htmlInput');
  const checkUrlBtn = document.getElementById('checkUrlBtn');
  const checkHtmlBtn = document.getElementById('checkHtmlBtn');
  const clearBtn = document.getElementById('clearBtn');
  const sampleBtn = document.getElementById('sampleBtn');
  const resultsSection = document.getElementById('resultsSection');
  const resultsContent = document.getElementById('resultsContent');

  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const urlTab = document.getElementById('urlTab');
  const htmlTab = document.getElementById('htmlTab');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (tab === 'url') {
        urlTab.classList.add('active');
        htmlTab.classList.remove('active');
      } else {
        htmlTab.classList.add('active');
        urlTab.classList.remove('active');
      }
    });
  });

  checkUrlBtn.addEventListener('click', () => checkFromUrl());
  checkHtmlBtn.addEventListener('click', () => checkFromHtml());
  clearBtn.addEventListener('click', () => clearInput());
  sampleBtn.addEventListener('click', () => loadSample());

  async function checkFromUrl() {
    const url = urlInput.value.trim();

    if (!url) {
      showToast('Please enter a URL', 'warning');
      return;
    }

    checkUrlBtn.disabled = true;
    checkUrlBtn.textContent = 'Fetching via Proxy...';

    // Show loading state
    resultsContent.innerHTML = `
            <div class="loading-overlay" style="padding: 2rem; position: relative;">
                <div class="spinner"></div>
                <p>Fetching page content...</p>
                <small>This requires a Vercel backend function</small>
            </div>
        `;
    resultsSection.classList.remove('hidden');

    try {
      // Try to fetch via our Vercel proxy
      // Note: This path (/api/proxy) works when deployed on Vercel
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;

      const response = await fetch(proxyUrl);

      if (!response.ok) {
        // If local dev or proxy error, throw to catch block
        throw new Error('Proxy unreachable or returned error');
      }

      const html = await response.text();

      // Success! Process the HTML
      const images = extractImages(html);
      displayResults(images);
      showToast('Page analyzed successfully!', 'success');

    } catch (error) {
      console.warn('Proxy fetch failed, likely running locally without API emulation:', error);

      // Fallback: Show the manual "Paste HTML" instructions
      showToast('Direct fetching unavailable (CORS/No Backend). Please stick to "Paste HTML" method for now.', 'info');

      resultsContent.innerHTML = `
        <div class="alert alert-warning">
          <strong>Note:</strong> Direct URL checking requires the Vercel backend (active after deployment).
          <br><br>
          <strong>While on localhost, please use the "Paste HTML" tab:</strong>
          <ol>
            <li>Visit your website</li>
            <li>Right-click → View Page Source</li>
            <li>Copy the HTML code</li>
            <li>Paste it in the "Paste HTML" tab above</li>
          </ol>
        </div>
      `;
    } finally {
      checkUrlBtn.disabled = false;
      checkUrlBtn.textContent = 'Check Images';
    }
  }

  function checkFromHtml() {
    const html = htmlInput.value.trim();

    if (!html) {
      showToast('Please paste HTML code', 'warning');
      return;
    }

    const images = extractImages(html);
    displayResults(images);
  }

  function extractImages(html) {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgElements = doc.querySelectorAll('img');

    const images = [];
    imgElements.forEach((img, index) => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt');
      const hasAlt = alt !== null;
      const isDecorative = alt === '';

      images.push({
        index: index + 1,
        src,
        alt: alt || '',
        hasAlt,
        isDecorative,
        status: getAltStatus(alt),
        html: img.outerHTML
      });
    });

    return images;
  }

  function getAltStatus(alt) {
    if (alt === null) {
      return { type: 'missing', label: 'Missing', class: 'error' };
    } else if (alt === '') {
      return { type: 'decorative', label: 'Decorative', class: 'info' };
    } else if (alt.length < 5) {
      return { type: 'poor', label: 'Too Short', class: 'warning' };
    } else if (alt.toLowerCase().startsWith('image of') || alt.toLowerCase().startsWith('picture of')) {
      return { type: 'suboptimal', label: 'Suboptimal', class: 'warning' };
    } else if (alt.length > 125) {
      return { type: 'long', label: 'Too Long', class: 'warning' };
    } else {
      return { type: 'good', label: 'Good', class: 'success' };
    }
  }

  function displayResults(images) {
    if (images.length === 0) {
      resultsContent.innerHTML = `
        <div class="alert alert-info">
          <strong>No images found</strong> in the provided HTML.
        </div>
      `;
      resultsSection.classList.remove('hidden');
      return;
    }

    const stats = calculateStats(images);

    let html = `
      <div class="results-header">
        <h2>Image Alt Text Analysis</h2>
      </div>
      
      <!-- Summary Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.total}</div>
          <div class="stat-label">Total Images</div>
        </div>
        <div class="stat-card status-good">
          <div class="stat-value">${stats.good}</div>
          <div class="stat-label">With Good Alt Text</div>
        </div>
        <div class="stat-card status-poor">
          <div class="stat-value">${stats.missing}</div>
          <div class="stat-label">Missing Alt Text</div>
        </div>
        <div class="stat-card status-warning">
          <div class="stat-value">${stats.needsImprovement}</div>
          <div class="stat-label">Needs Improvement</div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-label">
          <span>Accessibility Score</span>
          <span class="progress-percent">${stats.scorePercent}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${stats.scorePercent >= 80 ? 'good' : (stats.scorePercent >= 50 ? 'average' : 'poor')}" 
               style="width: ${stats.scorePercent}%"></div>
        </div>
        <p class="progress-desc">${stats.scoreText}</p>
      </div>
      
      <!-- Filter Buttons -->
      <div class="filter-section">
        <h3>Filter Results:</h3>
        <div class="filter-buttons">
          <button class="filter-btn active" data-filter="all">All (${images.length})</button>
          <button class="filter-btn" data-filter="missing">Missing Alt (${stats.missing})</button>
          <button class="filter-btn" data-filter="poor">Needs Fix (${stats.needsImprovement})</button>
          <button class="filter-btn" data-filter="good">Good (${stats.good})</button>
        </div>
      </div>
      
      <!-- Images Table -->
      <div class="images-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Alt Text</th>
              <th>Status</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody id="imagesTableBody">
            ${images.map(img => createImageRow(img)).join('')}
          </tbody>
        </table>
      </div>
      
      <!-- Export Button -->
      <div class="export-section">
        <button id="exportBtn" class="btn btn-accent">
          📥 Export Results as CSV
        </button>
      </div>
    `;

    resultsContent.innerHTML = html;
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Initialize filtering
    initFiltering(images);

    // Export functionality
    document.getElementById('exportBtn').addEventListener('click', () => exportToCSV(images));
  }

  function calculateStats(images) {
    const total = images.length;
    const missing = images.filter(img => img.status.type === 'missing').length;
    const good = images.filter(img => img.status.type === 'good' || img.status.type === 'decorative').length;
    const needsImprovement = images.filter(img =>
      img.status.type === 'poor' || img.status.type === 'suboptimal' || img.status.type === 'long'
    ).length;

    const scorePercent = Math.round((good / total) * 100);

    let scoreText = '';
    if (scorePercent >= 90) scoreText = 'Excellent! Your images are well optimized for accessibility.';
    else if (scorePercent >= 70) scoreText = 'Good, but there\'s room for improvement.';
    else if (scorePercent >= 50) scoreText = 'Fair. Consider adding alt text to more images.';
    else scoreText = 'Needs attention. Many images are missing alt text.';

    return { total, missing, good, needsImprovement, scorePercent, scoreText };
  }

  function createImageRow(img) {
    const recommendation = getRecommendation(img.status.type);
    const truncatedSrc = img.src.length > 50 ? img.src.substring(0, 47) + '...' : img.src;

    return `
      <tr class="image-row" data-status="${img.status.type}">
        <td>${img.index}</td>
        <td>
          <div class="image-info">
            ${img.src ? `<img src="${img.src}" alt="" class="preview-thumb" onerror="this.style.display='none'" />` : ''}
            <code class="image-src">${escapeHTML(truncatedSrc)}</code>
          </div>
        </td>
        <td>
          ${img.hasAlt
        ? `<span class="alt-text">${escapeHTML(img.alt) || '<em>(empty)</em>'}</span>`
        : '<span class="alt-missing">No alt attribute</span>'}
        </td>
        <td>
          <span class="badge badge-${img.status.class}">${img.status.label}</span>
        </td>
        <td class="recommendation">${recommendation}</td>
      </tr>
    `;
  }

  function getRecommendation(type) {
    const recommendations = {
      'missing': 'Add an alt attribute describing the image content',
      'decorative': 'Correctly marked as decorative (alt="")',
      'poor': 'Provide a more descriptive alt text (at least 5 characters)',
      'suboptimal': 'Remove "image of" or "picture of" from the start',
      'long': 'Consider shortening (under 125 characters)',
      'good': 'Alt text is properly set'
    };

    return recommendations[type] || '';
  }

  function initFiltering(images) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const rows = document.querySelectorAll('.image-row');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        rows.forEach(row => {
          if (filter === 'all' ||
            (filter === 'missing' && row.dataset.status === 'missing') ||
            (filter === 'poor' && ['poor', 'suboptimal', 'long'].includes(row.dataset.status)) ||
            (filter === 'good' && ['good', 'decorative'].includes(row.dataset.status))) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  function exportToCSV(images) {
    const csvContent = [
      ['Index', 'Image Source', 'Alt Text', 'Status', 'Recommendation'],
      ...images.map(img => [
        img.index,
        img.src,
        img.alt,
        img.status.label,
        getRecommendation(img.status.type)
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    downloadFile(csvContent, 'alt-text-report.csv', 'text/csv');
    showToast('Report exported successfully!', 'success');
  }

  function clearInput() {
    htmlInput.value = '';
    resultsSection.classList.add('hidden');
  }

  function loadSample() {
    const sample = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Sample Page</title>
</head>
<body>
    <h1>Welcome</h1>
    <img src="logo.png" alt="Company Logo" />
    <img src="banner.jpg" />
    <img src="decorative.png" alt="" />
    <img src="photo.jpg" alt="pic" />
    <img src="chart.png" alt="This is a very long description that exceeds the recommended 125 character limit for alt text and should probably be shortened for better accessibility" />
</body>
</html>`;

    htmlInput.value = sample;
    showToast('Sample HTML loaded', 'success');
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
  
  .input-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .tab-btn {
    padding: 0.75rem 1.5rem;
    background: var(--bg-secondary);
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-base);
    font-weight: 500;
  }
  
  .tab-btn:hover {
    background: var(--bg-tertiary);
  }
  
  .tab-btn.active {
    background: var(--bg-tertiary);
    border-color: var(--primary);
    color: var(--primary-light);
  }
  
  .tab-content {
    display: none;
  }
  
  .tab-content.active {
    display: block;
  }
  
  .code-input {
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 0.875rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    text-align: center;
    border: 2px solid var(--glass-border);
  }
  
  .stat-card.status-good {
    border-color: var(--accent);
  }
  
  .stat-card.status-poor {
    border-color: var(--error);
  }
  
  .stat-card.status-warning {
    border-color: var(--warning);
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-light);
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: var(--text-tertiary);
    margin-top: 0.5rem;
  }
  
  .progress-section {
    margin-bottom: 2rem;
  }
  
  .progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .progress-percent {
    color: var(--primary-light);
  }
  
  .progress-bar {
    height: 12px;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    transition: width 0.8s ease;
  }
  
  .progress-fill.good {
    background: linear-gradient(90deg, var(--accent), #059669);
  }
  
  .progress-fill.average {
    background: linear-gradient(90deg, var(--warning), #d97706);
  }
  
  .progress-fill.poor {
    background: linear-gradient(90deg, var(--error), #dc2626);
  }
  
  .progress-desc {
    margin-top: 0.5rem;
    color: var(--text-tertiary);
    font-size: 0.875rem;
  }
  
  .filter-section {
    margin-bottom: 1.5rem;
  }
  
  .filter-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-base);
    font-size: 0.875rem;
  }
  
  .filter-btn:hover {
    background: var(--bg-tertiary);
  }
  
  .filter-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .images-table {
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background: var(--bg-secondary);
  }
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid var(--glass-border);
  }
  
  td {
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }
  
  .image-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .preview-thumb {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    border: 1px solid var(--glass-border);
  }
  
  .image-src {
    font-size: 0.75rem;
    color: var(--text-tertiary);
  }
  
  .alt-text {
    color: var(--text-secondary);
    font-style: italic;
  }
  
  .alt-missing {
    color: var(--error);
    font-weight: 500;
  }
  
  .recommendation {
    font-size: 0.875rem;
    color: var(--text-tertiary);
  }
  
  .export-section {
    text-align: center;
  }
  
  .info-list {
    list-style: none;
    padding: 0;
  }
  
  .info-list li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
  }
  
  .info-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .filter-buttons {
      flex-direction: column;
    }
    
    .filter-btn {
      width: 100%;
    }
    
    table {
      font-size: 0.875rem;
    }
    
    th, td {
      padding: 0.75rem 0.5rem;
    }
    
    .preview-thumb {
      width: 40px;
      height: 40px;
    }
  }
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
