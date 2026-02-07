/**
 * SEO Audit Tool
 * Comprehensive website analyzer and grader
 */

import '../../styles/main.css';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createAdUnit, adStyles } from '../../components/AdUnit.js';
import { showToast, formatURL } from '../../utils/common.js';

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
                    <div class="score-ring-wrapper">
                        <div class="score-ring" id="overallScoreRing">
                            <span class="score-grade" id="overallGrade">-</span>
                            <span class="score-number" id="overallScore">-</span>
                        </div>
                    </div>
                    <div class="report-meta">
                        <h2>SEO Audit Report</h2>
                        <a href="#" id="analyzedLink" target="_blank" class="analyzed-link">example.com</a>
                        <p id="auditSummary">We found <strong id="issuesCount">0</strong> issues to fix.</p>
                        <div class="audit-badges">
                            <span class="badge badge-tech" id="timeBadge">⚡ 0.0s</span>
                            <span class="badge badge-tech" id="sizeBadge">📦 0 KB</span>
                            <span class="badge badge-tech" id="wordBadge">📝 0 words</span>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Overview -->
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <div class="card-title">Meta Information</div>
                        <div class="progress-bar-container"><div id="metaBar" class="progress-bar-fill" style="width: 0%"></div></div>
                        <div class="card-value" id="metaScoreVal">0%</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-title">Page Structure</div>
                        <div class="progress-bar-container"><div id="structBar" class="progress-bar-fill" style="width: 0%"></div></div>
                        <div class="card-value" id="structScoreVal">0%</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-title">Link Structure</div>
                        <div class="progress-bar-container"><div id="linkBar" class="progress-bar-fill" style="width: 0%"></div></div>
                        <div class="card-value" id="linkScoreVal">0%</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-title">Server Config</div>
                        <div class="progress-bar-container"><div id="serverBar" class="progress-bar-fill" style="width: 0%"></div></div>
                        <div class="card-value" id="serverScoreVal">0%</div>
                    </div>
                </div>

                <!-- Page Overview & Previews -->
                <div class="previews-grid">
                    <div class="preview-card">
                        <div class="card-title">SERP Snippet Preview</div>
                        <div class="serp-preview">
                            <div id="serpTitle" class="serp-title">Page Title Goes Here</div>
                            <div id="serpUrl" class="serp-url">https://example.com › ...</div>
                            <div id="serpDesc" class="serp-desc">Your meta description will appear here in Google search results.</div>
                        </div>
                    </div>
                    <div class="preview-card">
                        <div class="card-title">Social Media Preview</div>
                        <div class="social-preview-wrapper">
                            <div class="social-preview fb">
                                <div class="social-img" id="socialImg"></div>
                                <div class="social-info">
                                    <div class="social-domain" id="socialDomain">EXAMPLE.COM</div>
                                    <div class="social-title" id="socialTitle">Social Title</div>
                                    <div class="social-desc" id="socialDesc">Social description...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Keywords & Metrics -->
                <div class="metrics-grid">
                    <div class="keywords-card">
                        <div class="card-title">Top Keywords</div>
                        <div class="keyword-list" id="keywordList">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                    <div class="details-card">
                        <div class="card-title">Content Quality</div>
                        <div class="quality-item">
                            <span>Text-to-HTML Ratio</span>
                            <strong id="textHtmlRatio">0%</strong>
                        </div>
                        <div class="quality-item">
                            <span>Rich Content</span>
                            <strong id="richContentStatus">Checking...</strong>
                        </div>
                    </div>
                </div>
                
                <!-- Priority Tasks -->
                <div class="priority-section">
                    <h3>🛠️ Priority Tasks</h3>
                    <div class="todo-table-wrapper">
                        <table class="todo-table">
                            <thead>
                                <tr>
                                    <th>To-Do</th>
                                    <th>Importance</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="priorityTbody">
                                <!-- Populated by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Detailed Checks Accordion -->
                <div class="detailed-checks-section">
                    <div class="tabs-nav">
                        <button class="tab-btn active" data-tab="onPage">On-Page</button>
                        <button class="tab-btn" data-tab="tech">Technical</button>
                        <button class="tab-btn" data-tab="content">Content</button>
                        <button class="tab-btn" data-tab="perf">Performance</button>
                    </div>
                    <div id="detailedChecksContent" class="tabs-content">
                        <!-- Populated by JS -->
                    </div>
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

        // Reset & Show Loading
        reportCard.classList.add('hidden');
        loadingState.classList.remove('hidden');
        auditBtn.disabled = true;
        urlInput.disabled = true;

        let perfData = null;
        let htmlData = null;

        try {
            // Step 1: Fetch PageSpeed Data (Performance) - Optional
            updateProgress(0);
            try {
                perfData = await fetchPageSpeed(url);
            } catch (e) {
                console.warn('PageSpeed failed:', e);
                showToast(`Performance check skipped: ${e.message}`, 'warning');
            }

            // Step 2: Fetch HTML Content (On-Page/Tech) - Required
            updateProgress(1);
            htmlData = await fetchHtmlContent(url);

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

    function initTabs() {
        const tabsContent = document.getElementById('detailedChecksContent');
        const tabBtns = document.querySelectorAll('.tab-btn');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderDetailedTab(btn.dataset.tab, lastReportData);
            });
        });
    }

    let lastReportData = null;

    function generateReport(url, perfData, html) {
        const startTime = performance.now();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const endTime = performance.now();
        const responseTime = ((endTime - startTime) / 1000).toFixed(2);
        const pageSize = (new Blob([html]).size / 1024).toFixed(1);

        let scores = {
            meta: 100,
            struct: 100,
            link: 100,
            server: 100,
            perf: 100
        };

        let issues = [];
        let checks = {
            onPage: [],
            tech: [],
            content: [],
            perf: []
        };

        // --- 1. Meta / On-Page ---
        const title = doc.querySelector('title')?.textContent || '';
        const desc = doc.querySelector('meta[name="description"]')?.content || '';
        const h1s = doc.querySelectorAll('h1');
        const favicon = doc.querySelector('link[rel*="icon"]')?.href || '';

        if (!title) {
            scores.meta -= 40;
            checks.onPage.push({ status: 'error', label: 'Meta Title', desc: 'Missing title tag.' });
            issues.push({ task: 'Add a page title', importance: 'high', action: 'SEO best practice' });
        } else if (title.length < 30 || title.length > 60) {
            scores.meta -= 20;
            checks.onPage.push({ status: 'warn', label: 'Meta Title', desc: `Length is ${title.length} chars (Target: 30-60).` });
            issues.push({ task: 'Optimize title length', importance: 'medium', action: 'Improve CTR' });
        } else {
            checks.onPage.push({ status: 'passed', label: 'Meta Title', desc: 'Title is optimized.' });
        }

        if (!desc) {
            scores.meta -= 40;
            checks.onPage.push({ status: 'error', label: 'Meta Description', desc: 'Missing meta description.' });
            issues.push({ task: 'Add meta description', importance: 'high', action: 'Increase clicks' });
        } else if (desc.length < 100 || desc.length > 160) {
            scores.meta -= 20;
            checks.onPage.push({ status: 'warn', label: 'Meta Description', desc: `Length is ${desc.length} chars (Target: 100-160).` });
            issues.push({ task: 'Fix meta desc length', importance: 'low', action: 'Avoid truncation' });
        } else {
            checks.onPage.push({ status: 'passed', label: 'Meta Description', desc: 'Description is optimized.' });
        }

        // --- 2. Structure ---
        if (h1s.length === 0) {
            scores.struct -= 40;
            checks.onPage.push({ status: 'error', label: 'H1 Header', desc: 'No H1 found.' });
            issues.push({ task: 'Add H1 heading', importance: 'high', action: 'Header hierarchy' });
        } else if (h1s.length > 1) {
            scores.struct -= 20;
            checks.onPage.push({ status: 'warn', label: 'H1 Header', desc: `Multiple (${h1s.length}) H1s found.` });
            issues.push({ task: 'Reduce to one H1', importance: 'medium', action: 'Standard SEO' });
        } else {
            checks.onPage.push({ status: 'passed', label: 'H1 Header', desc: 'Primary heading is present.' });
        }

        const images = doc.querySelectorAll('img');
        let missingAlt = 0;
        images.forEach(img => { if (!img.alt) missingAlt++; });
        if (images.length > 0 && missingAlt > 0) {
            scores.struct -= 10;
            checks.onPage.push({ status: missingAlt > images.length / 2 ? 'error' : 'warn', label: 'Image Alt Tags', desc: `${missingAlt} images missing alt text.` });
            issues.push({ task: 'Add alt attributes', importance: 'medium', action: 'Accessibility' });
        }

        // --- 3. Links ---
        const links = doc.querySelectorAll('a');
        let broken = 0; // Simple check for empty/hash links
        links.forEach(l => { if (!l.getAttribute('href') || l.getAttribute('href') === '#') broken++; });
        if (broken > 5) {
            scores.link -= 20;
            checks.tech.push({ status: 'warn', label: 'Internal Links', desc: `Found ${broken} empty or placeholder links.` });
            issues.push({ task: 'Fix broken/empty links', importance: 'low', action: 'User experience' });
        }

        // --- 4. Server / Tech ---
        if (url.startsWith('https://')) {
            checks.tech.push({ status: 'passed', label: 'HTTPS', desc: 'SSL certificate active.' });
        } else {
            scores.server -= 50;
            checks.tech.push({ status: 'error', label: 'HTTPS', desc: 'Insecure connection detected.' });
            issues.push({ task: 'Enable HTTPS', importance: 'high', action: 'Security' });
        }

        const canonical = doc.querySelector('link[rel="canonical"]');
        if (!canonical) {
            scores.server -= 10;
            checks.tech.push({ status: 'warn', label: 'Canonical Tag', desc: 'Link rel="canonical" is missing.' });
        } else {
            checks.tech.push({ status: 'passed', label: 'Canonical Tag', desc: 'Canonical URL is set.' });
        }

        // --- 5. Content Metric ---
        const bodyText = doc.body.innerText || '';
        const words = bodyText.split(/\s+/).filter(w => w.length > 2);
        const wordCount = words.length;

        // Text-to-HTML Ratio
        const textLen = bodyText.length;
        const htmlLen = html.length;
        const textToHtmlRatio = ((textLen / htmlLen) * 100).toFixed(1);

        if (wordCount < 300) {
            checks.content.push({ status: 'warn', label: 'Content Length', desc: `Word count is low (${wordCount} words).` });
            issues.push({ task: 'Add more content', importance: 'low', action: 'Context depth' });
        } else {
            checks.content.push({ status: 'passed', label: 'Content Length', desc: `Good content depth (${wordCount} words).` });
        }

        // Keywords Density (Simple)
        const wordFreq = {};
        words.forEach(w => {
            const word = w.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (word.length > 3) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        const topKeywords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => ({ word, count, density: ((count / wordCount) * 100).toFixed(1) }));

        // --- 6. Social Media (OG / Twitter) ---
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.content || '';
        const ogDesc = doc.querySelector('meta[property="og:description"]')?.content || '';
        const ogImage = doc.querySelector('meta[property="og:image"]')?.content || '';
        const twitterCard = doc.querySelector('meta[name="twitter:card"]')?.content || '';

        const hasSocial = ogTitle || ogDesc || ogImage || twitterCard;
        if (!hasSocial) {
            scores.meta -= 10;
            checks.onPage.push({ status: 'warn', label: 'Social Tags', desc: 'Missing Open Graph or Twitter cards.' });
            issues.push({ task: 'Add Social Meta Tags', importance: 'medium', action: 'Better sharing' });
        } else {
            checks.onPage.push({ status: 'passed', label: 'Social Tags', desc: 'Open Graph tags found.' });
        }

        // --- 7. Performance ---
        if (perfData && perfData.lighthouseResult) {
            const ps = Math.round(perfData.lighthouseResult.categories.performance.score * 100);
            scores.perf = ps;
            checks.perf.push({ status: ps > 89 ? 'passed' : (ps > 49 ? 'warn' : 'error'), label: 'Lighthouse Score', desc: `Performance is ${ps}/100.` });
        } else {
            scores.perf = 0;
            checks.perf.push({ status: 'warn', label: 'Performance', desc: 'No speed data available.' });
        }

        // Weighted Overall Score
        const overallScore = Math.round((scores.meta * 0.3) + (scores.struct * 0.25) + (scores.link * 0.15) + (scores.server * 0.1) + (scores.perf * 0.2));

        let grade = 'F';
        if (overallScore >= 90) grade = 'A';
        else if (overallScore >= 80) grade = 'B';
        else if (overallScore >= 70) grade = 'C';
        else if (overallScore >= 60) grade = 'D';

        return {
            url, title, desc, favicon,
            overallScore, grade,
            responseTime, pageSize, words: wordCount,
            textToHtmlRatio, topKeywords,
            og: { title: ogTitle, desc: ogDesc, image: ogImage },
            scores,
            checks,
            issues
        };
    }

    function renderReport(data) {
        lastReportData = data;
        reportCard.classList.remove('hidden');
        reportCard.scrollIntoView({ behavior: 'smooth' });

        // Meta
        analyzedLink.textContent = data.url;
        analyzedLink.href = data.url;
        issuesCount.textContent = data.issues.length;

        // Badges
        document.getElementById('timeBadge').textContent = `⚡ ${data.responseTime}s`;
        document.getElementById('sizeBadge').textContent = `📦 ${data.pageSize} KB`;
        document.getElementById('wordBadge').textContent = `📝 ${data.words} words`;

        // Ring
        const ring = document.getElementById('overallScoreRing');
        const gradeEl = document.getElementById('overallGrade');
        const scoreEl = document.getElementById('overallScore');

        scoreEl.textContent = data.overallScore;
        gradeEl.textContent = data.grade;

        let color = '#ef4444'; // Red
        if (data.overallScore >= 90) color = '#10b981'; // Green
        else if (data.overallScore >= 70) color = '#f59e0b'; // Orange

        ring.style.background = `conic-gradient(${color} ${data.overallScore}%, rgba(255,255,255,0.05) 0)`;
        gradeEl.style.color = color;

        // Dashboard Bars
        updateBar('metaBar', 'metaScoreVal', data.scores.meta);
        updateBar('structBar', 'structScoreVal', data.scores.struct);
        updateBar('linkBar', 'linkScoreVal', data.scores.link);
        updateBar('serverBar', 'serverScoreVal', data.scores.server);

        // SERP Preview
        document.getElementById('serpTitle').textContent = data.title || '(No Title)';
        document.getElementById('serpUrl').textContent = `${data.url} › ...`;
        document.getElementById('serpDesc').textContent = data.desc || '(No Description)';

        // Social Preview
        document.getElementById('socialTitle').textContent = data.og.title || data.title || 'Social Preview';
        document.getElementById('socialDesc').textContent = data.og.desc || data.desc || 'Social description preview...';
        document.getElementById('socialDomain').textContent = new URL(data.url).hostname.toUpperCase();
        const socialImg = document.getElementById('socialImg');
        if (data.og.image) {
            socialImg.style.backgroundImage = `url(${data.og.image})`;
        } else {
            socialImg.style.background = '#f0f2f5';
        }

        // Keywords
        const kwList = document.getElementById('keywordList');
        kwList.innerHTML = '';
        data.topKeywords.forEach(kw => {
            const div = document.createElement('div');
            div.className = 'keyword-item';
            div.innerHTML = `
                <span>${kw.word}</span>
                <span class="keyword-count">${kw.density}%</span>
            `;
            kwList.appendChild(div);
        });

        // Content Quality
        document.getElementById('textHtmlRatio').textContent = `${data.textToHtmlRatio}%`;
        document.getElementById('richContentStatus').textContent = data.words > 600 ? 'Excellent' : (data.words > 300 ? 'Good' : 'Thin');

        // Priority Tasks
        const tbody = document.getElementById('priorityTbody');
        tbody.innerHTML = '';
        if (data.issues.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">No issues found! Your site is looking great.</td></tr>';
        } else {
            data.issues.forEach(issue => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${issue.task}</td>
                    <td><span class="importance-badge importance-${issue.importance}">${issue.importance}</span></td>
                    <td><a href="#" class="action-link">${issue.action} ›</a></td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Default Tab
        initTabs();
        renderDetailedTab('onPage', data);
    }

    function updateBar(barId, valId, score) {
        const bar = document.getElementById(barId);
        const val = document.getElementById(valId);
        bar.style.width = score + '%';
        val.textContent = score + '%';

        if (score < 50) bar.style.background = '#ef4444';
        else if (score < 80) bar.style.background = '#f59e0b';
        else bar.style.background = '#10b981';
    }

    function renderDetailedTab(tab, data) {
        const content = document.getElementById('detailedChecksContent');
        content.innerHTML = '';

        const checks = data.checks[tab] || [];
        checks.forEach(check => {
            const div = document.createElement('div');
            div.className = 'check-item-detailed';
            div.innerHTML = `
                <div class="check-info">
                    <span class="check-label">${check.label}</span>
                    <span class="check-desc">${check.desc}</span>
                </div>
                <span class="check-status-badge status-${check.status}">${check.status}</span>
            `;
            content.appendChild(div);
        });
    }

    function updateProgress(stepIndex) {
        const steps = progressSteps.querySelectorAll('.step');
        steps.forEach((s, i) => {
            if (i === stepIndex) s.classList.add('active');
            else s.classList.remove('active');
        });
    }

    async function fetchPageSpeed(url) {
        try {
            const apiUrl = `${PAGESPEED_API}?url=${encodeURIComponent(url)}&strategy=mobile&category=PERFORMANCE&key=${API_KEY}`;
            const res = await fetch(apiUrl);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || 'Failed to measure performance.');
            }
            return await res.json();
        } catch (e) {
            console.error('PageSpeed helper error:', e);
            throw e;
        }
    }

    async function fetchHtmlContent(url) {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error('Failed to crawl page HTML. Ensure site is public.');
        return await res.text();
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

.report-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    animation: slideUp 0.5s ease-out;
}

/* Header & Score */
.report-header {
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%);
    padding: 2.5rem;
    display: flex;
    align-items: center;
    gap: 3rem;
    border-bottom: 1px solid var(--glass-border);
}

