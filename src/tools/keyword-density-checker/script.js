/**
 * Keyword Density Checker Tool
 * Analyzes content for keyword frequency and density to optimize SEO
 */

import '../../styles/main.css';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createAdUnit, adStyles } from '../../components/AdUnit.js';
import { showToast } from '../../utils/common.js';

// Common English Stop Words
const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

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
            <h1>Keyword Density Checker</h1>
            <p class="tool-description">
              Identify your most used keywords and phrases. Avoid keyword stuffing and balance your content.
            </p>
          </div>
        </div>
      </section>
      
      ${createAdUnit('banner')}
      
      <section class="tool-content section">
        <div class="container container-lg">
          
          <!-- Input Section -->
          <div class="input-card">
            <div class="tabs">
                <button class="tab-btn active" data-tab="text">Paste Text</button>
                <button class="tab-btn" data-tab="url">Check URL</button>
            </div>
            
            <div class="tab-content active" id="textTab">
                <textarea id="inputText" class="textarea input-large" placeholder="Paste your article content here to analyze..."></textarea>
            </div>
            
            <div class="tab-content hidden" id="urlTab">
                <div class="url-input-group">
                    <input type="url" id="inputUrl" class="input" placeholder="https://example.com/page-to-check" />
                </div>
                <small class="helper-text">We'll fetch the live page content.</small>
            </div>
            
            <div class="action-row">
                <button id="analyzeBtn" class="btn btn-primary btn-lg">Analyze Keywords</button>
                <button id="clearBtn" class="btn btn-secondary">Clear</button>
            </div>
          </div>
          
          <!-- Results Section -->
          <div id="resultsSection" class="results-section hidden">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-label">Total Words</span>
                    <span class="stat-value" id="totalWords">0</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Unique Keywords</span>
                    <span class="stat-value" id="uniqueKeywords">0</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Reading Time</span>
                    <span class="stat-value" id="readingTime">0 min</span>
                </div>
            </div>
            
            <div class="results-layout">
                <!-- Keyword Table -->
                <div class="table-container">
                    <div class="table-header">
                        <h3>Top Keywords</h3>
                        <div class="filter-toggles">
                            <button class="filter-btn active" data-filter="1">1 Word</button>
                            <button class="filter-btn" data-filter="2">2 Phrases</button>
                            <button class="filter-btn" data-filter="3">3 Phrases</button>
                        </div>
                    </div>
                    
                    <div class="keywords-list" id="keywordsList">
                        <!-- Items populated by JS -->
                    </div>
                </div>
                
                <!-- Density Chart / Info -->
                <div class="info-sidebar">
                    <div class="info-box">
                        <h4>💡 SEO Tip</h4>
                        <p>Aim for a keyword density of <strong>1-2%</strong> for your focus keyword. Anything above 3% might be flagged as "keyword stuffing" by search engines.</p>
                    </div>
                    <div class="info-box warning hidden" id="stuffingWarning">
                        <h4>⚠️ Potential Stuffing</h4>
                        <p>Some keywords have unusually high density (>4%). Consider using synonyms.</p>
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
    const textTab = document.getElementById('textTab');
    const urlTab = document.getElementById('urlTab');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const inputText = document.getElementById('inputText');
    const inputUrl = document.getElementById('inputUrl');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsSection = document.getElementById('resultsSection');
    const keywordsList = document.getElementById('keywordsList');
    const stuffingWarning = document.getElementById('stuffingWarning');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let currentPhrases = { 1: [], 2: [], 3: [] };
    let currentFilter = 1;

    // Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tab = btn.dataset.tab;
            if (tab === 'text') {
                textTab.classList.remove('hidden');
                textTab.classList.add('active');
                urlTab.classList.add('hidden');
                urlTab.classList.remove('active');
            } else {
                urlTab.classList.remove('hidden');
                urlTab.classList.add('active');
                textTab.classList.add('hidden');
                textTab.classList.remove('active');
            }
        });
    });

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = parseInt(btn.dataset.filter);
            renderKeywords(currentPhrases[currentFilter]);
        });
    });

    // Analyze
    analyzeBtn.addEventListener('click', async () => {
        const isUrlMode = !urlTab.classList.contains('hidden');
        let text = '';

        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analyzing...';

        try {
            if (isUrlMode) {
                const url = inputUrl.value.trim();
                if (!url) {
                    showToast('Please enter a URL', 'error');
                    return;
                }
                text = await fetchUrlContent(url);
            } else {
                text = inputText.value.trim();
                if (!text) {
                    showToast('Please paste text to analyze', 'error');
                    return;
                }
            }

            analyzeContent(text);
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            showToast(error.message || 'Failed to analyze content', 'error');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Analyze Keywords';
        }
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        inputUrl.value = '';
        resultsSection.classList.add('hidden');
    });

    async function fetchUrlContent(url) {
        try {
            // Using Vercel Proxy
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
            const res = await fetch(proxyUrl);
            if (!res.ok) throw new Error('Could not fetch URL. Ensure it is publicly accessible.');
            const html = await res.text();

            // Extract text from HTML
            const doc = new DOMParser().parseFromString(html, 'text/html');

            // remove script/style
            ['script', 'style', 'noscript', 'iframe'].forEach(tag => {
                const els = doc.querySelectorAll(tag);
                els.forEach(el => el.remove());
            });

            return doc.body.textContent || '';
        } catch (e) {
            // Fallback for local dev if proxy missing
            console.error(e);
            throw new Error('Proxy unavailable. Please use "Paste Text" mode locally.');
        }
    }

    function analyzeContent(text) {
        // Normalize text
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const words = cleanText.toLowerCase().replace(/[^\w\s]/g, '').split(' ').filter(w => w.length > 1);

        // Stats
        const totalWords = words.length;
        const readingTime = Math.ceil(totalWords / 200); // 200 wpm

        document.getElementById('totalWords').textContent = totalWords;
        document.getElementById('readingTime').textContent = `${readingTime} min`;

        // 1-Word Frequency
        const freq1 = {};
        words.forEach(word => {
            if (!STOP_WORDS.has(word) && isNaN(word)) { // Skip stop words and numbers
                freq1[word] = (freq1[word] || 0) + 1;
            }
        });

        // 2-Word Phrases
        const freq2 = {};
        for (let i = 0; i < words.length - 1; i++) {
            const phrase = `${words[i]} ${words[i + 1]}`;
            // Simple check: don't count if both are stop words
            if (!STOP_WORDS.has(words[i]) || !STOP_WORDS.has(words[i + 1])) {
                freq2[phrase] = (freq2[phrase] || 0) + 1;
            }
        }

        // 3-Word Phrases
        const freq3 = {};
        for (let i = 0; i < words.length - 2; i++) {
            const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
            freq3[phrase] = (freq3[phrase] || 0) + 1;
        }

        // Sort and Store
        currentPhrases[1] = sortPhrases(freq1, totalWords);
        currentPhrases[2] = sortPhrases(freq2, totalWords); // Note: Density calc for phrases is relative to total words or phrases? Usually total words is fine denominator for SEO.
        currentPhrases[3] = sortPhrases(freq3, totalWords);

        document.getElementById('uniqueKeywords').textContent = currentPhrases[1].length;

        // Render Initial (1-Word)
        renderKeywords(currentPhrases[1]);

        // Active Filter Reset
        filterBtns.forEach(b => b.classList.remove('active'));
        filterBtns[0].classList.add('active');
        currentFilter = 1;
    }

    function sortPhrases(freqMap, total) {
        return Object.entries(freqMap)
            .map(([word, count]) => ({
                word,
                count,
                density: ((count / total) * 100).toFixed(2)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 50); // Top 50
    }

    function renderKeywords(list) {
        keywordsList.innerHTML = '';
        let stuffingDetected = false;

        if (list.length === 0) {
            keywordsList.innerHTML = '<div class="empty-state">No keywords found. Requires more text.</div>';
            return;
        }

        // Header
        const header = document.createElement('div');
        header.className = 'keyword-item header-row';
        header.innerHTML = `
            <span>Keyword</span>
            <span>Count</span>
            <span>Density</span>
            <span>Status</span>
        `;
        keywordsList.appendChild(header);

        list.forEach(item => {
            const row = document.createElement('div');
            row.className = 'keyword-item';

            // Status Logic
            let status = 'Normal';
            let statusClass = 'neutral';
            const density = parseFloat(item.density);

            if (density > 4.5 && currentFilter === 1) { // Only flag single words heavily
                status = 'Overused';
                statusClass = 'danger';
                stuffingDetected = true;
            } else if (density > 2.5) {
                status = 'High';
                statusClass = 'warning';
            } else if (density > 0.5) {
                status = 'Good';
                statusClass = 'success';
            }

            row.innerHTML = `
                <span class="kw-word">${item.word}</span>
                <span class="kw-count">${item.count}</span>
                <span class="kw-density">${item.density}%</span>
                <span class="kw-status status-${statusClass}">${status}</span>
            `;
            keywordsList.appendChild(row);
        });

        if (stuffingDetected) {
            stuffingWarning.classList.remove('hidden');
        } else {
            stuffingWarning.classList.add('hidden');
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
.input-large {
    min-height: 200px;
    font-size: 1rem;
    padding: 1rem;
}

.url-input-group {
    display: flex;
    gap: 0.5rem;
}

.action-row {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    text-align: center;
    border: 1px solid var(--glass-border);
}

.stat-label {
    display: block;
    font-size: 0.875rem;
    color: var(--text-tertiary);
    margin-bottom: 0.5rem;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-light);
}

.results-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

.table-container {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
    overflow: hidden;
}

.table-header {
    background: var(--bg-tertiary);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--glass-border);
}

.filter-toggles {
    display: flex;
    gap: 0.5rem;
}

.filter-btn {
    background: transparent;
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.filter-btn.active, .filter-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.keywords-list {
    max-height: 500px;
    overflow-y: auto;
}

.keyword-item {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.9rem;
    align-items: center;
}

.header-row {
    font-weight: 600;
    color: var(--text-tertiary);
    background: rgba(0,0,0,0.2);
}

.kw-word {
    font-weight: 500;
    color: var(--text-secondary);
}

.kw-count, .kw-density {
    text-align: center;
}

.kw-status {
    text-align: center;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.75rem;
}

.status-success { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.status-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.status-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; }
.status-neutral { color: var(--text-tertiary); }

.info-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.info-box {
    background: var(--bg-tertiary);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border-left: 3px solid var(--accent);
}

.info-box.warning {
    border-left-color: var(--error);
    background: rgba(239, 68, 68, 0.1);
}

.info-box h4 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.tab-btn {
    padding: 0.75rem 1.5rem;
    margin-right: 0.5rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-tertiary);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-base);
}

.tab-btn.active {
    color: var(--primary-light);
    border-bottom-color: var(--primary);
}

.tabs {
    border-bottom: 1px solid var(--glass-border);
    margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
    .results-layout {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
