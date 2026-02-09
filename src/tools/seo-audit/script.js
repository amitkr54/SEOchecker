/**
 * SEO Audit Tool - Main Script
 * Comprehensive website SEO analysis
 */

import { metaChecks, headingChecks, imageChecks, performanceChecks, securityChecks, technicalChecks } from './checks.js';
import { advancedChecks, analyticsChecks, structuredDataChecks, mobilityChecks, socialChecks, linkChecks, serverChecks, technicalHeaderChecks, contentStructureChecks, socialExpansionChecks, extraPerformanceChecks, commonSEOExpansionChecks } from './advanced-checks.js';
import { exportToPDF } from './pdf-export.js';
import { createHeader, initHeader, headerStyles } from '../../components/Header.js';
import { createFooter, footerStyles } from '../../components/Footer.js';
import { createCircularScore, circularScoreStyles } from '../../components/CircularScore.js';
import { createIssuesList, issuesListStyles } from '../../components/IssuesList.js';
import { createProgressBars, progressBarsStyles } from '../../components/ProgressBars.js';
import { createTestResultCard, testResultCardStyles } from '../../components/TestResultCard.js';

class SEOAuditor {
  constructor() {
    this.results = [];
    this.score = 0;
    this.url = '';
    this.htmlContent = '';
  }

