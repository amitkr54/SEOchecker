import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    // Multi-page app configuration
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                schemaValidator: resolve(__dirname, 'schema-validator/index.html'),
                coreWebVitals: resolve(__dirname, 'core-web-vitals/index.html'),
                altTextChecker: resolve(__dirname, 'alt-text-checker/index.html'),
                metaDescriptionGenerator: resolve(__dirname, 'meta-description-generator/index.html'),
                keywordDensityChecker: resolve(__dirname, 'keyword-density-checker/index.html'),
                canonicalUrlChecker: resolve(__dirname, 'canonical-url-checker/index.html'),
                openGraphGenerator: resolve(__dirname, 'open-graph-generator/index.html'),
                websiteSpeedTest: resolve(__dirname, 'website-speed-test/index.html'),
                seoAuditTool: resolve(__dirname, 'seo-audit/index.html'),
                faviconGenerator: resolve(__dirname, 'favicon-generator/index.html'),
                robotsTxtGenerator: resolve(__dirname, 'robots-txt-generator/index.html'),
            },
        },
    },
    // Server configuration
    server: {
        port: 5173,
        open: true,
    },
    // Base path for deployment
    base: './',
});
