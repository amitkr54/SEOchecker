/**
 * Favicon Generator Tool
 * Generates favicons for all platforms from a single image
 */

import '../../styles/main.css';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createAdUnit, adStyles } from '../../components/AdUnit.js';
import { showToast } from '../../utils/common.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
            <div class="tool-icon-large">🎨</div>
            <h1>Favicon Generator</h1>
            <p class="tool-description">
              Create perfect icons for browsers, iPhone/iPad, Android, and Windows.
              Upload a single image and get a complete icon package.
            </p>
          </div>
        </div>
      </section>
      
      ${createAdUnit('banner')}
      
      <section class="tool-content section">
        <div class="container container-lg">
          <div class="tool-grid">
            <!-- Left Column: Upload -->
            <div class="upload-column">
              <div class="upload-area" id="dropZone">
                <input type="file" id="fileInput" accept="image/png, image/jpeg, image/svg+xml" hidden />
                <div class="upload-content">
                  <div class="upload-icon">📁</div>
                  <h3>Upload Image</h3>
                  <p>Drag & drop or click to upload</p>
                  <small>Recommended: 512x512px PNG</small>
                </div>
                <!-- Preview Canvas -->
                <div id="previewContainer" class="preview-container hidden">
                    <img id="sourcePreview" class="source-preview" alt="Preview" />
                    <button id="removeBtn" class="btn btn-sm btn-secondary remove-btn">Remove</button>
                </div>
              </div>
              
              <div class="tool-actions">
                <button id="generateBtn" class="btn btn-primary btn-lg" disabled>
                  Generate Favicons
                </button>
              </div>
            </div>
            
            <!-- Right Column: Live Previews -->
            <div class="preview-column">
              <h3>Live Previews</h3>
              
              <!-- Browser Tab Preview -->
              <div class="preview-card browser-preview">
                <div class="preview-header">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                  <div class="browser-tab active">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23ccc'%3E%3Crect width='100' height='100' rx='20' /%3E%3C/svg%3E" class="preview-icon tab-icon" alt="" />
                    <span class="tab-title">Your Website</span>
                    <span class="tab-close">×</span>
                  </div>
                </div>
                <div class="browser-content"></div>
              </div>
              <p class="preview-label">Browser Tab (16x16)</p>
              
              <!-- Google Search Preview -->
              <div class="preview-card search-preview">
                <div class="search-result">
                  <div class="search-header">
                    <div class="search-icon-wrapper">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23ccc'%3E%3Crect width='100' height='100' rx='50' /%3E%3C/svg%3E" class="preview-icon search-icon" alt="" />
                    </div>
                    <div class="search-meta">
                      <div class="search-site">Your Site</div>
                      <div class="search-url">https://yoursite.com</div>
                    </div>
                  </div>
                  <div class="search-title">Your Website Title - Best Service</div>
                </div>
              </div>
              <p class="preview-label">Google Search Result (48x48)</p>
              
              <!-- iOS Home Screen -->
              <div class="preview-card ios-preview">
                <div class="ios-screen">
                    <div class="app-icon-wrapper">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23ccc'%3E%3Crect width='100' height='100' rx='22' /%3E%3C/svg%3E" class="preview-icon ios-icon" alt="" />
                    </div>
                    <span class="app-name">App Name</span>
                </div>
              </div>
              <p class="preview-label">iPhone Home Screen (180x180)</p>
            </div>
          </div>
          
          <!-- Results / Code -->
          <div id="resultsSection" class="tool-results-section hidden">
            <div class="download-section">
                <h3>🎉 Your Icons are Ready!</h3>
                <p>Download the package and copy the code below.</p>
                <button id="downloadBtn" class="btn btn-success btn-lg">
                    📥 Download ZIP Package
                </button>
            </div>
            
            <div class="code-section">
                <h3>HTML Code</h3>
                <p>Paste this into the <code>&lt;head&gt;</code> of your website:</p>
                <div class="code-block">
                    <pre><code id="htmlCode">&lt;link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"&gt;
