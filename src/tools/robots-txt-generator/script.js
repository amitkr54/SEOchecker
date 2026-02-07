/**
 * Robots.txt Generator Tool
 * Creates standardized robots.txt files for SEO control
 */

import '../../styles/main.css';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createAdUnit, adStyles } from '../../components/AdUnit.js';
import { showToast, downloadFile } from '../../utils/common.js';

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
            <div class="tool-icon-large">🤖</div>
            <h1>Robots.txt Generator</h1>
            <p class="tool-description">
              Create the perfect robots.txt file to guide search engines.
              Control crawling, block sensitive directories, and link your sitemap.
            </p>
          </div>
        </div>
      </section>
      
      ${createAdUnit('banner')}
      
      <section class="tool-content section">
        <div class="container container-lg">
          <div class="tool-grid">
            <!-- Left Column: Settings -->
            <div class="settings-column">
              <div class="input-card">
                <h3>Global Settings</h3>
                
                <div class="input-group">
                  <label for="userAgent" class="label">User Agent</label>
                  <select id="userAgent" class="select">
                    <option value="*">All Robots (*)</option>
                    <option value="Googlebot">Googlebot</option>
                    <option value="Bingbot">Bingbot</option>
                    <option value="Yandex">Yandex</option>
                    <option value="Baiduspider">Baidu</option>
                  </select>
                  <small>Who are these rules for? Usually "*" covers everyone.</small>
                </div>
                
                <div class="input-group">
                  <label for="crawlDelay" class="label">Crawl Delay (seconds)</label>
                  <select id="crawlDelay" class="select">
                    <option value="">No Delay (Recommended)</option>
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                    <option value="20">20 seconds</option>
                    <option value="60">60 seconds</option>
                  </select>
                  <small>Only use if your server is slow/overloaded.</small>
                </div>
                
                <div class="input-group">
                  <label for="sitemap" class="label">Sitemap URL</label>
                  <input type="url" id="sitemap" class="input" placeholder="https://example.com/sitemap.xml" />
                </div>
              </div>
              
              <div class="input-card">
                <h3>Directories to Block</h3>
                <div class="input-group">
                    <label class="label">Disallow Paths (One per line)</label>
                    <textarea id="disallow" class="textarea" rows="5" placeholder="/wp-admin/&#10;/private/&#10;/tmp/"></textarea>
                    <p class="helper-text">Add strict blocking rules. Example: <code>/admin/</code> blocks all admin pages.</p>
                </div>
              </div>
              
              <div class="tool-actions">
                <button id="generateBtn" class="btn btn-primary btn-lg">
                  Generate File
                </button>
                <button id="resetBtn" class="btn btn-secondary">
                  Reset
                </button>
              </div>
            </div>
            
            <!-- Right Column: Output -->
            <div class="output-column">
               <div class="preview-card">
                 <div class="preview-header">
                    <h3>Your robots.txt file</h3>
                    <div class="preview-actions">
                        <button id="copyBtn" class="btn btn-sm btn-secondary">Copy</button>
                    </div>
                 </div>
                 <pre id="outputCode" class="code-preview">User-agent: *
Disallow:</pre>
               </div>
               
               <div class="download-section">
                  <button id="downloadBtn" class="btn btn-success btn-lg full-width">
                    📥 Download robots.txt
                  </button>
               </div>
               
               <div class="info-card">
                  <h4>💡 Pro Tip</h4>
                  <p>Upload this file to the root directory of your website (e.g., <code>yourwebsite.com/robots.txt</code>).</p>
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
    initGenerator();
}

function initGenerator() {
    const userAgent = document.getElementById('userAgent');
    const crawlDelay = document.getElementById('crawlDelay');
    const sitemap = document.getElementById('sitemap');
    const disallow = document.getElementById('disallow');
    const outputCode = document.getElementById('outputCode');

    // Buttons
    const generateBtn = document.getElementById('generateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Live update on change
    [userAgent, crawlDelay, sitemap, disallow].forEach(el => {
        el.addEventListener('input', generateRobotsTxt);
    });

    resetBtn.addEventListener('click', () => {
        userAgent.value = '*';
        crawlDelay.value = '';
        sitemap.value = '';
        disallow.value = '';
        generateRobotsTxt();
        showToast('Form reset', 'info');
    });

    generateBtn.addEventListener('click', () => {
        generateRobotsTxt();
        const codeSection = document.querySelector('.output-column');
        codeSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Robots.txt generated!', 'success');
    });

    downloadBtn.addEventListener('click', () => {
        const content = outputCode.textContent;
        downloadFile(content, 'robots.txt', 'text/plain');
        showToast('File downloaded', 'success');
    });

    copyBtn.addEventListener('click', () => {
        const content = outputCode.textContent;
        navigator.clipboard.writeText(content).then(() => {
            showToast('Copied to clipboard', 'success');
        });
    });

    function generateRobotsTxt() {
        let content = '';

        // User Agent
        content += `User-agent: ${userAgent.value}\n`;

        // Crawl Delay
        if (crawlDelay.value) {
            content += `Crawl-delay: ${crawlDelay.value}\n`;
        }

        // Disallow
        const disallowLines = disallow.value.split('\n');
        let hasDisallow = false;

        disallowLines.forEach(line => {
            const path = line.trim();
            if (path) {
                content += `Disallow: ${path.startsWith('/') ? path : '/' + path}\n`;
                hasDisallow = true;
            }
        });

        // If nothing blocked, Explicit Allow or Empty Disallow?
        // Standard practice: "Disallow:" means allow everything.
        if (!hasDisallow && !crawlDelay.value) {
            content += `Disallow:\n`;
        }

        // Sitemap
        if (sitemap.value.trim()) {
            content += `\nSitemap: ${sitemap.value.trim()}`;
        }

        outputCode.textContent = content;
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
.tool-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 2rem;
}

.input-card {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
    margin-bottom: 2rem;
}

.input-card h3 {
    margin-bottom: 1.5rem;
    color: var(--primary-light);
    font-size: 1.25rem;
}

.preview-card {
    background: #1e1e1e; /* Code background */
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow-lg);
}

.preview-header {
    background: #2d2d2d;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #3d3d3d;
}

.preview-header h3 {
    margin: 0;
    font-size: 0.875rem;
    color: #e0e0e0;
    font-family: monospace;
}

.code-preview {
    padding: 1.5rem;
    margin: 0;
    color: #d4d4d4;
    font-family: 'Consolas', 'Monaco', monospace;
    white-space: pre-wrap;
    min-height: 200px;
    font-size: 0.9rem;
    line-height: 1.5;
}

.helper-text {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-top: 0.5rem;
}

.helper-text code {
    background: rgba(255,255,255,0.1);
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
}

.full-width {
    width: 100%;
}

.info-card {
    background: var(--bg-tertiary);
    padding: 1rem;
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--accent);
}

.info-card h4 {
    margin-bottom: 0.5rem;
    color: var(--accent);
}

.info-card p {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

@media (max-width: 768px) {
    .tool-grid {
        grid-template-columns: 1fr;
    }
    
    .output-column {
        order: -1; /* Show preview on top on mobile? No, let's keep input first */
        order: 1;
    }
}
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
