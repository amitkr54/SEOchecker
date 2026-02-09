/**
 * SEO Audit Checks Module
 * Contains all individual SEO check functions
 */

// ===================================
// META TAGS CHECKS
// ===================================
export const metaChecks = {

    checkMetaTitle(doc) {
        const title = doc.querySelector('title');
        const length = title?.textContent.trim().length || 0;

        return {
            name: 'Meta Title Test',
            status: length >= 10 && length <= 100 ? 'pass' : (length === 0 ? 'warning' : 'neutral'),
            passRate: 100,
            description: length === 0
                ? 'No title tag found. Title tags are essential for SEO.'
                : `This webpage is using a title tag with a length of ${length} characters. We recommend using a title with a length between 10 - 100 characters.`,
            priority: length === 0 ? 'high' : (length > 100 || length < 10 ? 'medium' : 'low'),
            category: 'meta',
            contentBox: title ? `<strong>Text:</strong> ${title.textContent.trim()}<br><strong>Length:</strong> ${length} characters` : null,
            howToFix: length < 10 || length > 100 ? `
                <p>Your page title is either too short, too long, or missing. To fix this:</p>
                <ul>
                    <li>Open your HTML file and find the <code>&lt;title&gt;</code> tag in the <code>&lt;head&gt;</code> section.</li>
                    <li>Rewrite the title to be between <strong>10 and 100 characters</strong>.</li>
                    <li>Make sure it accurately describes the page content and includes your main keyword.</li>
                </ul>
            ` : null
        };
    },

    checkMetaDescription(doc) {
        const meta = doc.querySelector('meta[name="description"]');
        const length = meta?.content.trim().length || 0;

        return {
            name: 'Meta Description Test',
            status: length >= 50 && length <= 500 ? 'pass' : (length === 0 ? 'warning' : 'neutral'),
            passRate: 92,
            description: length === 0
                ? 'No meta description found. Meta descriptions help search engines understand your page.'
                : `This webpage is using a meta description tag with a length of ${length} characters. We recommend keeping it between 50 and 500 characters.`,
            priority: length === 0 ? 'high' : (length > 100 || length < 50 ? 'medium' : 'low'),
            category: 'meta',
            contentBox: meta ? `<strong>Text:</strong> ${meta.content.trim()}<br><strong>Length:</strong> ${length} characters` : null,
            howToFix: length < 50 || length > 500 ? `
                <p>A good meta description attracts users from search results. To fix this:</p>
                <ul>
                    <li>Add or update the <code>&lt;meta name="description" content="..."&gt;</code> tag in your <code>&lt;head&gt;</code>.</li>
                    <li>Aim for a length between <strong>50 and 500 characters</strong>.</li>
                    <li>Write a compelling summary that encourages users to click your link.</li>
                </ul>
            ` : null
        };
    },

    checkOpenGraph(doc) {
        const ogTags = doc.querySelectorAll('meta[property^="og:"]');
        const hasTitle = doc.querySelector('meta[property="og:title"]');
        const hasImage = doc.querySelector('meta[property="og:image"]');

        const essentialsPresent = hasTitle && hasImage;

        return {
            name: 'Social Media Meta Tags Test',
            status: essentialsPresent ? 'pass' : 'neutral',
            passRate: 89,
            description: essentialsPresent
                ? 'This webpage is using social media meta tags (Open Graph).'
                : `Found ${ogTags.length} Open Graph tags. Recommended tags: og:title, og:image, etc.`,
            priority: 'low',
            category: 'meta',
            contentBox: `<strong>og:title:</strong> ${hasTitle ? '✓' : '✗'}<br><strong>og:image:</strong> ${hasImage ? '✓' : '✗'}`
        };
    },

    checkKeywords(doc) {
        const metaKeywords = doc.querySelector('meta[name="keywords"]');

        return {
            name: 'Meta Keywords Test',
            status: 'neutral',
            passRate: 48,
            description: metaKeywords
                ? 'Meta keywords tag found. Note: Most search engines ignore this tag.'
                : 'No meta keywords tag found. Most modern search engines ignore this tag anyway.',
            priority: 'low',
            category: 'meta'
        };
    }
};

