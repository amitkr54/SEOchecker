/**
 * Footer Component
 * Global footer for all pages
 */

export function createFooter() {
    const currentYear = new Date().getFullYear();

    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">SEO Tools Suite</h3>
            <p class="footer-desc">Free, fast, and powerful SEO tools to optimize your website for search engines.</p>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-heading">Tools</h4>
            <ul class="footer-links">
              <li><a href="/src/tools/schema-validator/">Schema Validator</a></li>
              <li><a href="/src/tools/core-web-vitals/">Core Web Vitals</a></li>
              <li><a href="/src/tools/alt-text-checker/">Alt Text Checker</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-heading">Resources</h4>
            <ul class="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-heading">Legal</h4>
            <ul class="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${currentYear} SEO Tools Suite. All rights reserved.</p>
          <p class="footer-credit">Built with ❤️ for better SEO</p>
        </div>
      </div>
    </footer>
  `;
}

// Footer styles
export const footerStyles = `
<style>
.site-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--glass-border);
  padding: 3rem 0 1.5rem;
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-light), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.footer-desc {
  color: var(--text-tertiary);
  line-height: 1.6;
}

.footer-heading {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links a {
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.footer-links a:hover {
  color: var(--primary-light);
  transform: translateX(4px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.footer-credit {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
`;
