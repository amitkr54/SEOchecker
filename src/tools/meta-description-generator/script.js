/**
 * Meta Description Generator Tool
 * Creates optimized meta descriptions with live SERP preview
 */

import '../../styles/main.css';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createAdUnit, adStyles } from '../../components/AdUnit.js';
import { showToast } from '../../utils/common.js';

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
            <div class="tool-icon-large">✍️</div>
            <h1>Meta Description Generator</h1>
            <p class="tool-description">
              Write compelling meta descriptions that increase click-through rates.
              See exactly how your snippet will look in Google search results.
            </p>
          </div>
        </div>
      </section>
      
      ${createAdUnit('banner')}
      
      <section class="tool-content section">
        <div class="container container-lg">
          <div class="tool-grid">
            <!-- Left Column: Inputs -->
            <div class="input-column">
              <div class="input-card">
                <h3>Page Details</h3>
                
                <div class="input-group">
                  <label for="pageTitle" class="label">Page Title</label>
                  <input type="text" id="pageTitle" class="input" placeholder="e.g., Best Pizza Recipe - Easy & Delicious" maxlength="70" />
                  <div class="char-count">
                    <span id="titleCount">0</span>/60 characters (recommended)
                  </div>
                </div>
                
                <div class="input-group">
                  <label for="pageUrl" class="label">Page URL</label>
                  <input type="url" id="pageUrl" class="input" placeholder="https://example.com/pizza-recipe" />
                </div>
                
                <div class="input-group">
                    <label for="focusKeyword" class="label">Focus Keyword (Optional)</label>
                    <input type="text" id="focusKeyword" class="input" placeholder="e.g., pizza recipe" />
                    <small>We'll highlight this in bold if present.</small>
                </div>
              </div>
              
              <div class="input-card">
                <h3>Meta Description</h3>
                <div class="toolbar">
                    <button id="extractBtn" class="btn btn-sm btn-secondary">Extract from Text</button>
                    <button id="aiBtn" class="btn btn-sm btn-secondary" disabled title="Coming Soon">✨ AI Generate</button>
                </div>
                
                <div class="input-group">
                    <textarea id="metaDesc" class="textarea" rows="4" placeholder="Write a summary that encourages users to click..."></textarea>
                    <div class="progress-container">
                        <div id="descProgress" class="progress-bar" style="width: 0%"></div>
                    </div>
                    <div class="counter-row">
                        <span id="descCount">0</span>/160 characters
                        <span id="pixelCount" class="pixel-count">0px width</span>
                    </div>
                    <p id="descStatus" class="status-text">Too short</p>
                </div>
              </div>
            </div>
            
            <!-- Right Column: Preview & Output -->
            <div class="preview-column">
               <h3>Google Search Preview</h3>
               
               <div class="serp-preview-card">
                 <div class="serp-result">
                    <div class="serp-url">
                        <span id="previewUrlSite">example.com</span>
                        <span class="serp-url-path"> › pizza-recipe</span>
                        <span class="dots">⋮</span>
                    </div>
                    <h3 class="serp-title">
                        <a href="#" id="previewTitle" onclick="return false;">Best Pizza Recipe - Easy & Delicious</a>
                    </h3>
                    <div class="serp-desc" id="previewDesc">
                        Write a summary that encourages users to click...
                    </div>
                 </div>
               </div>
               
               <div class="output-card">
                  <h3>Generated Code</h3>
                  <div class="code-block">
                    <code id="outputCode">&lt;meta name="description" content="..."&gt;</code>
                    <button id="copyBtn" class="btn btn-sm btn-secondary copy-btn">Copy</button>
                  </div>
               </div>
               
               <div class="tips-card">
                 <h4>💡 Optimization Tips</h4>
                 <ul>
                    <li>Keep it between <strong>120-158 characters</strong>.</li>
                    <li>Include your <strong>focus keyword</strong> naturally.</li>
                    <li>Use an active voice and a <strong>call-to-action</strong>.</li>
                    <li>Make it unique for every page.</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Text Extraction Modal -->
      <div id="extractModal" class="modal hidden">
        <div class="modal-content">
            <h3>Extract from Content</h3>
            <p>Paste your full article text below to auto-generate a summary.</p>
            <textarea id="articleText" class="textarea" rows="10" placeholder="Paste article content here..."></textarea>
            <div class="modal-actions">
                <button id="processExtractBtn" class="btn btn-primary">Generate Summary</button>
                <button id="closeModalBtn" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
      </div>
      
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
    const pageTitle = document.getElementById('pageTitle');
    const pageUrl = document.getElementById('pageUrl');
    const metaDesc = document.getElementById('metaDesc');
    const focusKeyword = document.getElementById('focusKeyword');

    // Preview Elements
    const previewTitle = document.getElementById('previewTitle');
    const previewUrlSite = document.getElementById('previewUrlSite');
    const previewDesc = document.getElementById('previewDesc');

    // Indicators
    const titleCount = document.getElementById('titleCount');
    const descCount = document.getElementById('descCount');
    const descProgress = document.getElementById('descProgress');
    const descStatus = document.getElementById('descStatus');
    const outputCode = document.getElementById('outputCode');

    // Buttons
    const copyBtn = document.getElementById('copyBtn');
    const extractBtn = document.getElementById('extractBtn');
    const extractModal = document.getElementById('extractModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const processExtractBtn = document.getElementById('processExtractBtn');
    const articleText = document.getElementById('articleText');

    // Live Update Listeners
    [pageTitle, pageUrl, metaDesc, focusKeyword].forEach(el => {
        el.addEventListener('input', updatePreview);
    });

    // Initial Update
    updatePreview();

    // Extraction Modal
    extractBtn.addEventListener('click', () => {
        extractModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        extractModal.classList.add('hidden');
    });

    processExtractBtn.addEventListener('click', () => {
        const text = articleText.value.trim();
        if (text) {
            // Simple extraction: First sentence or first 155 chars
            let summary = text.substring(0, 155);
            // Try to cut at last space to avoid cutting words
            const lastSpace = summary.lastIndexOf(' ');
            if (lastSpace > 0) summary = summary.substring(0, lastSpace);

            // If first sentence ends before 155, take it
            const firstSentence = text.split(/[.!?]/)[0];
            if (firstSentence.length > 50 && firstSentence.length < 155) {
                summary = firstSentence + '.';
            } else {
                summary += '...';
            }

            metaDesc.value = summary;
            updatePreview();
            extractModal.classList.add('hidden');
            showToast('Description extracted!', 'success');
        }
    });

    copyBtn.addEventListener('click', () => {
        const code = outputCode.textContent;
        navigator.clipboard.writeText(code).then(() => {
            showToast('Copied to clipboard!', 'success');
        });
    });

    function updatePreview() {
        // 1. Update Title
        const title = pageTitle.value || 'Best Pizza Recipe - Easy & Delicious';
        previewTitle.textContent = title.length > 60 ? title.substring(0, 57) + '...' : title;
        titleCount.textContent = title.length;
        titleCount.style.color = title.length > 60 ? 'var(--error)' : 'var(--text-secondary)';

        // 2. Update URL
        let url = pageUrl.value || 'example.com/pizza-recipe';
        try {
            url = url.replace(/^https?:\/\//, '');
            const parts = url.split('/');
            previewUrlSite.textContent = parts[0];
            // Format breadcrumb path
            const path = parts.slice(1).join(' › ');
            document.querySelector('.serp-url-path').textContent = path ? ' › ' + path : '';
        } catch (e) {
            previewUrlSite.textContent = url;
        }

        // 3. Update Description
        const desc = metaDesc.value || 'Write a summary that encourages users to click...';
        const keyword = focusKeyword.value.trim();

        // Highlight keyword logic
        let formattedDesc = desc;
        if (keyword) {
            const regex = new RegExp(`(${keyword})`, 'gi');
            formattedDesc = desc.replace(regex, '<strong>$1</strong>');
        }

        // Truncate logic for preview (Google cuts around 160 chars or 920px)
        if (desc.length > 160) {
            // Visual cutoff in preview only
            const visiblePart = desc.substring(0, 158);
            previewDesc.innerHTML = visiblePart + '...';
            if (keyword) { // Re-apply highlight to truncated text carefully
                // Simple re-apply (might break tags, but fine for simple preview)
                const regex = new RegExp(`(${keyword})`, 'gi');
                previewDesc.innerHTML = previewDesc.innerHTML.replace(regex, '<strong>$1</strong>');
            }
        } else {
            previewDesc.innerHTML = formattedDesc;
        }

        // 4. Update Indicators
        const len = desc.length;
        descCount.textContent = len;

        // Status & Progress Bar
        let status = 'Too short';
        let color = 'var(--error)';
        let width = Math.min((len / 160) * 100, 100);

        if (len === 0) {
            status = 'Empty';
            width = 0;
        } else if (len < 120) {
            status = 'Too short (under 120)';
            color = 'var(--warning)';
        } else if (len >= 120 && len <= 158) {
            status = 'Perfect length';
            color = 'var(--accent)';
        } else {
            status = 'Too long (will be truncated)';
            color = 'var(--error)';
            width = 100; // Full red bar
        }

        descStatus.textContent = status;
        descStatus.style.color = color;
        descProgress.style.width = width + '%';
        descProgress.style.backgroundColor = color;

        // 5. Update Output Code
        outputCode.textContent = `<meta name="description" content="${desc.replace(/"/g, '&quot;')}" />`;
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
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.input-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.input-card {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
}

.input-card h3 {
    margin-bottom: 1rem;
    color: var(--primary-light);
    font-size: 1.1rem;
    border-bottom: 1px solid var(--glass-border);
    padding-bottom: 0.5rem;
}

.toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.progress-container {
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    margin-top: 5px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    transition: width 0.3s ease, background-color 0.3s ease;
}

.counter-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-top: 0.5rem;
}

.status-text {
    font-size: 0.8rem;
    font-weight: 500;
    margin-top: 0.25rem;
    text-align: right;
}

/* SERP Preview */
.preview-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.serp-preview-card {
    background: #fff; /* Google white background */
    padding: 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    color: #4d5156; /* Google text color */
}

/* Google Styles Imitation */
.serp-result {
    font-family: Arial, sans-serif;
    max-width: 600px;
}

.serp-url {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #202124;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 5px;
}

.serp-url-path {
    color: #5f6368;
}

.dots {
    margin-left: auto;
    color: #5f6368;
    font-size: 1.1rem;
}

.serp-title {
    margin: 0 0 3px 0;
    font-size: 1.25rem;
    line-height: 1.3;
    font-weight: 400;
}

.serp-title a {
    text-decoration: none;
    color: #1a0dab; /* Google Link Blue */
}

.serp-title a:hover {
    text-decoration: underline;
}

.serp-desc {
    font-size: 0.875rem;
    line-height: 1.58;
    color: #4d5156;
    word-wrap: break-word;
}

.serp-desc strong {
    font-weight: bold;
    color: #4d5156; /* Bold keywords are same color but bold */
}

/* Output Code */
.output-card {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
}

.code-block {
    background: #1e1e1e;
    padding: 1rem;
    border-radius: var(--radius-sm);
    position: relative;
    overflow-x: auto;
    font-family: monospace;
    color: #d4d4d4;
    font-size: 0.85rem;
    margin-top: 0.5rem;
}

.copy-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}

/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(5px);
}

.modal.hidden {
    display: none;
}

.modal-content {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 600px;
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-xl);
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

@media (max-width: 768px) {
    .tool-grid {
        grid-template-columns: 1fr;
    }
}
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