// ===================================
// HEADING STRUCTURE CHECKS
// ===================================
export const headingChecks = {

    checkH1Tags(doc) {
        const h1Tags = doc.querySelectorAll('h1');
        const count = h1Tags.length;

        return {
            name: 'H1 Heading Tag Test',
            status: count === 1 ? 'pass' : (count > 0 ? 'warning' : 'error'),
            passRate: 98,
            description: count === 0
                ? 'No H1 heading tag found. H1 tags are important for SEO and page structure.'
                : count === 1
                    ? 'This webpage has exactly one H1 heading tag.'
                    : `This webpage has ${count} H1 heading tags.`,
            priority: count === 0 ? 'high' : 'low',
            category: 'headings',
            contentBox: count > 0 ? `<strong>Count:</strong> ${count} H1 tags` : null,
            howToFix: count !== 1 ? `
                <p>Search engines use the H1 tag as the primary heading for the page. To fix this:</p>
                <ul>
                    <li>Ensure your page has <strong>exactly one</strong> <code>&lt;h1&gt;</code> tag.</li>
                    <li>If you have multiple, demote the others to <code>&lt;h2&gt;</code> or <code>&lt;h3&gt;</code>.</li>
                    <li>If you have none, add a descriptive <code>&lt;h1&gt;</code> that contains your main keyword.</li>
                </ul>
            ` : null
        };
    },

    checkH2Tags(doc) {
        const h2Tags = doc.querySelectorAll('h2');
        const count = h2Tags.length;

        return {
            name: 'H2 Heading Tags Test',
            status: count > 0 ? 'pass' : 'neutral',
            passRate: 95,
            description: count === 0
                ? 'No H2 tags found. H2 tags help structure your content.'
                : `This webpage has ${count} H2 tags, which is good for content structure.`,
            priority: count === 0 ? 'medium' : 'low',
            category: 'headings'
        };
    },

    checkHeadingHierarchy(doc) {
        const h1 = doc.querySelectorAll('h1').length;
        const h2 = doc.querySelectorAll('h2').length;
        const h3 = doc.querySelectorAll('h3').length;

        return {
            name: 'Heading Hierarchy Test',
            status: 'neutral',
            passRate: 85,
            description: `Heading distribution: H1(${h1}), H2(${h2}), H3(${h3})`,
            priority: 'low',
            category: 'headings'
        };
    }
};

// ===================================
// IMAGE OPTIMIZATION CHECKS
// ===================================
export const imageChecks = {

    checkImageAltText(doc) {
        const images = doc.querySelectorAll('img');
        const totalImages = images.length;
        const missingAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
        const missingCount = missingAlt.length;

        const status = missingCount <= (totalImages * 0.1) || missingCount === 0 ? 'pass' : 'warning';

        return {
            name: 'Image Alt Text Test',
            status: status,
            passRate: 88,
            description: status === 'pass'
                ? `Most images have alt attributes (${totalImages - missingCount}/${totalImages}).`
                : `This webpage is using "img" tags with empty or missing "alt" attribute!`,
            priority: status === 'warning' ? 'high' : 'low',
            category: 'images',
            howToFix: status === 'warning' ? `
                <p>Alt text is vital for accessibility and image SEO. To fix this:</p>
                <ul>
                    <li>Review all <code>&lt;img&gt;</code> tags in your HTML.</li>
                    <li>Add the <code>alt="description"</code> attribute to every image.</li>
                    <li>Describe the image content clearly for screen readers and search engines.</li>
                </ul>
            ` : null
        };
    },

    checkResponsiveImages(doc) {
        const images = doc.querySelectorAll('img');
        if (images.length === 0) return null; // Don't show test if no images exist

        const withSrcset = Array.from(images).filter(img => img.srcset);
        const percentage = Math.round((withSrcset.length / images.length) * 100);

        return {
            name: 'Responsive Images Test',
            status: percentage > 20 ? 'pass' : 'neutral',
            passRate: 65,
            description: `${withSrcset.length} of ${images.length} images use responsive srcset attribute.`,
            priority: percentage > 20 ? 'low' : 'high',
            category: 'images'
        };
    },

    checkImageFormats(doc) {
        const images = doc.querySelectorAll('img[src]');
        let modernFormats = 0;
        images.forEach(img => {
            const src = img.src.toLowerCase();
            if (src.includes('.webp') || src.includes('.avif')) modernFormats++;
        });

        return {
            name: 'Modern Image Formats Test',
            status: modernFormats > 0 ? 'pass' : 'neutral',
            passRate: 70,
            description: `Using ${modernFormats} modern format images (WebP/AVIF).`,
            priority: 'low',
            category: 'images'
        };
    }
};