.score-ring-wrapper {
    flex-shrink: 0;
    position: relative;
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.score-ring {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: conic-gradient(var(--accent) 0%, rgba(255,255,255,0.05) 0%);
    box-shadow: inset 0 0 15px rgba(0,0,0,0.5);
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.score-ring::after {
    content: '';
    position: absolute;
    width: 110px;
    height: 110px;
    background: var(--bg-secondary);
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.score-grade {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1;
    z-index: 1;
    text-shadow: 0 0 20px rgba(0,0,0,0.5);
}

.score-number {
    font-size: 1rem;
    color: var(--text-tertiary);
    z-index: 1;
}

.report-meta h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #fff, var(--text-tertiary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.analyzed-link {
    color: var(--primary-light);
    font-size: 1.2rem;
    text-decoration: none;
    margin-bottom: 0.75rem;
    display: block;
    transition: color 0.3s;
}

.analyzed-link:hover {
    color: var(--accent);
}

.audit-badges {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.badge-tech {
    background: rgba(255,255,255,0.05);
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    color: var(--text-secondary);
    border: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Dashboard Grid */
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    padding: 2rem;
    background: rgba(0,0,0,0.1);
}

.dashboard-card {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.card-title {
    font-size: 0.9rem;
    color: var(--text-tertiary);
    font-weight: 500;
}

.progress-bar-container {
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 4px;
    transition: width 1s ease-in-out;
}

.card-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
}

/* Previews Grid */
.previews-grid, .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding: 0 2rem 1.5rem;
}

.preview-card, .keywords-card, .details-card {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
}

/* SERP Preview */
.serp-preview {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.serp-title {
    color: #1a0dab;
    font-size: 1.25rem;
    font-family: arial, sans-serif;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.serp-url {
    color: #202124;
    font-size: 0.875rem;
    font-family: arial, sans-serif;
    margin-bottom: 4px;
}

.serp-desc {
    color: #4d5156;
    font-size: 0.875rem;
    line-height: 1.5;
    font-family: arial, sans-serif;
}

/* Social Preview */
.social-preview {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 1rem;
    border: 1px solid #ddd;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.social-img {
    height: 120px;
    background: #f0f2f5;
    background-size: cover;
    background-position: center;
}

.social-info {
    padding: 0.75rem;
    color: #1c1e21;
}

.social-domain {
    font-size: 0.75rem;
    color: #65676b;
    text-transform: uppercase;
    margin-bottom: 2px;
}

.social-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 4px;
}

.social-desc {
    font-size: 0.85rem;
    color: #65676b;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Keywords List */
.keyword-list {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.keyword-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
    font-size: 0.9rem;
}

.keyword-count {
    color: var(--accent);
    font-weight: 600;
}

/* Content Quality */
.quality-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.quality-item:last-child { border-bottom: none; }

.quality-item span { color: var(--text-tertiary); }
.quality-item strong { color: #fff; }

/* Priority Tasks Table Fixes */
.importance-badge {
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.importance-high { background: rgba(239,68,68,0.2); color: #fca5a5; }
.importance-medium { background: rgba(245,158,11,0.2); color: #fcd34d; }
.importance-low { background: rgba(59,130,246,0.2); color: #93c5fd; }

.action-link {
    color: var(--primary-light);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
}

/* Detailed Checks Tabs */
.detailed-checks-section {
    padding: 0 2rem 3rem;
}

.tabs-nav {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--glass-border);
}

.tab-btn {
    background: transparent;
    border: none;
    padding: 1rem 0.5rem;
    color: var(--text-tertiary);
    cursor: pointer;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
}

.tab-btn.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
}

.tabs-content {
    background: rgba(0,0,0,0.2);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    min-height: 200px;
}

.check-item-detailed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.check-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.check-label {
    font-weight: 600;
    color: var(--text-primary);
}

.check-desc {
    font-size: 0.85rem;
    color: var(--text-tertiary);
}

.check-status-badge {
    padding: 0.3rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
}

.status-passed { background: #10b981; color: #fff; }
.status-warn { background: #f59e0b; color: #fff; }
.status-error { background: #ef4444; color: #fff; }

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
    .report-header { flex-direction: column; text-align: center; gap: 1.5rem; }
    .dashboard-grid { grid-template-columns: 1fr 1fr; }
    .page-overview-card { flex-direction: column; }
    .page-preview-box { width: 100%; }
}

@media (max-width: 600px) {
    .dashboard-grid { grid-template-columns: 1fr; }
    .tabs-nav { flex-wrap: wrap; }
}
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