&lt;link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"&gt;
&lt;link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"&gt;
&lt;link rel="manifest" href="/site.webmanifest"&gt;</code></pre>
                    <button id="copyBtn" class="btn btn-sm btn-secondary">Copy</button>
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
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const sourcePreview = document.getElementById('sourcePreview');
    const uploadContent = document.querySelector('.upload-content');
    const removeBtn = document.getElementById('removeBtn');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultsSection = document.getElementById('resultsSection');
    const copyBtn = document.getElementById('copyBtn');

    // Preview elements
    const tabIcon = document.querySelector('.tab-icon');
    const searchIcon = document.querySelector('.search-icon');
    const iosIcon = document.querySelector('.ios-icon');

    let currentFile = null;
    let generatedZip = null;

    // Drag & Drop
    dropZone.addEventListener('click', (e) => {
        if (e.target !== removeBtn) fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetTool();
    });

    generateBtn.addEventListener('click', generateIcons);
    downloadBtn.addEventListener('click', () => {
        if (generatedZip) {
            generatedZip.generateAsync({ type: "blob" }).then(function (content) {
                saveAs(content, "favicons.zip");
            });
        }
    });

    copyBtn.addEventListener('click', () => {
        const code = document.getElementById('htmlCode').textContent;
        navigator.clipboard.writeText(code).then(() => {
            showToast('Code copied to clipboard!', 'success');
        });
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file', 'error');
            return;
        }

        currentFile = file;
        const reader = new FileReader();

        reader.onload = (e) => {
            sourcePreview.src = e.target.result;

            // Update live previews
            tabIcon.src = e.target.result;
            searchIcon.src = e.target.result;
            iosIcon.src = e.target.result;

            // Show preview UI
            uploadContent.classList.add('hidden');
            previewContainer.classList.remove('hidden');
            generateBtn.disabled = false;
        };

        reader.readAsDataURL(file);
    }

    function resetTool() {
        currentFile = null;
        fileInput.value = '';
        uploadContent.classList.remove('hidden');
        previewContainer.classList.add('hidden');
        generateBtn.disabled = true;
        resultsSection.classList.add('hidden');
        generatedZip = null;

        // Reset previews
        const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23ccc'%3E%3Crect width='100' height='100' rx='20' /%3E%3C/svg%3E";
        tabIcon.src = placeholder;
        searchIcon.src = placeholder;
        iosIcon.src = placeholder;
    }

    async function generateIcons() {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Processing...';

        const zip = new JSZip();
        const img = new Image();
        img.src = sourcePreview.src;

        await new Promise(r => img.onload = r);

        // Configuration for icons to generate
        const configs = [
            { name: 'favicon-16x16.png', size: 16 },
            { name: 'favicon-32x32.png', size: 32 },
            { name: 'apple-touch-icon.png', size: 180 },
            { name: 'android-chrome-192x192.png', size: 192 },
            { name: 'android-chrome-512x512.png', size: 512 }
        ];

        // Process each size
        for (const config of configs) {
            const blob = await resizeImage(img, config.size);
            zip.file(config.name, blob);
        }

        // Add site.webmanifest
        const manifest = {
            name: "My Website",
            short_name: "My Website",
            icons: [
                { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
                { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
            ],
            theme_color: "#ffffff",
            background_color: "#ffffff",
            display: "standalone"
        };

        zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

        generatedZip = zip;
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });

        generateBtn.disabled = false;
        generateBtn.textContent = 'Regenerate Icons';
        showToast('Icons generated successfully!', 'success');
    }

    function resizeImage(img, size) {
        return new Promise(resolve => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // High quality resizing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, size, size);

            canvas.toBlob(blob => {
                resolve(blob);
            }, 'image/png');
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
.tool-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.upload-area {
    border: 2px dashed var(--glass-border);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-base);
    position: relative;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.upload-area:hover, .upload-area.drag-over {
    border-color: var(--primary);
    background: var(--bg-tertiary);
}

.upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.preview-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.source-preview {
    max-width: 200px;
    max-height: 200px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
}

.preview-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.preview-card {
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 1rem;
}

/* Browser Preview */
.browser-preview {
    padding: 0;
    overflow: hidden;
}

.preview-header {
    background: #e5e7eb;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid #d1d5db;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
.red { background: #ef4444; }
.yellow { background: #f59e0b; }
.green { background: #10b981; }

.browser-tab {
    background: white;
    padding: 0.25rem 0.75rem;
    border-radius: 6px 6px 0 0;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.5rem;
    color: #374151;
    width: 150px;
}

.browser-content {
    height: 40px;
    background: white;
}

/* Search Preview */
.search-result {
    font-family: Arial, sans-serif;
}

.search-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.25rem;
}

.search-icon-wrapper {
    width: 28px;
    height: 28px;
    background: #f1f3f4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.search-icon {
    width: 20px;
    height: 20px;
}

.search-meta {
    font-size: 0.875rem;
    line-height: 1.3;
}

.search-site {
    color: #202124;
}

.search-url {
    color: #5f6368;
    font-size: 0.75rem;
}

.search-title {
    color: #1a0dab;
    font-size: 1.25rem;
    cursor: pointer;
}

.search-title:hover {
    text-decoration: underline;
}

/* iOS Preview */
.ios-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.app-icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.ios-icon {
    width: 100%;
    height: 100%;
}

.app-name {
    font-size: 0.75rem;
    color: var(--text-primary);
}

.preview-label {
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-tertiary);
    margin-top: -1rem;
}

.download-section {
    text-align: center;
    padding: 2rem;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    margin-bottom: 2rem;
}

.code-block {
    background: #1e1e1e;
    padding: 1.5rem;
    border-radius: var(--radius-md);
    position: relative;
    overflow-x: auto;
}

.code-block pre {
    color: #d4d4d4;
    margin: 0;
}

.code-block button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
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
