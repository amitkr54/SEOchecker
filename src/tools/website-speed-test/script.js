/**
 * Website Speed Test Tool
 * Analyzes page performance using Google PageSpeed Insights API
 */

import '../../styles/main.css';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createAdUnit, adStyles } from '../../components/AdUnit.js';
import { showToast } from '../../utils/common.js';

const PAGESPEED_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const API_KEY = 'AIzaSyCXtfM2OsYIXz9WOjHQ-6-1-pKHFciGDUs'; // User's API Key

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
            <div class="tool-icon-large">⚡</div>
            <h1>Website Speed Test</h1>
            <p class="tool-description">
              Get a detailed performance report for your website. see how fast it loads on mobile and desktop.
              Powered by Google PageSpeed Insights.
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
                    <label for="urlInput" class="label">Enter Website URL</label>
                    <div class="url-input-wrapper">
                        <input type="url" id="urlInput" class="input input-lg" placeholder="https://example.com" />
                        <select id="deviceType" class="select select-compact">
                            <option value="mobile">Mobile</option>
                            <option value="desktop">Desktop</option>
                        </select>
                        <button id="checkBtn" class="btn btn-primary btn-lg">Test Speed</button>
                    </div>
                </div>
            </div>
            
            <!-- Loading -->
            <div id="loadingState" class="loading-state hidden">
                <div class="spinner-large"></div>
                <h3>Running Audit...</h3>
                <p>Analyzing loading speed, interactivity, and stability.</p>
                <div class="progress-steps">
                    <div class="step">Connecting...</div>
                    <div class="step">Auditing...</div>
                    <div class="step">Generating Report...</div>
                </div>
            </div>
            
            <!-- Results -->
            <div id="resultCard" class="result-card hidden">
                <div class="score-header">
                    <div class="gauge-wrapper">
                        <div class="gauge" id="performanceGauge">
                            <div class="gauge-body">
                                <div class="gauge-fill"></div>
                                <div class="gauge-cover">
                                    <span id="scoreValue">0</span>
                                </div>
                            </div>
                        </div>
                        <span class="gauge-label">Performance Score</span>
                    </div>
                    
                    <div class="score-meta">
                        <h3 id="analyzedUrl" class="url-text">example.com</h3>
                        <div class="meta-badges">
                            <span class="badge" id="deviceBadge">Mobile</span>
                            <span class="badge" id="timestampBadge">Just now</span>
                        </div>
                    </div>
                </div>
                
                <div class="metrics-grid">
                    <div class="metric-card" id="lcpCard">
                        <span class="metric-label">Largest Contentful Paint</span>
                        <span class="metric-value" id="lcpValue">-</span>
                        <span class="metric-desc">Visual Load Time</span>
                    </div>
                    <div class="metric-card" id="tbtCard">
                        <span class="metric-label">Total Blocking Time</span>
                        <span class="metric-value" id="tbtValue">-</span>
                        <span class="metric-desc">Responsiveness</span>
                    </div>
                    <div class="metric-card" id="clsCard">
                        <span class="metric-label">Cumulative Layout Shift</span>
                        <span class="metric-value" id="clsValue">-</span>
                        <span class="metric-desc">Stability</span>
                    </div>
                    <div class="metric-card" id="siCard">
                        <span class="metric-label">Speed Index</span>
                        <span class="metric-value" id="siValue">-</span>
                        <span class="metric-desc">Visual Progression</span>
                    </div>
                </div>
                
                <div class="opportunities-section">
                    <h3>💡 Optimization Opportunities</h3>
                    <div id="opportunitiesList" class="opp-list">
                        <!-- Items populated by JS -->
                    </div>
                </div>
                
                <div class="screenshot-section">
                    <h3>Visual Progress</h3>
                    <img id="screenshotImg" class="screenshot-img" alt="Page Screenshot" />
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
    const deviceType = document.getElementById('deviceType');
    const checkBtn = document.getElementById('checkBtn');
    const loadingState = document.getElementById('loadingState');
    const resultCard = document.getElementById('resultCard');

    // UI Elements
    const performanceGauge = document.getElementById('performanceGauge');
    const scoreValue = document.getElementById('scoreValue');
    const analyzedUrl = document.getElementById('analyzedUrl');
    const deviceBadge = document.getElementById('deviceBadge');
    const timestampBadge = document.getElementById('timestampBadge');
    const opportunitiesList = document.getElementById('opportunitiesList');
    const screenshotImg = document.getElementById('screenshotImg');

    checkBtn.addEventListener('click', runTest);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runTest();
    });

    async function runTest() {
        const url = urlInput.value.trim();
        const strategy = deviceType.value;

        if (!url) {
            showToast('Please enter a valid URL', 'error');
            return;
        }

        // Reset UI
        resultCard.classList.add('hidden');
        loadingState.classList.remove('hidden');
        checkBtn.disabled = true;
        checkBtn.textContent = 'Analyzing...';

        // Disable inputs
        urlInput.disabled = true;
        deviceType.disabled = true;

        try {
            const apiUrl = `${PAGESPEED_API}?url=${encodeURIComponent(url)}&strategy=${strategy}&category=PERFORMANCE&key=${API_KEY}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || 'Failed to fetch PageSpeed data');
            }

            const data = await response.json();

            if (!data.lighthouseResult) {
                throw new Error('Analysis failed to run fully. Please try again.');
            }

            renderResults(data.lighthouseResult, url, strategy);

        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
        } finally {
            loadingState.classList.add('hidden');
            checkBtn.disabled = false;
            checkBtn.textContent = 'Test Speed';
            urlInput.disabled = false;
            deviceType.disabled = false;
        }
    }

    function renderResults(result, url, strategy) {
        resultCard.classList.remove('hidden');
        resultCard.scrollIntoView({ behavior: 'smooth' });

        // Meta
        analyzedUrl.textContent = url;
        deviceBadge.textContent = strategy === 'mobile' ? 'Mobile' : 'Desktop';
        timestampBadge.textContent = new Date().toLocaleTimeString();

        // Score (0-1) -> Percentage
        const score = Math.round(result.categories.performance.score * 100);
        updateGauge(score);

        // Metrics
        const metrics = result.audits;
        updateMetric('lcp', metrics['largest-contentful-paint']);
        updateMetric('tbt', metrics['total-blocking-time']);
        updateMetric('cls', metrics['cumulative-layout-shift']);
        updateMetric('si', metrics['speed-index']);

        // Screenshot
        if (result.audits['final-screenshot']?.details?.data) {
            screenshotImg.src = result.audits['final-screenshot'].details.data;
        }

        // Opportunities
        opportunitiesList.innerHTML = '';
        const audits = result.audits;
        const relevantAudits = Object.values(audits).filter(a =>
            a.score !== null && a.score < 0.9 &&
            (a.details?.type === 'opportunity' || a.id === 'diagnostics')
        ).sort((a, b) => (a.score || 0) - (b.score || 0)).slice(0, 5); // Worst 5

        if (relevantAudits.length === 0) {
            opportunitiesList.innerHTML = '<div class="opp-item success">Everything looks optimized! 🎉</div>';
        } else {
            relevantAudits.forEach(audit => {
                const item = document.createElement('div');
                item.className = 'opp-item';

                let savings = '';
                if (audit.details?.overallSavingsMs) {
                    savings = `<span class="savings">${(audit.details.overallSavingsMs / 1000).toFixed(1)}s saved</span>`;
                }

                item.innerHTML = `
                    <div class="opp-header">
                        <h4>${audit.title}</h4>
                        ${savings}
                    </div>
                    <p>${audit.description.split('[')[0]}</p>
                `;
                opportunitiesList.appendChild(item);
            });
        }
    }

    function updateGauge(score) {
        scoreValue.textContent = score;

        // Color
        let color = '#ef4444'; // Red
        if (score >= 50) color = '#f59e0b'; // Orange
        if (score >= 90) color = '#10b981'; // Green

        // CSS Variable for Conic Gradient
        performanceGauge.style.setProperty('--score-percent', `${score}%`);
        performanceGauge.style.setProperty('--score-color', color);
        scoreValue.style.color = color;
    }

    function updateMetric(id, audit) {
        if (!audit) return;

        const card = document.getElementById(`${id}Card`);
        const valueEl = document.getElementById(`${id}Value`);

        valueEl.textContent = audit.displayValue;

        // Rank: Green/Orange/Red
        let rank = 'neutral';
        if (audit.score >= 0.9) rank = 'success';
        else if (audit.score >= 0.5) rank = 'warning';
        else rank = 'danger';

        // Reset classes
        card.classList.remove('border-success', 'border-warning', 'border-danger');
        card.classList.add(`border-${rank}`);
        valueEl.style.color = `var(--${rank === 'neutral' ? 'text-primary' : rank})`; // Assuming CSS vars
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
    max-width: 900px;
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
    flex: 2;
}

.select-compact {
    flex: 0.5;
    min-width: 100px;
}

/* Gauge Chart */
.score-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--glass-border);
}

.gauge-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.gauge {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: conic-gradient(
        var(--score-color) var(--score-percent),
        rgba(255,255,255,0.1) 0
    );
    display: flex;
    align-items: center;
    justify-content: center;
}

.gauge-body {
    width: 100px; /* Inner circle size */
    height: 100px;
    background: var(--bg-tertiary); /* Match parent bg for cut-out effect */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.score-value {
    font-size: 2.5rem;
    font-weight: 800;
}

#scoreValue {
    font-size: 2.5rem;
    font-weight: bold;
}

.gauge-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-tertiary);
}

.score-meta {
    flex: 1;
}

.url-text {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
    word-break: break-all;
}

.meta-badges {
    display: flex;
    gap: 0.5rem;
}

.badge {
    background: rgba(255,255,255,0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-transform: uppercase;
}

/* Metrics Grid */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 2rem;
}

.metric-card {
    background: rgba(255,255,255,0.03);
    padding: 1rem;
    border-radius: var(--radius-md);
    border-top: 3px solid transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.border-success { border-top-color: #10b981; }
.border-warning { border-top-color: #f59e0b; }
.border-danger { border-top-color: #ef4444; }

.metric-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0.5rem 0;
}

.metric-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-secondary);
}

.metric-desc {
    font-size: 0.75rem;
    color: var(--text-tertiary);
}

/* Opportunities */
.opportunities-section {
    padding: 0 2rem 2rem;
}

.opportunities-section h3 {
    margin-bottom: 1rem;
    color: var(--primary-light);
}

.opp-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.opp-item {
    background: rgba(0,0,0,0.2);
    padding: 1rem;
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--warning);
}

.opp-item.success {
    border-left-color: var(--success);
    background: rgba(16, 185, 129, 0.1);
}

.opp-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.opp-header h4 {
    margin: 0;
    font-size: 1rem;
}

.savings {
    font-size: 0.8rem;
    color: #f87171;
    font-weight: bold;
}

.screenshot-section {
    padding: 0 2rem 2rem;
    text-align: center;
}

.screenshot-img {
    max-width: 100%;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--glass-border);
}

/* Loading */
.loading-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-tertiary);
}

.spinner-large {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left-color: var(--primary);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
}

.progress-steps {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    opacity: 0.7;
    font-size: 0.8rem;
}

@media (max-width: 768px) {
    .url-input-wrapper {
        flex-direction: column;
    }
    
    .score-header {
        flex-direction: column;
        text-align: center;
    }
    
    .metrics-grid {
        grid-template-columns: 1fr;
    }
}
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
