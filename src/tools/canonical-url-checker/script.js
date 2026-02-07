/**
 * Canonical URL Checker Tool
 * Validates canonical tags to prevent duplicate content issues
 */

import '../../styles/main.css';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createAdUnit, adStyles } from '../../components/AdUnit.js';
import { showToast, formatURL } from '../../utils/common.js';

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
            <div class="tool-icon-large">🔗</div>
            <h1>Canonical URL Checker</h1>
            <p class="tool-description">
              Ensure your pages are correctly referencing their original source.
              Prevent duplicate content penalties from Google.
            </p>
          </div>
        </div>
      </section>
      
      ${createAdUnit('banner')}
      
      <section class="tool-content section">
        <div class="container container-lg">
          
          <div class="tool-grid-centered">
            <!-- Input Card -->
            <div class="input-card">
                <div class="input-group">
                    <label for="urlInput" class="label">Enter Page URL</label>
                    <div class="url-input-wrapper">
                        <input type="url" id="urlInput" class="input input-lg" placeholder="https://example.com/my-page" />
                        <button id="checkBtn" class="btn btn-primary btn-lg">Check Canonical</button>
                    </div>
                </div>
            </div>
            
            <!-- Loading -->
            <div id="loadingState" class="loading-state hidden">
                <div class="spinner"></div>
                <p>Fetching page HTML...</p>
                <small>Using proxy for CORS access</small>
            </div>
            
            <!-- Results -->
            <div id="resultCard" class="result-card hidden">
                <div class="status-header" id="statusHeader">
                    <div class="status-icon" id="statusIcon">?</div>
                    <div class="status-text">
                        <h3 id="statusTitle">Checking...</h3>
                        <p id="statusDesc">Please wait.</p>
                    </div>
                </div>
                
                <div class="result-details">
                    <div class="detail-row">
                        <span class="detail-label">Input URL:</span>
                        <code class="detail-value" id="inputUrlDisplay">-</code>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Found Canonical:</span>
                        <code class="detail-value" id="canonicalUrlDisplay">-</code>
                    </div>
                </div>
                
                <div class="recommendation-box" id="recommendationBox">
                    <h4>Recommendation</h4>
                    <p id="recommendationText">...</p>
                </div>
            </div>
            
          </div>
        </div>
      </section>
      
      ${createAdUnit('rectangle')}
    </main>
    
    ${createFooter()}
  `;

    // Initialize header
    initHeader();

    // Initialize tool
    initTool();
}

function initTool() {
    const urlInput = document.getElementById('urlInput');
    const checkBtn = document.getElementById('checkBtn');
    const loadingState = document.getElementById('loadingState');
    const resultCard = document.getElementById('resultCard');

    // Result Elements
    const statusHeader = document.getElementById('statusHeader');
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusDesc = document.getElementById('statusDesc');
    const inputUrlDisplay = document.getElementById('inputUrlDisplay');
    const canonicalUrlDisplay = document.getElementById('canonicalUrlDisplay');
    const recommendationBox = document.getElementById('recommendationBox');
    const recommendationText = document.getElementById('recommendationText');

    checkBtn.addEventListener('click', runCheck);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runCheck();
    });

    async function runCheck() {
        let url = urlInput.value.trim();

        if (!url) {
            showToast('Please enter a valid URL', 'error');
            return;
        }

        // Normalize URL
        url = formatURL(url);
        if (!url) {
            showToast('Invalid URL format', 'error');
            return;
        }
        urlInput.value = url; // Show normalized URL to user

        // Reset UI
        resultCard.classList.add('hidden');
        loadingState.classList.remove('hidden');
        checkBtn.disabled = true;

        try {
            // Fetch via Proxy
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
            const res = await fetch(proxyUrl);

            if (!res.ok) {
                throw new Error('Could not fetch the page. Ensure it is public.');
            }

            const html = await res.text();
            analyzeCanonical(url, html);

        } catch (error) {
            showResult('error', url, null, error.message);
        } finally {
            loadingState.classList.add('hidden');
            checkBtn.disabled = false;
        }
    }

    function analyzeCanonical(inputUrl, html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const canonicalTag = doc.querySelector('link[rel="canonical"]');

        if (!canonicalTag) {
            showResult('missing', inputUrl, null);
            return;
        }

        let canonicalHref = canonicalTag.getAttribute('href');

        // Handle relative URLs
        try {
            const absoluteCanonical = new URL(canonicalHref, inputUrl).href;

            // Normalize for comparison (remove trailing slashes usually)
            const normInput = inputUrl.replace(/\/$/, '');
            const normCanon = absoluteCanonical.replace(/\/$/, '');

            if (normInput === normCanon) {
                showResult('match', inputUrl, absoluteCanonical);
            } else {
                showResult('mismatch', inputUrl, absoluteCanonical);
            }
        } catch (e) {
            showResult('invalid', inputUrl, canonicalHref);
        }
    }

    function showResult(type, inputUrl, canonicalUrl, errorMsg) {
        resultCard.classList.remove('hidden');
        resultCard.scrollIntoView({ behavior: 'smooth' });

        inputUrlDisplay.textContent = inputUrl;
        canonicalUrlDisplay.textContent = canonicalUrl || 'Not found';

        // Reset Classes
        statusHeader.className = 'status-header';

        switch (type) {
            case 'match':
                statusHeader.classList.add('status-success');
                statusIcon.textContent = '✓';
                statusTitle.textContent = 'Self-Referencing Canonical';
                statusDesc.textContent = 'Great! This page correctly points to itself as the original version.';
                recommendationText.textContent = 'No action needed. This setup is perfect for original content.';
                break;

            case 'mismatch':
                statusHeader.classList.add('status-warning');
                statusIcon.textContent = '!';
                statusTitle.textContent = 'Points to Another URL';
                statusDesc.textContent = 'This page tells search engines that another page is the "original".';
                recommendationText.textContent = `Ensure this is intentional. If this page is a duplicate/variation of the canonical URL, this is correct. If this is a unique page, update the tag to point to itself (${inputUrl}).`;
                break;

            case 'missing':
                statusHeader.classList.add('status-danger');
                statusIcon.textContent = '✕';
                statusTitle.textContent = 'Missing Canonical Tag';
                statusDesc.textContent = 'No canonical tag was found in the HTML head.';
                recommendationText.textContent = 'We highly recommend adding a self-referencing canonical tag (<link rel="canonical" href="..." />) to prevent scraping sites or URL parameter variations from creating duplicate content issues.';
                break;

            case 'error':
                statusHeader.classList.add('status-danger');
                statusIcon.textContent = '✕';
                statusTitle.textContent = 'Fetch Error';
                statusDesc.textContent = errorMsg || 'Unknown error';
                recommendationText.textContent = 'Please check if the URL is correct and publicly accessible. We cannot analyze pages behind logins or firewalls.';
                break;
        }
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}

// Styles
const pageStyles = `
.tool-grid-centered {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.input-card {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-lg);
}

