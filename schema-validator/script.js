/**
 * Schema Markup Validator
 * Validates JSON-LD structured data
 */

import '../src/styles/main.css';
import { createHeader, initHeader, headerStyles } from '../src/components/Header.js';
import { createFooter, footerStyles } from '../src/components/Footer.js';
import { createAdUnit, adStyles } from '../src/components/AdUnit.js';
import { copyToClipboard, showToast, escapeHTML } from '../src/utils/common.js';

// Common Schema.org types and their required properties
const SCHEMA_TYPES = {
  'Organization': ['name', 'url'],
  'Person': ['name'],
  'Product': ['name'],
  'Article': ['headline', 'author', 'datePublished'],
  'BlogPosting': ['headline', 'author', 'datePublished'],
  'NewsArticle': ['headline', 'author', 'datePublished'],
  'Recipe': ['name', 'recipeIngredient', 'recipeInstructions'],
  'Event': ['name', 'startDate', 'location'],
  'LocalBusiness': ['name', 'address'],
  'Review': ['reviewRating', 'itemReviewed'],
  'FAQPage': ['mainEntity'],
  'BreadcrumbList': ['itemListElement'],
  'VideoObject': ['name', 'description', 'thumbnailUrl', 'uploadDate'],
  'ImageObject': ['contentUrl'],
  'WebSite': ['name', 'url'],
  'WebPage': ['name']
};

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
            <div class="tool-icon-large">📋</div>
            <h1>Schema Markup Validator</h1>
            <p class="tool-description">
              Validate your JSON-LD structured data for errors and ensure search engines 
              can properly understand your content. Supports all Schema.org types.
            </p>
          </div>
        </div>
      </section>
      
      ${createAdUnit('banner')}
      
      <section class="tool-content section">
        <div class="container container-lg">
          <div class="tool-layout">
            <!-- Input Section -->
            <div class="tool-input-section">
              <h2>Paste Your Schema Markup</h2>
              <p>Enter your JSON-LD structured data below:</p>
              
              <div class="input-group">
                <textarea 
                  id="schemaInput" 
                  class="textarea code-input" 
                  placeholder='Paste your JSON-LD code here, e.g.:
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Company",
  "url": "https://example.com"
}'
                  rows="15"
                ></textarea>
              </div>
              
              <div class="tool-actions">
                <button id="validateBtn" class="btn btn-primary btn-lg">
                  Validate Schema
                </button>
                <button id="clearBtn" class="btn btn-secondary">
                  Clear
                </button>
                <button id="sampleBtn" class="btn btn-secondary">
                  Load Sample
                </button>
              </div>
            </div>
            
            <!-- Results Section -->
            <div id="resultsSection" class="tool-results-section hidden">
              <h2>Validation Results</h2>
              <div id="validationResults"></div>
            </div>
          </div>
        </div>
      </section>
      
      ${createAdUnit('rectangle')}
      
      <!-- Info Section -->
      <section class="info-section section">
        <div class="container container-md">
          <div class="card-solid">
            <h2>What is Schema Markup?</h2>
            <p>
              Schema markup (also known as structured data) is code that helps search engines 
              understand your content better. It can enhance your search results with rich snippets, 
              knowledge panels, and other features that make your listing more attractive to users.
            </p>
            <h3>Common Schema Types:</h3>
            <ul class="info-list">
              <li><strong>Organization:</strong> Company or organization information</li>
              <li><strong>Article/BlogPosting:</strong> Blog posts and articles</li>
              <li><strong>Product:</strong> Product details for e-commerce</li>
              <li><strong>Recipe:</strong> Cooking recipes with ingredients and instructions</li>
              <li><strong>Event:</strong> Upcoming events and activities</li>
              <li><strong>LocalBusiness:</strong> Local business information</li>
              <li><strong>FAQPage:</strong> Frequently asked questions</li>
              <li><strong>BreadcrumbList:</strong> Navigation breadcrumbs</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
    
    ${createFooter()}
  `;

  // Initialize header functionality
  initHeader();

  // Initialize validator
  initValidator();
}

// Validator functionality
function initValidator() {
  const input = document.getElementById('schemaInput');
  const validateBtn = document.getElementById('validateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const sampleBtn = document.getElementById('sampleBtn');
  const resultsSection = document.getElementById('resultsSection');
  const results = document.getElementById('validationResults');

  validateBtn.addEventListener('click', () => validateSchema());
  clearBtn.addEventListener('click', () => clearInput());
  sampleBtn.addEventListener('click', () => loadSample());

  function validateSchema() {
    const schemaText = input.value.trim();

    if (!schemaText) {
      showToast('Please enter schema markup to validate', 'warning');
      return;
    }

    resultsSection.classList.remove('hidden');
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Validate JSON syntax
    let schemaObj;
    try {
      schemaObj = JSON.parse(schemaText);
    } catch (error) {
      displayError('Invalid JSON', error.message, getLineNumber(schemaText, error));
      return;
    }

    // Validate schema structure
    const validation = validateSchemaStructure(schemaObj);

    if (validation.isValid) {
      displaySuccess(schemaObj, validation);
    } else {
      displayWarnings(schemaObj, validation);
    }
  }

  function validateSchemaStructure(schema) {
    const errors = [];
    const warnings = [];
    const info = [];

    // Check for @context
    if (!schema['@context']) {
      errors.push('@context is missing. Should be "https://schema.org"');
    } else if (!schema['@context'].includes('schema.org')) {
      warnings.push('@context should reference schema.org');
    }

    // Check for @type
    if (!schema['@type']) {
      errors.push('@type is missing. Specify the schema type (e.g., "Organization", "Article")');
    } else {
      const type = schema['@type'];
      info.push(`Schema type: ${type}`);

      // Check required properties for known types
      if (SCHEMA_TYPES[type]) {
        const required = SCHEMA_TYPES[type];
        const missing = required.filter(prop => !schema[prop]);

        if (missing.length > 0) {
          warnings.push(`Missing recommended properties for ${type}: ${missing.join(', ')}`);
        }
      }
    }

    // Check for common best practices
    if (schema['@type'] === 'Organization' || schema['@type'] === 'LocalBusiness') {
      if (!schema.logo) warnings.push('Consider adding a logo for better rich results');
      if (!schema.sameAs) warnings.push('Consider adding social media profiles (sameAs)');
    }

    if (schema['@type'] === 'Article' || schema['@type'] === 'BlogPosting') {
      if (!schema.image) warnings.push('Consider adding an image for better visibility in search');
      if (!schema.publisher) warnings.push('Consider adding publisher information');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      info
    };
  }

  function displaySuccess(schema, validation) {
    const type = schema['@type'] || 'Unknown';
    const propertyCount = Object.keys(schema).length;

    let html = `
      <div class="validation-result success">
        <div class="result-header">
          <span class="result-icon">✓</span>
          <h3>Valid Schema Markup!</h3>
        </div>
        <div class="result-body">
          <div class="result-stats">
            <div class="stat">
              <span class="stat-label">Type:</span>
              <span class="stat-value">${type}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Properties:</span>
              <span class="stat-value">${propertyCount}</span>
            </div>
          </div>
          
          ${validation.info.length > 0 ? `
            <div class="alert alert-info">
              <strong>Information:</strong>
              <ul>
                ${validation.info.map(msg => `<li>${escapeHTML(msg)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${validation.warnings.length > 0 ? `
            <div class="alert alert-warning">
              <strong>Recommendations:</strong>
              <ul>
                ${validation.warnings.map(msg => `<li>${escapeHTML(msg)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div class="schema-preview">
            <h4>Structured Data Preview:</h4>
            <pre><code>${escapeHTML(JSON.stringify(schema, null, 2))}</code></pre>
          </div>
          
          <div class="result-actions">
            <button class="btn btn-accent" id="copySchemaBtn">Copy Schema</button>
            <a href="https://search.google.com/test/rich-results" target="_blank" class="btn btn-secondary">
              Test with Google
            </a>
          </div>
        </div>
      </div>
    `;

    results.innerHTML = html;

    document.getElementById('copySchemaBtn').addEventListener('click', () => {
      copyToClipboard(JSON.stringify(schema, null, 2));
    });
  }

  function displayWarnings(schema, validation) {
    let html = `
      <div class="validation-result warning">
        <div class="result-header">
          <span class="result-icon">⚠</span>
          <h3>Schema Has Issues</h3>
        </div>
        <div class="result-body">
          ${validation.errors.length > 0 ? `
            <div class="alert alert-error">
              <strong>Errors:</strong>
              <ul>
                ${validation.errors.map(msg => `<li>${escapeHTML(msg)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${validation.warnings.length > 0 ? `
            <div class="alert alert-warning">
              <strong>Warnings:</strong>
              <ul>
                ${validation.warnings.map(msg => `<li>${escapeHTML(msg)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div class="help-section">
            <h4>How to Fix:</h4>
            <ol>
              <li>Ensure your schema has "@context": "https://schema.org"</li>
              <li>Add a "@type" property specifying the schema type</li>
              <li>Include all required properties for your schema type</li>
              <li>Visit <a href="https://schema.org" target="_blank">Schema.org</a> for documentation</li>
            </ol>
          </div>
        </div>
      </div>
    `;

    results.innerHTML = html;
  }

  function displayError(title, message, line = null) {
    let html = `
      <div class="validation-result error">
        <div class="result-header">
          <span class="result-icon">✗</span>
          <h3>${title}</h3>
        </div>
        <div class="result-body">
          <div class="alert alert-error">
            <strong>Error:</strong> ${escapeHTML(message)}
            ${line ? `<br><small>Near line ${line}</small>` : ''}
          </div>
          <div class="help-section">
            <h4>Common JSON Errors:</h4>
            <ul>
              <li>Missing or extra commas</li>
              <li>Unmatched brackets or braces</li>
              <li>Missing quotes around property names</li>
              <li>Trailing commas (not allowed in JSON)</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    results.innerHTML = html;
  }

  function clearInput() {
    input.value = '';
    resultsSection.classList.add('hidden');
  }

  function loadSample() {
    const sample = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Example Company",
      "url": "https://www.example.com",
      "logo": "https://www.example.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-555-5555",
        "contactType": "Customer Service"
      },
      "sameAs": [
        "https://www.facebook.com/example",
        "https://twitter.com/example"
      ]
    };

    input.value = JSON.stringify(sample, null, 2);
    showToast('Sample schema loaded', 'success');
  }

  function getLineNumber(text, error) {
    // Try to extract line number from error message
    const match = error.message.match(/line (\d+)/i);
    return match ? match[1] : null;
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
  
  .tool-layout {
    display: grid;
    gap: 2rem;
  }
  
  .tool-input-section,
  .tool-results-section {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 2rem;
  }
  
  .code-input {
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    min-height: 300px;
  }
  
  .tool-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .validation-result {
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  
  .validation-result.success {
    border: 2px solid var(--accent);
  }
  
  .validation-result.warning {
    border: 2px solid var(--warning);
  }
  
  .validation-result.error {
    border: 2px solid var(--error);
  }
  
  .result-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--glass-border);
  }
  
  .result-icon {
    font-size: 2rem;
  }
  
  .result-header h3 {
    margin: 0;
  }
  
  .result-body {
    padding: 1.5rem;
  }
  
  .result-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .stat {
    background: var(--bg-secondary);
    padding: 1rem;
    border-radius: var(--radius-md);
    text-align: center;
  }
  
  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: var(--text-tertiary);
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-light);
  }
  
  .schema-preview {
    margin: 1.5rem 0;
  }
  
  .schema-preview pre {
    background: var(--bg-primary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 1rem;
    overflow-x: auto;
    max-height: 400px;
  }
  
  .schema-preview code {
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 0.875rem;
    color: var(--accent);
  }
  
  .result-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
  }
  
  .help-section {
    margin-top: 1.5rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
  }
  
  .help-section h4 {
    margin-bottom: 1rem;
    color: var(--text-primary);
  }
  
  .help-section ul,
  .help-section ol {
    margin-left: 1.5rem;
    color: var(--text-secondary);
  }
  
  .help-section li {
    margin-bottom: 0.5rem;
  }
  
  .info-list {
    list-style: none;
    padding: 0;
  }
  
  .info-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .info-list li:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    .tool-actions {
      flex-direction: column;
    }
    
    .tool-actions .btn {
      width: 100%;
    }
    
    .result-stats {
      grid-template-columns: 1fr;
    }
  }
`;

const style = document.createElement('style');
style.textContent = pageStyles;
document.head.appendChild(style);
