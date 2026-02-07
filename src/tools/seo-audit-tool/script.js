/**
 * SEO Audit Tool
 * Comprehensive website analyzer and grader
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
            <div class="tool-icon-large">🛡️</div>
            <h1>SEO Audit Tool</h1>
            <p class="tool-description">
              Analyze your website's health, performance, and on-page SEO.
              Get a comprehensive report with actionable fixes.
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
                        <button id="auditBtn" class="btn btn-primary btn-lg">Run Audit</button>
                    </div>
                </div>
            </div>
            
            <!-- Loading -->
            <div id="loadingState" class="loading-state hidden">
                <div class="spinner-large"></div>
                <h3>Auditing Website...</h3>
                <p>Crawling page, checking tags, and testing speed.</p>
                <div class="progress-steps" id="progressSteps">
                    <span class="step active">Measuring Speed...</span>
                    <span class="step">Analyzing Content...</span>
                    <span class="step">Calculating Score...</span>
                </div>
            </div>
            
            <!-- Result Report -->
            <div id="reportCard" class="report-card hidden">
                <!-- Header / Score -->
                <div class="report-header">
                    <div class="score-circle-wrapper">
                        <div class="score-circle" id="overallScoreCircle">
                            <span class="score-grade" id="overallGrade">-</span>
                            <span class="score-number" id="overallScore">-</span>
                        </div>
                    </div>
                    <div class="report-meta">
                        <h2>SEO Audit Report</h2>
                        <a href="#" id="analyzedLink" target="_blank" class="analyzed-link">example.com</a>
                        <p id="auditSummary">We found <strong id="issuesCount">0</strong> issues to fix.</p>
                    </div>
                </div>
                
                <!-- Sections Grid -->
                <div class="audit-grid">
                    <!-- On-Page SEO -->
                    <div class="audit-section" id="onPageSection">
                        <div class="section-header">
                            <h3>📄 On-Page SEO</h3>
                            <span class="section-score" id="onPageScore">-</span>
                        </div>
                        <div class="check-list" id="onPageChecks">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                    
                    <!-- Technical SEO -->
                    <div class="audit-section" id="techSection">
                        <div class="section-header">
                            <h3>⚙️ Technical SEO</h3>
                            <span class="section-score" id="techScore">-</span>
                        </div>
                        <div class="check-list" id="techChecks">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                    
                    <!-- Performance -->
                    <div class="audit-section" id="perfSection">
                        <div class="section-header">
                            <h3>⚡ Performance</h3>
                            <span class="section-score" id="perfScore">-</span>
                        </div>
                         <div class="check-list" id="perfChecks">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>
                
                <!-- Action Plan -->
                <div class="action-plan">
                    <h3>🚀 Priority Action Plan</h3>
                    <ul id="actionPlanList">
                        <!-- Populated by JS -->
                    </ul>
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
    const auditBtn = document.getElementById('auditBtn');
    const loadingState = document.getElementById('loadingState');
    const reportCard = document.getElementById('reportCard');

    // UI Elements
    const overallScoreCircle = document.getElementById('overallScoreCircle');
    const overallGrade = document.getElementById('overallGrade');
    const overallScore = document.getElementById('overallScore');
    const analyzedLink = document.getElementById('analyzedLink');
    const issuesCount = document.getElementById('issuesCount');
    const actionPlanList = document.getElementById('actionPlanList');
    const progressSteps = document.getElementById('progressSteps');

    auditBtn.addEventListener('click', runAudit);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runAudit();
    });

    async function runAudit() {
        const url = urlInput.value.trim();
        if (!url) {
            showToast('Please enter a valid URL', 'error');
            return;
        }

        // Reset & Show Loading
        reportCard.classList.add('hidden');
        loadingState.classList.remove('hidden');
        auditBtn.disabled = true;
        urlInput.disabled = true;

        try {
            // Step 1: Fetch PageSpeed Data (Performance)
            updateProgress(0);
            const perfData = await fetchPageSpeed(url);

            // Step 2: Fetch HTML Content (On-Page/Tech)
            updateProgress(1);
            const htmlData = await fetchHtmlContent(url);

            // Step 3: Analyze & Score
            updateProgress(2);
            const report = generateReport(url, perfData, htmlData);

            // Step 4: Render
            renderReport(report);

        } catch (error) {
            console.error(error);
            showToast(error.message || 'Audit failed. Check URL accessibility.', 'error');
        } finally {
            loadingState.classList.add('hidden');
            auditBtn.disabled = false;
            auditBtn.textContent = 'Run Audit';
            urlInput.disabled = false;
        }
    }

    function updateProgress(stepIndex) {
        const steps = progressSteps.querySelectorAll('.step');
        steps.forEach((s, i) => {
            if (i === stepIndex) s.classList.add('active');
            else s.classList.remove('active');
        });
    }

    async function fetchPageSpeed(url) {
        const apiUrl = `${PAGESPEED_API}?url=${encodeURIComponent(url)}&strategy=mobile&category=PERFORMANCE&key=${API_KEY}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to measure performance.');
        return await res.json();
    }

    async function fetchHtmlContent(url) {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error('Failed to crawl page HTML. Ensure site is public.');
        return await res.text();
    }

    function generateReport(url, perfData, html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        let score = 100;
        let issues = [];
        let checks = {
            onPage: [],
            tech: [],
            perf: []
        };

        // --- 1. On-Page Analysis ---

        // Title
        const title = doc.querySelector('title')?.textContent || '';
        if (!title) {
            score -= 10;
            checks.onPage.push({ status: 'fail', msg: 'Missing Page Title' });
            issues.push('Add a title tag to the <head>.');
        } else if (title.length < 30 || title.length > 60) {
            score -= 5;
            checks.onPage.push({ status: 'warn', msg: `Title length (${title.length} chars) should be 30-60.` });
            issues.push('Optimize title length (30-60 characters).');
        } else {
            checks.onPage.push({ status: 'pass', msg: 'Title length is optimal.' });
        }

        // Meta Description
        const desc = doc.querySelector('meta[name="description"]')?.content || '';
        if (!desc) {
            score -= 10;
            checks.onPage.push({ status: 'fail', msg: 'Missing Meta Description' });
            issues.push('Add a meta description for better CTR.');
        } else if (desc.length < 100 || desc.length > 160) {
            score -= 5;
            checks.onPage.push({ status: 'warn', msg: `Description length (${desc.length} chars) should be 100-160.` });
            issues.push('Optimize meta description length (100-160 characters).');
        } else {
            checks.onPage.push({ status: 'pass', msg: 'Meta description length is optimal.' });
        }

        // H1
        const h1s = doc.querySelectorAll('h1');
        if (h1s.length === 0) {
            score -= 10;
            checks.onPage.push({ status: 'fail', msg: 'Missing H1 Heading' });
            issues.push('Add exactly one H1 tag per page.');
        } else if (h1s.length > 1) {
            score -= 5;
            checks.onPage.push({ status: 'warn', msg: `Found ${h1s.length} H1 tags. Should be exactly 1.` });
            issues.push('Reduce to a single H1 tag.');
        } else {
            checks.onPage.push({ status: 'pass', msg: 'H1 tag is present and unique.' });
        }

        // Images / Alt Text
        const images = doc.querySelectorAll('img');
        const totalImages = images.length;
        let missingAlt = 0;
        images.forEach(img => {
            if (!img.alt || img.alt.trim() === '') missingAlt++;
        });

        if (totalImages > 0 && missingAlt > 0) {
            const percent = (missingAlt / totalImages);
            if (percent > 0.1) score -= 5;
            checks.onPage.push({ status: percent > 0.1 ? 'warn' : 'pass', msg: `${missingAlt}/${totalImages} images missing alt text.` });
            if (percent > 0.1) issues.push('Add alt text to images for accessibility and SEO.');
        } else {
            checks.onPage.push({ status: 'pass', msg: 'All images have alt text.' });
        }

        // --- 2. Technical SEO ---

        // Canonical
        const canonical = doc.querySelector('link[rel="canonical"]');
        if (!canonical) {
            score -= 5;
            checks.tech.push({ status: 'warn', msg: 'Missing Canonical Tag' });
            issues.push('Add a canonical tag to prevent duplicate content.');
        } else {
            checks.tech.push({ status: 'pass', msg: 'Canonical tag is present.' });
        }

        // Meta Robots
        const robots = doc.querySelector('meta[name="robots"]');
        if (robots && robots.content.includes('noindex')) {
            checks.tech.push({ status: 'warn', msg: 'Page is set to NOINDEX.' });
        } else {
            checks.tech.push({ status: 'pass', msg: 'Page is distinct (indexable).' });
        }

        // Favicon
        const hasFavicon = doc.querySelector('link[rel*="icon"]');
        if (!hasFavicon) {
            checks.tech.push({ status: 'warn', msg: 'No Favicon detected.' });
        } else {
            checks.tech.push({ status: 'pass', msg: 'Favicon detected.' });
        }

        // Https (Inferred from URL)
        if (url.startsWith('https://')) {
            checks.tech.push({ status: 'pass', msg: 'Secure (HTTPS) connection.' });
        } else {
            score -= 10;
            checks.tech.push({ status: 'fail', msg: 'Insecure (HTTP) connection.' });
            issues.push('Migrate site to HTTPS (SSL Certificate).');
        }

        // --- 3. Performance ---

        const perfScore = Math.round(perfData.lighthouseResult.categories.performance.score * 100);

        if (perfScore < 50) {
            score -= 20;
            checks.perf.push({ status: 'fail', msg: `Low Speed Score: ${perfScore}/100` });
            issues.push('Critical speed issues. Optimize images and JS.');
        } else if (perfScore < 90) {
            score -= 10;
            checks.perf.push({ status: 'warn', msg: `Average Speed Score: ${perfScore}/100` });
            issues.push('Improve page load speed (LCP/CLS).');
        } else {
            checks.perf.push({ status: 'pass', msg: `Excellent Speed Score: ${perfScore}/100` });
        }

        // Core Web Vitals Status
        const audits = perfData.lighthouseResult.audits;
        const lcp = audits['largest-contentful-paint'].displayValue;
        const cls = audits['cumulative-layout-shift'].displayValue;

        checks.perf.push({ status: audits['largest-contentful-paint'].score >= 0.9 ? 'pass' : 'warn', msg: `LCP: ${lcp}` });
        checks.perf.push({ status: audits['cumulative-layout-shift'].score >= 0.9 ? 'pass' : 'warn', msg: `CLS: ${cls}` });


        // Final Score Calc
        score = Math.max(0, score);

        let grade = 'F';
        if (score >= 90) grade = 'A';
        else if (score >= 80) grade = 'B';
        else if (score >= 70) grade = 'C';
        else if (score >= 60) grade = 'D';

        return {
            url,
            score,
            grade,
            checks,
            issues
        };
    }

    function renderReport(data) {
        reportCard.classList.remove('hidden');
        reportCard.scrollIntoView({ behavior: 'smooth' });

        // Meta
        analyzedLink.textContent = data.url;
        analyzedLink.href = data.url;
        issuesCount.textContent = data.issues.length;

        // Score
        overallScore.textContent = data.score;
        overallGrade.textContent = data.grade;

        // Score Color
        let color = 'var(--error)';
        if (data.grade === 'A') color = 'var(--success)';
        else if (data.grade === 'B') color = 'var(--accent)'; // Blue/Purple?
        else if (data.grade === 'C') color = 'var(--warning)'; // Yellow

        overallScoreCircle.style.background = `conic-gradient(${color} ${data.score}%, rgba(255,255,255,0.1) 0)`;
        overallGrade.style.color = color;

        // Render Sections
        renderChecks('onPageChecks', data.checks.onPage);
        renderChecks('techChecks', data.checks.tech);
        renderChecks('perfChecks', data.checks.perf);

        // Action Plan
        actionPlanList.innerHTML = '';
        if (data.issues.length === 0) {
            actionPlanList.innerHTML = '<li class="action-item success">Great job! No major issues found.</li>';
        } else {
            data.issues.forEach(issue => {
                const li = document.createElement('li');
                li.className = 'action-item';
                li.textContent = issue;
                actionPlanList.appendChild(li);
            });
        }
    }

    function renderChecks(elementId, checks) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';

        checks.forEach(check => {
            const item = document.createElement('div');
            item.className = `check-item check-${check.status}`;

            let icon = '✓';
            if (check.status === 'fail') icon = '✕';
            if (check.status === 'warn') icon = '!';

            item.innerHTML = `
                <div class="check-icon">${icon}</div>
                <div class="check-msg">${check.msg}</div>
            `;
            container.appendChild(item);
        });
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
    max-width: 1000px;
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

/* Report Header */
.report-header {
    background: var(--bg-tertiary);
    padding: 2rem;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    display: flex;
    align-items: center;
    gap: 2rem;
    border-bottom: 1px solid var(--glass-border);
}