// ===================================
// PERFORMANCE CHECKS
// ===================================
export const performanceChecks = {

    checkHTTPRequests(doc) {
        const scripts = doc.querySelectorAll('script[src]').length;
        const styles = doc.querySelectorAll('link[rel="stylesheet"]').length;
        const images = doc.querySelectorAll('img[src]').length;
        const total = scripts + styles + images;

        return {
            name: 'HTTP Requests Test',
            status: total <= 100 ? 'pass' : 'warning',
            passRate: 78,
            description: total > 100
                ? `This webpage is using more than 100 HTTP requests (${total}).`
                : `This webpage uses ${total} HTTP requests.`,
            priority: total > 150 ? 'high' : 'low',
            category: 'performance',
            howToFix: total > 100 ? `
                <p>Every script, stylesheet, and image is a separate HTTP request, which slows down your page. To fix this:</p>
                <ul>
                    <li>Combine CSS files and JavaScript files into as few files as possible.</li>
                    <li>Use <strong>CSS Sprites</strong> for small icons or switch to SVG icons.</li>
                    <li>Host resources on a CDN or use HTTP/2, which handles multiple requests more efficiently.</li>
                </ul>
            ` : null
        };
    },

    checkMinification(doc) {
        const scripts = doc.querySelectorAll('script[src]');
        const styles = doc.querySelectorAll('link[rel="stylesheet"]');
        const totalMinified = Array.from(scripts).filter(s => s.src.includes('.min.')).length +
            Array.from(styles).filter(s => s.href.includes('.min.')).length;

        const total = scripts.length + styles.length;
        const isMostlyMinified = total > 0 && (totalMinified / total) >= 0.5;

        return {
            name: 'Resource Minification Test',
            status: isMostlyMinified ? 'pass' : 'neutral',
            passRate: 82,
            description: isMostlyMinified
                ? 'Most JavaScript and CSS files appear to be minified.'
                : 'Consider minifying your JavaScript and CSS files.',
            priority: 'medium',
            category: 'performance'
        };
    },

    checkPageSize(html) {
        const sizeKB = (new Blob([html]).size / 1024).toFixed(2);

        return {
            name: 'Page Size Test',
            status: sizeKB < 200 ? 'pass' : (sizeKB < 500 ? 'neutral' : 'warning'),
            passRate: 85,
            description: `The HTML size is ${sizeKB} KB.`,
            priority: sizeKB > 1000 ? 'medium' : 'low',
            category: 'performance'
        };
    },

    checkInlineCSS(doc) {
        const inlineStyles = doc.querySelectorAll('[style]').length;

        return {
            name: 'Inline CSS Test',
            status: inlineStyles < 100 ? 'pass' : 'neutral',
            passRate: 75,
            description: `Found ${inlineStyles} elements with inline styles.`,
            priority: 'low',
            category: 'performance'
        };
    }
};

