/**
 * Open Graph Generator Tool
 * Creates social media meta tags with live previews
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
            <div class="tool-icon-large">📱</div>
            <h1>Open Graph Generator</h1>
            <p class="tool-description">
              Control how your content looks on Facebook, Twitter, LinkedIn, and more.
              Generate perfect social media meta tags in seconds.
            </p>
          </div>
        </div>
      </section>
      
      ${createAdUnit('banner')}
      
      <section class="tool-content section">
        <div class="container container-lg">
          <div class="tool-grid">
            
            <!-- Left: Inputs -->
            <div class="input-column">
                <div class="input-card">
                    <h3>Content Details</h3>
                    
                    <div class="input-group">
                        <label for="ogTitle" class="label">Title</label>
                        <input type="text" id="ogTitle" class="input" placeholder="e.g., The Ultimate Guide to SEO" maxlength="95" />
                        <small class="char-count"><span id="titleCount">0</span>/95 chars</small>
                    </div>
                    
                    <div class="input-group">
                        <label for="ogSiteName" class="label">Site Name</label>
                        <input type="text" id="ogSiteName" class="input" placeholder="e.g., SEO Tools Suite" />
                    </div>
                    
                    <div class="input-group">
                        <label for="ogUrl" class="label">Page URL</label>
                        <input type="url" id="ogUrl" class="input" placeholder="https://example.com/guide" />
                    </div>
                    
                    <div class="input-group">
                        <label for="ogDesc" class="label">Description</label>
                        <textarea id="ogDesc" class="textarea" rows="3" placeholder="A brief summary of your content..." maxlength="300"></textarea>
                        <small class="char-count"><span id="descCount">0</span>/300 chars</small>
                    </div>
                </div>
                
                <div class="input-card">
                    <h3>Image</h3>
                    <div class="tabs-sm">
                        <button class="tab-sm active" data-img-mode="url">Image URL</button>
                        <button class="tab-sm" data-img-mode="upload">Upload (Preview)</button>
                    </div>
                    
                    <div id="imgUrlMode">
                        <input type="url" id="ogImage" class="input" placeholder="https://example.com/image.jpg" />
                        <small>Use an absolute URL (https://...) for social media.</small>
                    </div>
                    
                    <div id="imgUploadMode" class="hidden">
                        <div class="upload-area-sm" id="dropZone">
                            <span class="upload-icon">📷</span>
                            <span>Click to upload image</span>
                            <input type="file" id="fileInput" accept="image/*" hidden />
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right: Preview -->
            <div class="preview-column">
                <div class="preview-card">
                    <div class="preview-tabs">
                        <button class="p-tab active" data-platform="facebook">Facebook</button>
                        <button class="p-tab" data-platform="twitter">Twitter</button>
                        <button class="p-tab" data-platform="linkedin">LinkedIn</button>
                    </div>
                    
                    <div class="preview-viewport">
                        <!-- Facebook Preview -->
                        <div id="fbPreview" class="social-card fb-card">
                            <div class="card-image">
                                <img src="" id="fbImg" class="preview-img" alt="" />
                                <div class="placeholder-img" id="fbPlaceholder">1200 x 630</div>
                            </div>
                            <div class="card-content">
                                <div class="fb-host" id="fbUrl">EXAMPLESITE.COM</div>
                                <div class="fb-title" id="fbTitle">Your Title Here</div>
                                <div class="fb-desc" id="fbDesc">Your description will appear here...</div>
                            </div>
                        </div>
                        
                        <!-- Twitter Preview -->
                        <div id="twPreview" class="social-card tw-card hidden">
                            <div class="card-image tw-image">
                                <img src="" id="twImg" class="preview-img" alt="" />
                                <div class="placeholder-img" id="twPlaceholder">1200 x 600</div>
                            </div>
                            <div class="tw-content">
                                <div class="tw-title" id="twTitle">Your Title Here</div>
                                <div class="tw-desc" id="twDesc">Your description will appear here...</div>
                                <div class="tw-host" id="twUrl">examplesite.com</div>
                            </div>
                        </div>
                        
                        <!-- LinkedIn Preview -->
                        <div id="liPreview" class="social-card li-card hidden">
                            <div class="card-image">
                                <img src="" id="liImg" class="preview-img" alt="" />
                                <div class="placeholder-img" id="liPlaceholder">1200 x 627</div>
                            </div>
                            <div class="li-content">
                                <div class="li-title" id="liTitle">Your Title Here</div>
                                <div class="li-host" id="liUrl">examplesite.com</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="code-output">
                    <h3>Generated Meta Tags</h3>
                    <div class="code-block">
                        <code id="outputCode">&lt;!-- Open Graph / Facebook --&gt;
&lt;meta property="og:type" content="website"&gt;...</code>
                        <button id="copyBtn" class="btn btn-sm btn-secondary copy-btn">Copy</button>
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
    // Inputs
    const ogTitle = document.getElementById('ogTitle');
    const ogSiteName = document.getElementById('ogSiteName');
    const ogUrl = document.getElementById('ogUrl');
    const ogDesc = document.getElementById('ogDesc');
    const ogImage = document.getElementById('ogImage');

    // Image Handling
    const imgUrlModeBtn = document.querySelector('[data-img-mode="url"]');
    const imgUploadModeBtn = document.querySelector('[data-img-mode="upload"]');
    const imgUrlDiv = document.getElementById('imgUrlMode');
    const imgUploadDiv = document.getElementById('imgUploadMode');
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');

    // Previews
    const previewImgs = document.querySelectorAll('.preview-img');
    const placeholders = document.querySelectorAll('.placeholder-img');

    // Output
    const outputCode = document.getElementById('outputCode');
    const copyBtn = document.getElementById('copyBtn');

    // State
    let currentImageSrc = '';

    // Image Tab Toggle
    imgUrlModeBtn.addEventListener('click', () => {
        imgUrlModeBtn.classList.add('active');
        imgUploadModeBtn.classList.remove('active');
        imgUrlDiv.classList.remove('hidden');
        imgUploadDiv.classList.add('hidden');
        updatePreviews(); // Re-use URL input
    });

    imgUploadModeBtn.addEventListener('click', () => {
        imgUploadModeBtn.classList.add('active');
        imgUrlModeBtn.classList.remove('active');
        imgUploadDiv.classList.remove('hidden');
        imgUrlDiv.classList.add('hidden');
    });

    // File Upload
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentImageSrc = e.target.result;
                updatePreviews();
            };
            reader.readAsDataURL(file);
        }
    }

    // Input Listeners
    [ogTitle, ogSiteName, ogUrl, ogDesc, ogImage].forEach(el => {
        el.addEventListener('input', updatePreviews);
    });

    // Preview Tabs
    const platformTabs = document.querySelectorAll('.p-tab');
    platformTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            platformTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Hide all cards
            document.querySelectorAll('.social-card').forEach(c => c.classList.add('hidden'));

            // Show target
            const target = btn.dataset.platform;
            if (target === 'facebook') document.getElementById('fbPreview').classList.remove('hidden');
            if (target === 'twitter') document.getElementById('twPreview').classList.remove('hidden');
            if (target === 'linkedin') document.getElementById('liPreview').classList.remove('hidden');
        });
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputCode.textContent).then(() => {
            showToast('Code copied!', 'success');
        });
    });

    function updatePreviews() {
        const title = ogTitle.value || 'Your Title Here';
        const desc = ogDesc.value || 'Your description will appear here...';
        let urlRaw = ogUrl.value.trim();

        if (urlRaw) {
            const normalized = formatURL(urlRaw);
            if (normalized) urlRaw = normalized;
        }

        if (!urlRaw) urlRaw = 'example.com';

        const siteName = ogSiteName.value || 'Site Name';

        // Clean URL for display
        let urlDisplay = urlRaw.replace(/^https?:\/\//, '').replace(/\/$/, '');
        if (urlDisplay.length > 30) urlDisplay = urlDisplay.substring(0, 30) + '...';

        // Image Logic
        let imgSrc = '';
        if (!imgUploadDiv.classList.contains('hidden') && currentImageSrc) {
            imgSrc = currentImageSrc;
        } else {
            imgSrc = ogImage.value;
        }

        // Update Images
        previewImgs.forEach(img => {
            if (imgSrc) {
                img.src = imgSrc;
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        });

        placeholders.forEach(ph => {
            ph.style.display = imgSrc ? 'none' : 'flex';
        });

        // 1. Facebook
        document.getElementById('fbTitle').textContent = title;
        document.getElementById('fbDesc').textContent = desc;
        document.getElementById('fbUrl').textContent = urlDisplay.toUpperCase();

        // 2. Twitter
        document.getElementById('twTitle').textContent = title;
        document.getElementById('twDesc').textContent = desc;
        document.getElementById('twUrl').textContent = urlDisplay.toLowerCase();

        // 3. LinkedIn
        document.getElementById('liTitle').textContent = title;
        document.getElementById('liUrl').textContent = urlDisplay.toLowerCase();

        // Update Code
        const finalImgUrl = imgSrc.startsWith('data:') ? 'https://example.com/image.jpg' : (imgSrc || 'https://example.com/image.jpg');

        const code = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${urlRaw}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${finalImgUrl}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${urlRaw}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
<meta property="twitter:image" content="${finalImgUrl}">`;

        outputCode.textContent = code;

        // Counters
        document.getElementById('titleCount').textContent = ogTitle.value.length;
        document.getElementById('descCount').textContent = ogDesc.value.length;
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

.tabs-sm {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.tab-sm {
    background: transparent;
    border: 1px solid var(--glass-border);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    color: var(--text-secondary);
    font-size: 0.8rem;
    cursor: pointer;
}

.tab-sm.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.upload-area-sm {
    border: 2px dashed var(--glass-border);
    padding: 1.5rem;
    text-align: center;
    border-radius: var(--radius-sm);
    cursor: pointer;
    background: var(--bg-tertiary);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: var(--text-tertiary);
}

.upload-area-sm:hover {
    border-color: var(--primary);
    color: var(--primary-light);
}

/* Preview Section */
.preview-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.preview-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
    overflow: hidden;
}