.score-circle-wrapper {
    flex-shrink: 0;
}

.score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    /* BG set dynamically via inline style */
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
}

.score-circle::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    background: var(--bg-tertiary);
    border-radius: 50%;
}

.score-grade {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
    z-index: 1;
}

.score-number {
    font-size: 1rem;
    color: var(--text-tertiary);
    z-index: 1;
}

.report-meta h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
}

.analyzed-link {
    color: var(--primary-light);
    font-size: 1.1rem;
    text-decoration: none;
    margin-bottom: 0.5rem;
    display: inline-block;
}

/* Audit Grid */
.audit-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--glass-border);
}

.audit-section {
    padding: 1.5rem;
    border-right: 1px solid var(--glass-border);
}

.audit-section:last-child {
    border-right: none;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(255,255,255,0.05);
}

.section-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-secondary);
}

.check-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.check-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    background: rgba(0,0,0,0.2);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
}

.check-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: bold;
    font-size: 0.7rem;
    flex-shrink: 0;
}

/* Status variants */
.check-pass .check-icon { background: #10b981; color: white; }
.check-pass { border-left: 2px solid #10b981; }

.check-warn .check-icon { background: #f59e0b; color: white; }
.check-warn { border-left: 2px solid #f59e0b; }

.check-fail .check-icon { background: #ef4444; color: white; }
.check-fail { border-left: 2px solid #ef4444; }

/* Action Plan */
.action-plan {
    padding: 2rem;
    background: var(--bg-secondary);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.action-plan h3 {
    margin-bottom: 1rem;
    color: var(--primary-light);
}

.action-item {
    background: rgba(239, 68, 68, 0.1);
    color: #fca5a5;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
}

.action-item::before {
    content: '🔧';
    margin-right: 0.75rem;
}

.action-item.success {
    background: rgba(16, 185, 129, 0.1);
    color: #6ee7b7;
}
.action-item.success::before {
    content: '🎉';
}

/* Loading */
.loading-state {
    text-align: center;
    padding: 3rem;
}

.spinner-large {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left-color: var(--primary);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
}

.progress-steps {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    color: var(--text-tertiary);
    font-size: 0.9rem;
}

.step.active {
    color: var(--primary-light);
    font-weight: bold;
}

@media (max-width: 900px) {
    .report-header {
        flex-direction: column;
        text-align: center;
    }
    
    .audit-grid {
        grid-template-columns: 1fr;
    }
    
    .audit-section {
        border-right: none;
        border-bottom: 1px solid var(--glass-border);
    }
}
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