// ===================================
// SECURITY CHECKS
// ===================================
export const securityChecks = {

    checkHTTPS(url) {
        const isHttps = url.startsWith('https://');

        return {
            name: 'HTTPS/SSL Test',
            status: isHttps ? 'pass' : 'warning',
            passRate: 99,
            description: isHttps
                ? 'This website is successfully using HTTPS.'
                : 'This website is not using HTTPS!',
            priority: isHttps ? 'low' : 'high',
            category: 'security'
        };
    },

    checkMixedContent(doc, baseUrl) {
        const isHttps = baseUrl.startsWith('https://');
        if (!isHttps) return null;

        const httpResources = Array.from(doc.querySelectorAll('[src], [href]'))
            .filter(elem => {
                const url = (elem.src || elem.href || '').toLowerCase();
                return url.startsWith('http://');
            });

        let contentBox = null;
        if (httpResources.length > 0) {
            const list = httpResources.slice(0, 10).map(elem => {
                const url = elem.src || elem.href;
                return `<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #ef4444; border-bottom: 1px solid #fee2e2; padding: 4px 0;">${url}</div>`;
            }).join('');

            contentBox = `
                <div style="font-weight: 600; margin-bottom: 8px;">Insecure Resources Found (Top ${Math.min(10, httpResources.length)}):</div>
                <div style="font-family: monospace; font-size: 12px; background: #fff; border-radius: 4px; padding: 8px; border: 1px solid #fee2e2;">
                    ${list}
                    ${httpResources.length > 10 ? `<div style="margin-top: 5px; color: #6b7280; font-style: italic;">+ ${httpResources.length - 10} more...</div>` : ''}
                </div>
            `;
        }

        return {
            name: 'Mixed Content Test',
            status: httpResources.length === 0 ? 'pass' : 'warning',
            passRate: 95,
            description: httpResources.length === 0
                ? 'This webpage does not use mixed content.'
                : `Found ${httpResources.length} insecure resources.`,
            priority: httpResources.length > 0 ? 'high' : 'low',
            category: 'security',
            contentBox: contentBox,
            howToFix: httpResources.length > 0 ? `
                <p>Mixed content happens when an HTTPS page loads resources (images, scripts) over insecure HTTP. To fix this:</p>
                <ul>
                    <li>Update all URLs in your code from <code>http://</code> to <code>https://</code>.</li>
                    <li>Check your database and stylesheets for hardcoded HTTP links.</li>
                    <li>Use relative URLs (e.g., <code>/images/logo.png</code> instead of <code>http://domain.com/logo.png</code>).</li>
                </ul>
            ` : null
        };
    },

    checkDeprecatedHTML(doc) {
        const deprecated = doc.querySelectorAll('center, font, marquee, blink, strike').length;

        return {
            name: 'Deprecated HTML Test',
            status: deprecated === 0 ? 'pass' : 'warning',
            passRate: 92,
            description: deprecated === 0
                ? 'This webpage does not use deprecated HTML tags.'
                : `Found ${deprecated} deprecated tags.`,
            priority: deprecated > 0 ? 'medium' : 'low',
            category: 'security',
            howToFix: deprecated > 0 ? `
                <p>Deprecated tags like <code>&lt;center&gt;</code> or <code>&lt;font&gt;</code> are not supported in modern HTML. To fix this:</p>
                <ul>
                    <li>Remove the deprecated tags and use CSS for styling instead.</li>
                    <li>Example: Replace <code>&lt;center&gt;text&lt;/center&gt;</code> with <code>&lt;div style="text-align: center;"&gt;text&lt;/div&gt;</code>.</li>
                </ul>
            ` : null
        };
    },

    checkEmailsInPlaintext(doc) {
        const bodyText = doc.body?.textContent || '';
        const emails = (bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []).length;

        return {
            name: 'Plaintext Email Test',
            status: emails === 0 ? 'pass' : 'neutral',
            passRate: 88,
            description: emails === 0
                ? 'No plaintext emails found.'
                : `Found ${emails} plaintext emails.`,
            priority: 'low',
            category: 'security'
        };
    }
};

// ===================================
// TECHNICAL SEO CHECKS
// ===================================
export const technicalChecks = {
    checkViewport(doc) {
        const viewport = doc.querySelector('meta[name="viewport"]');
        return {
            name: 'Viewport Meta Tag Test',
            status: viewport ? 'pass' : 'warning',
            passRate: 96,
            description: viewport
                ? 'Viewport meta tag found.'
                : 'No viewport meta tag found. The viewport meta tag is essential for responsive design on mobile devices.',
            priority: viewport ? 'low' : 'high',
            category: 'technical',
            howToFix: !viewport ? `
                <p>To fix this:</p>
                <ul>
                    <li>Add <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code> to your <code>&lt;head&gt;</code> section.</li>
                    <li>This ensures your site scales correctly on smartphones and tablets.</li>
                </ul>
            ` : null
        };
    },

    checkLanguage(doc) {
        const htmlLang = doc.documentElement.getAttribute('lang');
        return {
            name: 'Language Declaration Test',
            status: htmlLang ? 'pass' : 'neutral',
            passRate: 90,
            description: htmlLang ? `Language: ${htmlLang}` : 'No language declared.',
            priority: 'low',
            category: 'technical'
        };
    },

    checkFavicon(doc) {
        const favicon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
        return {
            name: 'Favicon Test',
            status: favicon ? 'pass' : 'neutral',
            passRate: 85,
            description: favicon ? 'Favicon detected.' : 'No favicon detected.',
            priority: 'low',
            category: 'technical'
        };
    },

    checkCanonical(doc) {
        const canonical = doc.querySelector('link[rel="canonical"]');
        return {
            name: 'Canonical URL Test',
            status: canonical ? 'pass' : 'neutral',
            passRate: 78,
            description: canonical ? 'Canonical link found.' : 'No canonical specified.',
            priority: 'low',
            category: 'technical'
        };
    },

    checkRobotsMeta(doc) {
        const robotsMeta = doc.querySelector('meta[name="robots"]');
        return {
            name: 'Robots Meta Tag Test',
            status: 'neutral',
            passRate: 70,
            description: robotsMeta ? `Robots: ${robotsMeta.content}` : 'No robots tag found.',
            priority: 'low',
            category: 'technical'
        };
    }
};