.preview-tabs {
    display: flex;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--glass-border);
}

.p-tab {
    flex: 1;
    background: transparent;
    border: none;
    padding: 1rem;
    color: var(--text-secondary);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-fast);
}

.p-tab:hover {
    color: var(--text-primary);
    background: rgba(255,255,255,0.05);
}

.p-tab.active {
    color: var(--primary-light);
    border-bottom: 2px solid var(--primary);
    background: var(--bg-secondary);
}

.preview-viewport {
    padding: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    background: #f0f2f5; /* Neutral social media bg */
}

/* Social Cards */
.social-card {
    background: white;
    width: 100%;
    max-width: 500px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    font-family: Helvetica, Arial, sans-serif;
}

.card-image {
    width: 100%;
    position: relative;
    background: #e1e3e8;
    aspect-ratio: 1.91 / 1; /* 1200x630 */
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: none;
}

.placeholder-img {
    color: #888;
    font-size: 1.5rem;
    font-weight: bold;
}

/* Facebook */
.fb-card {
    border: 1px solid #dddfe2;
    border-radius: 0; /* FB has no radius on timeline images usually, or small */
}

.card-content {
    padding: 10px 12px;
    background: #f0f2f5;
    border-top: 1px solid rgba(0,0,0,0.1);
}

.fb-host {
    color: #65676b;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 3px;
}