  async auditURL(url) {
    try {
      this.url = url;
      this.showLoading();

      // Validate URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('URL must start with http:// or https://');
      }

      // Fetch the webpage using our LOCAL BACKEND server
      console.log('Fetching website:', url);
      const proxyUrl = `http://localhost:3001/api/fetch?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch website: ${response.status}`);
      }

      const data = await response.json();
      this.htmlContent = data.contents;
      console.log('HTML fetched, size:', (this.htmlContent.length / 1024).toFixed(2), 'KB');

      // Store headers for technical checks
      this.headers = data.headers || {};

      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.htmlContent, 'text/html');

      // Run all checks
      await this.runAllChecks(doc, url);

      // Calculate score
      this.calculateScore();

      // Display results
      this.displayResults();

      this.hideLoading();
      this.showResults();

    } catch (error) {
      console.error('Audit failed:', error);
      this.hideLoading();
      alert(`Failed to audit website: ${error.message}\n\nMake sure the backend server is running on port 3001!`);
    }
  }

  async runAllChecks(doc, url) {
    this.results = [];

    console.log('Running SEO checks...');

    // Meta Tags Checks (4 checks)
    this.updateProgress(10, 'Analyzing meta tags...');
    this.results.push(metaChecks.checkMetaTitle(doc));
    this.results.push(metaChecks.checkMetaDescription(doc));
    this.results.push(metaChecks.checkOpenGraph(doc));
    this.results.push(metaChecks.checkKeywords(doc));

    // Heading Structure Checks (3 checks)
    this.updateProgress(20, 'Checking heading structure...');
    this.results.push(headingChecks.checkH1Tags(doc));
    this.results.push(headingChecks.checkH2Tags(doc));
    this.results.push(headingChecks.checkHeadingHierarchy(doc));

    // Image Optimization Checks (3 checks)
    this.updateProgress(30, 'Optimizing images...');
    this.results.push(imageChecks.checkImageAltText(doc));
    this.results.push(imageChecks.checkResponsiveImages(doc));
    this.results.push(imageChecks.checkImageFormats(doc));

    // Performance Checks (4 checks)
    this.updateProgress(40, 'Measuring performance...');
    this.results.push(performanceChecks.checkHTTPRequests(doc));
    this.results.push(performanceChecks.checkMinification(doc));
    this.results.push(performanceChecks.checkPageSize(this.htmlContent));
    this.results.push(performanceChecks.checkInlineCSS(doc));

    // Security Checks (4 checks)
    this.updateProgress(50, 'Evaluating security...');
    this.results.push(await advancedChecks.checkSSLDetailed(url));
    const mixedContent = securityChecks.checkMixedContent(doc, url);
    if (mixedContent) this.results.push(mixedContent);
    this.results.push(securityChecks.checkDeprecatedHTML(doc));
    this.results.push(securityChecks.checkEmailsInPlaintext(doc));

    // Server & Security Checks (Async)
    this.updateProgress(55, 'Checking server configuration...');
    console.log('Running server checks...');
    this.results.push(await serverChecks.checkIPCanonicalization(url));
    this.results.push(await serverChecks.checkSPFRecord(url));
    this.results.push(await serverChecks.checkAdsTxt(url));
    this.results.push(await serverChecks.checkCustom404(url));
    this.results.push(await serverChecks.checkURLCanonicalization(url));

    // Technical SEO Checks (5 checks)
    this.updateProgress(60, 'Analyzing technical SEO...');
    this.results.push(technicalChecks.checkViewport(doc));
    this.results.push(technicalChecks.checkLanguage(doc));
    this.results.push(technicalChecks.checkFavicon(doc));
    this.results.push(technicalChecks.checkCanonical(doc));
    this.results.push(technicalChecks.checkRobotsMeta(doc));

    // Advanced Checks - Sitemap & Robots (2 async checks)
    console.log('Running advanced checks...');
    const sitemapResult = await advancedChecks.checkSitemap(url);
    if (sitemapResult) this.results.push(sitemapResult);

    const robotsResult = await advancedChecks.checkRobotsTxt(url);
    if (robotsResult) this.results.push(robotsResult);

    // Analytics & Tracking Checks (3 checks)
    this.results.push(analyticsChecks.checkGoogleAnalytics(doc));
    this.results.push(analyticsChecks.checkFacebookPixel(doc));
    this.results.push(analyticsChecks.checkGoogleTagManager(doc));

    // Structured Data Checks (2 checks)
    this.results.push(structuredDataChecks.checkJsonLdSchema(doc));
    this.results.push(structuredDataChecks.checkMicrodataSchema(doc));

    // Mobile & Performance Checks (3 checks)
    this.results.push(mobilityChecks.checkMobileFriendly(doc));
    this.results.push(mobilityChecks.checkTouchElements(doc));
    this.results.push(mobilityChecks.checkFontSize(doc));

    // Social Media Checks (1 check)
    this.results.push(socialChecks.checkTwitterCards(doc));

    // Link Quality Checks (3 checks)
    this.updateProgress(65, 'Checking link quality...');
    this.results.push(linkChecks.checkInternalLinks(doc));
    this.results.push(linkChecks.checkExternalLinks(doc));
    this.results.push(linkChecks.checkBrokenLinks(doc));

    // ===================================
    // NEW CHECKS (EXPANSION TO 61+)
    // ===================================

    // Technical Headers (5 checks)
    this.updateProgress(70, 'Analyzing security headers...');
    this.results.push(technicalHeaderChecks.checkGZIP(this.headers));
    this.results.push(technicalHeaderChecks.checkServerSignature(this.headers));
    this.results.push(technicalHeaderChecks.checkHSTS(this.headers));
    this.results.push(technicalHeaderChecks.checkXContentOptions(this.headers));
    this.results.push(technicalHeaderChecks.checkXFrameOptions(this.headers));

    // Detailed Content Structure (13 checks)
    this.updateProgress(75, 'Analyzing content structure...');
    this.results.push(contentStructureChecks.checkCharset(doc));
    this.results.push(contentStructureChecks.checkDoctype(doc));
    this.results.push(contentStructureChecks.checkNestedTables(doc));
    this.results.push(contentStructureChecks.checkFrames(doc));
    this.results.push(contentStructureChecks.checkTextRatio(doc));
    this.results.push(contentStructureChecks.checkUrlLength(url));
    this.results.push(contentStructureChecks.checkUrlUnderscores(url));
    this.results.push(contentStructureChecks.checkBreadcrumbs(doc));
    this.results.push(contentStructureChecks.checkImageTitles(doc));
    this.results.push(contentStructureChecks.checkJSLibs(doc));
    this.results.push(contentStructureChecks.checkCSSFrameworks(doc));
    this.results.push(contentStructureChecks.checkSafeBrowsing(url));
    this.results.push(contentStructureChecks.checkDirectoryBrowsing(url));

    // Social Media Expansion (4 checks)
    this.updateProgress(85, 'Checking social connectivity...');
    const socialLinks = socialExpansionChecks.checkSocialLinks(doc);
    this.results.push(...socialLinks);

    // Expansion: Extra Performance & Speed (12 checks)
    this.updateProgress(90, 'Measuring speed performance...');
    this.results.push(extraPerformanceChecks.checkDOMSize(doc));
    this.results.push(extraPerformanceChecks.checkCDNUsage(doc));
    this.results.push(extraPerformanceChecks.checkImageMetadata(doc));
    this.results.push(extraPerformanceChecks.checkCaching(this.headers));
    this.results.push(extraPerformanceChecks.checkRenderBlocking(doc));
    this.results.push(extraPerformanceChecks.checkURLRedirects());
    this.results.push(extraPerformanceChecks.checkTTFB());
    this.results.push(extraPerformanceChecks.checkJSExecutionTime());
    this.results.push(extraPerformanceChecks.checkFirstContentfulPaint());
    this.results.push(extraPerformanceChecks.checkLargestContentfulPaint());
    this.results.push(extraPerformanceChecks.checkCumulativeLayoutShift());
    this.results.push(extraPerformanceChecks.checkSiteLoadingSpeed());
    this.results.push(extraPerformanceChecks.checkScriptCaching());
    this.results.push(extraPerformanceChecks.checkStyleCaching());
    this.results.push(extraPerformanceChecks.checkImageCaching());

    // Expansion: Common SEO (4 checks)
    this.updateProgress(95, 'Finalizing SEO analysis...');
    this.results.push(commonSEOExpansionChecks.checkImageAspectRatio(doc));
    this.results.push(commonSEOExpansionChecks.checkBacklinks(doc));
    this.results.push(commonSEOExpansionChecks.checkRelatedKeywords(doc));
    this.results.push(commonSEOExpansionChecks.checkCompetitorDomains(doc));

    this.updateProgress(100, 'Audit Complete!');

    // Filter out null results
    this.results = this.results.filter(r => r !== null);

    console.log(`Completed ${this.results.length} checks`);
  }

  updateProgress(percent, status) {
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    const statusEl = document.getElementById('loading-status');

    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `Evaluating Website - ${percent}% Complete`;
    if (statusEl && status) statusEl.textContent = status;
  }

  calculateScore() {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const warnings = this.results.filter(r => r.status === 'neutral').length;
    const failed = this.results.filter(r => r.status === 'warning' || r.status === 'error').length;
    const total = this.results.length;

    if (total === 0) {
      this.score = 0;
    } else {
      const weightedScore = (passed * 1.0) + (warnings * 0.6);
      this.score = Math.round((weightedScore / total) * 100);
    }

    console.log(`Score: ${this.score}/100 (Pass: ${passed}, Warn: ${warnings}, Fail: ${failed})`);
  }

  displayResults() {
    const resultsContainer = document.getElementById('audit-results');

    // Count results by status
    const failed = this.results.filter(r => r.status === 'warning' || r.status === 'error').length;
    const warnings = this.results.filter(r => r.status === 'neutral').length;
    const passed = this.results.filter(r => r.status === 'pass').length;

    // Get high/medium priority issues
    const issues = this.results
      .filter(r => (r.priority === 'high' || r.priority === 'medium') && r.status !== 'pass')
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .map(r => {
        // Generate a simple slug from the name
        const slug = (r.name || r.description || '').toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        r.id = slug; // Attach slug to the original result object too
        return {
          priority: r.priority,
          text: r.description,
          icon: '🔗',
          anchor: slug
        };
      });

    // Also ensure all other results have slugs for detailed mapping
    this.results.forEach(r => {
      if (!r.id) {
        r.id = (r.name || r.description || '').toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    });

    // Calculate category scores
    const categories = this.getCategoryBreakdown();

    resultsContainer.innerHTML = `
      <div class="audit-results-container">
        <!-- Header per Reference Image -->
        <div class="results-header-section flex-between">
          <div class="results-header-info">
            <h2 class="results-url">${this.url}</h2>
            <p class="results-tagline">Your general SEO Checkup Score</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-outline" id="export-pdf-btn">
              <span class="icon">📥</span> Download PDF
            </button>
          </div>
        </div>
        
        <!-- Score & Summary Grid per Reference Image -->
        <div class="results-summary-card">
          <div class="summary-left">
            ${createCircularScore(this.score, 100, 'SEO Score')}
          </div>
          
          <div class="summary-right">
            <p class="score-narrative">
              This webpage received an SEO score of <strong>${this.score} out of 100</strong>, 
              which is ${this.score >= 75 ? 'higher than' : 'lower than'} the average score of 75. 
              Our analysis has identified <strong>${failed} SEO issues</strong> that can be addressed 
              to further enhance your website's performance and improve its search engine visibility.
            </p>
            
            <div class="status-bars-container">
              ${createProgressBars({ failed, warnings, passed })}
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="category-breakdown-card">
          <h4 class="card-subtitle">Category Breakdown</h4>
          <div class="category-grid">
            ${categories.map(cat => `
              <div class="category-item">
                <span class="category-name">${cat.name}</span>
                <span class="category-score-val">${cat.score}/100</span>
                <div class="category-mini-bar">
                  <div class="mini-bar-fill" style="width: ${cat.score}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Issues to Fix -->
        ${issues.length > 0 ? `
          <div class="issues-section">
            <h3 class="section-title">Common SEO Issues</h3>
            ${createIssuesList(issues)}
          </div>
        ` : ''}
        
        <!-- Detailed Results -->
        <div class="detailed-results-section">
          <div class="section-header">
            <h3>Detailed Test Results</h3>
            <p class="section-description">Click on each test to see detailed information and recommendations.</p>
          </div>
          
          <div class="test-results-grid">
            ${this.results.map(result => createTestResultCard(result)).join('')}
          </div>
        </div>
        
        <!-- Footer Actions -->
        <div class="results-actions secondary-actions">
          <button class="btn btn-secondary" onclick="window.print()">
            🖨️ Print Report
          </button>
          <button class="btn btn-secondary" onclick="location.reload()">
            🔄 New Audit
          </button>
        </div>
      </div>
    `;
  }

  getCategoryBreakdown() {
    const categoryMap = {
      'meta': 'Meta Tags',
      'headings': 'Headings',
      'images': 'Images',
      'performance': 'Performance',
      'security': 'Security',
      'technical': 'Technical',
      'social': 'Social'
    };

    const calcScore = (results) => {
      if (results.length === 0) return 0;
      const passed = results.filter(r => r.status === 'pass').length;
      const warnings = results.filter(r => r.status === 'neutral').length;

      const weightedScore = (passed * 1.0) + (warnings * 0.6);
      return Math.round((weightedScore / results.length) * 100);
    };

    return Object.keys(categoryMap).map(key => {
      const results = this.results.filter(r => r.category === key);
      const score = calcScore(results);
      return {
        key: key,
        name: categoryMap[key],
        score: score,
        passed: results.filter(r => r.status === 'pass').length,
        total: results.length,
        status: score >= 75 ? 'success' : 'warning'
      };
    }).filter(cat => cat.total > 0);
  }

  showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results-section').classList.add('hidden');
  }

  hideLoading() {
    document.getElementById('loading').classList.add('hidden');
  }

  showResults() {
    document.getElementById('results-section').classList.remove('hidden');
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Inject header/footer styles
  document.head.insertAdjacentHTML('beforeend', headerStyles);
  document.head.insertAdjacentHTML('beforeend', footerStyles);

  // Inject component styles
  document.head.insertAdjacentHTML('beforeend', circularScoreStyles);
  document.head.insertAdjacentHTML('beforeend', issuesListStyles);
  document.head.insertAdjacentHTML('beforeend', progressBarsStyles);
  document.head.insertAdjacentHTML('beforeend', testResultCardStyles);

  // Inject Header
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = createHeader();
    initHeader();
  }

  // Add page-specific styles
  const pageStyles = `
    <style>
    html {
      scroll-behavior: smooth;
    }
    
    .test-card:target {
      scroll-margin-top: 2rem;
      border-color: #2196F3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
    }

    .audit-page {
      min-height: 100vh;
      padding-bottom: 4rem;
      background: #fdfdfd;
    }
    
    /* Hero Landing Styles */
    .hero-header {
      padding: 6rem 0 8rem;
      position: relative;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      overflow: hidden;
      margin-bottom: 3rem;
    }
    
    .hero-bg-accent {
      position: absolute;
      top: -20%;
      right: -10%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(255,102,0,0.15) 0%, rgba(255,102,0,0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    
    .text-center { text-align: center; }
    
    .hero-title {
      font-size: 4rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      background: linear-gradient(to right, #fff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: #94a3b8;
      max-width: 700px;
      margin: 0 auto 3rem;
      line-height: 1.6;
    }
    
    .audit-input-container {
      max-width: 800px;
      margin: 0 auto 4rem;
      position: relative;
      z-index: 10;
    }
    
    .audit-form-v2 {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      padding: 8px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    .input-v2 {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 12px;
      padding: 6px 6px 6px 20px;
      gap: 15px;
    }
    
    .input-icon {
      font-size: 1.2rem;
      color: #64748b;
    }
    
    .audit-input-field {
      flex: 1;
      border: none;
      font-size: 1.1rem;
      color: #1e293b;
      outline: none;
      padding: 10px 0;
    }
    
    .btn-audit-main {
      background: #ff6600;
      color: white;
      border: none;
      padding: 14px 28px;
      font-size: 1.1rem;
      font-weight: 700;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .btn-audit-main:hover {
      background: #e65c00;
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(255, 102, 0, 0.3);
    }
    
    /* Feature Pills */
    .feature-pills {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .feature-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 16px;
      border-radius: 100px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      color: #cbd5e1;
      transition: all 0.3s ease;
    }
    
    .feature-pill:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .pill-icon {
      font-size: 1.1rem;
    }

    /* Result Layout Styles */
    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .results-header-section {
      background: white;
      padding: 1.5rem 2rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      margin-bottom: 1.5rem;
    }
    
    .results-url {
      font-size: 1.75rem;
      margin: 0;
      color: #111;
      font-weight: 700;
    }
    
    .results-tagline {
      font-size: 0.9rem;
      color: #777;
      margin: 4px 0 0;
    }
    
    .btn-outline {
      background: white;
      border: 1px solid #ccc;
      color: #333;
      padding: 0.6rem 1.2rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    
    .btn-outline:hover {
      background: #f5f5f5;
      border-color: #999;
    }
    
    .results-summary-card {
      display: grid;
      grid-template-columns: 310px 1fr;
      gap: 2rem;
      background: white;
      padding: 2.5rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      margin-bottom: 1.5rem;
    }
    
    .score-narrative {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #444;
      margin-top: 0;
      margin-bottom: 2rem;
    }
    
    .category-breakdown-card {
      background: white;
      padding: 2rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      margin-bottom: 1.5rem;
    }
    
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    
    .category-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .category-name {
      font-weight: 600;
      color: #333;
    }
    
    .category-score-val {
      font-size: 0.9rem;
      color: #666;
    }
    
    .category-mini-bar {
      height: 4px;
      background: #eee;
      border-radius: 2px;
      overflow: hidden;
    }
    
    .mini-bar-fill {
      height: 100%;
      background: #10B981;
      border-radius: 2px;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .detailed-results-section {
      background: white;
      padding: 2rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
    }
    
    .secondary-actions {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    
    @media (max-width: 900px) {
      .results-summary-card {
        grid-template-columns: 1fr;
      }
      .summary-left {
        justify-content: center;
        display: flex;
      }
    }
    /* Loading Overlay & Progress Bar */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.95);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .progress-container-v2 {
      width: 90%;
      max-width: 900px;
      height: 48px;
      background: #f1f5f9;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .progress-bar-v2 {
      width: 100%;
      height: 100%;
      position: relative;
      background: #e2e8f0;
    }

    .progress-fill-v2 {
      height: 100%;
      background-color: #3b82f6;
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      background-size: 40px 40px;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: progress-bar-stripes 1s linear infinite;
    }

    @keyframes progress-bar-stripes {
      from { background-position: 40px 0; }
      to { background-position: 0 0; }
    }

    .progress-text-v2 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #1e293b;
      font-weight: 700;
      font-size: 1.1rem;
      white-space: nowrap;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
      z-index: 10;
    }

    #loading-status {
      font-size: 1rem;
      color: #64748b;
      font-weight: 500;
    }

    .hidden {
      display: none !important;
    }
    </style>
  `;

  document.head.insertAdjacentHTML('beforeend', pageStyles);

  // Initialize auditor
  const auditor = new SEOAuditor();

  // Handle form submission
  const form = document.getElementById('audit-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url-input').value.trim();
    await auditor.auditURL(url);

    // Attach PDF export handler after results are displayed
    setTimeout(() => {
      const pdfBtn = document.getElementById('export-pdf-btn');
      if (pdfBtn) {
        pdfBtn.addEventListener('click', async () => {
          pdfBtn.disabled = true;
          pdfBtn.textContent = '⏳ Generating PDF...';
          await exportToPDF(auditor);
          pdfBtn.disabled = false;
          pdfBtn.textContent = '📄 Download PDF Report';
        });
      }
    }, 500);
  });

  // Check if URL parameter exists (for direct links)
  const urlParams = new URLSearchParams(window.location.search);
  const urlToAudit = urlParams.get('url');
  if (urlToAudit) {
    document.getElementById('url-input').value = urlToAudit;
    auditor.auditURL(urlToAudit);
  }
});