.url-input-wrapper {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
}

.url-input-wrapper .input {
    flex: 1;
}

/* Results */
.result-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--glass-border);
    animation: fadeIn 0.5s ease;
}

.status-header {
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    border-bottom: 1px solid var(--glass-border);
}

.status-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: white;
}

.status-text h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
}

.status-text p {
    margin: 0;
    opacity: 0.9;
}

/* Variants */
.status-success {
    background: rgba(16, 185, 129, 0.1);
}
.status-success .status-icon {
    background: #10b981;
}
.status-success h3 { color: #10b981; }

.status-warning {
    background: rgba(245, 158, 11, 0.1);
}
.status-warning .status-icon {
    background: #f59e0b;
}
.status-warning h3 { color: #f59e0b; }

.status-danger {
    background: rgba(239, 68, 68, 0.1);
}
.status-danger .status-icon {
    background: #ef4444;
}
.status-danger h3 { color: #ef4444; }

.result-details {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-bottom: 1px solid var(--glass-border);
}

.detail-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.detail-label {
    font-weight: 600;
    color: var(--text-tertiary);
    font-size: 0.875rem;
}

.detail-value {
    background: rgba(0,0,0,0.2);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    font-family: monospace;
    word-break: break-all;
    color: var(--text-primary);
}

.recommendation-box {
    padding: 2rem;
    background: var(--bg-tertiary);
}

.recommendation-box h4 {
    margin-bottom: 0.75rem;
    color: var(--primary-light);
}

.recommendation-box p {
    color: var(--text-secondary);
    line-height: 1.6;
}

.loading-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-tertiary);
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left-color: var(--primary);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
    .url-input-wrapper {
        flex-direction: column;
    }
    
    .status-header {
        flex-direction: column;
        text-align: center;
    }
}
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