.fb-title {
    color: #050505;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 3px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.fb-desc {
    color: #65676b;
    font-size: 13px;
    line-height: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Twitter */
.tw-card {
    border-radius: 16px;
    border: 1px solid #cfd9de;
}

.tw-image {
    aspect-ratio: 2 / 1;
}

.tw-content {
    padding: 12px;
    background: white;
    border-top: 1px solid #cfd9de;
}

.tw-title {
    color: #0f1419;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 2px;
}

.tw-desc {
    color: #536471;
    font-size: 14px;
    margin-bottom: 4px;
}

.tw-host {
    color: #536471;
    font-size: 14px;
    display: flex;
    align-items: center;
}
.tw-host::before {
    content: '🔗';
    margin-right: 4px;
    font-size: 12px;
}

/* LinkedIn */
.li-card {
    border-radius: 8px; /* New LinkedIn look */
    border: 1px solid #e0e0e0;
}

.li-content {
    padding: 8px 12px;
    background: white;
    border-top: 1px solid #e0e0e0;
}

.li-title {
    color: #000000;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 2px;
}

.li-host {
    color: #666666;
    font-size: 12px;
    line-height: 16px;
}

/* Code Output */
.code-output {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: 1.5rem;
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

@media (max-width: 768px) {
    .tool-grid {
        grid-template-columns: 1fr;
    }
}
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
