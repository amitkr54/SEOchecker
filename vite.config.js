import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    // Multi-page app configuration
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                schemaValidator: resolve(__dirname, 'src/tools/schema-validator/index.html'),
                coreWebVitals: resolve(__dirname, 'src/tools/core-web-vitals/index.html'),
                altTextChecker: resolve(__dirname, 'src/tools/alt-text-checker/index.html'),
                metaDescriptionGenerator: resolve(__dirname, 'src/tools/meta-description-generator/index.html'),
                keywordDensityChecker: resolve(__dirname, 'src/tools/keyword-density-checker/index.html'),
                canonicalUrlChecker: resolve(__dirname, 'src/tools/canonical-url-checker/index.html'),
                openGraphGenerator: resolve(__dirname, 'src/tools/open-graph-generator/index.html'),
                websiteSpeedTest: resolve(__dirname, 'src/tools/website-speed-test/index.html'),
                seoAuditTool: resolve(__dirname, 'src/tools/seo-audit-tool/index.html'),
                faviconGenerator: resolve(__dirname, 'src/tools/favicon-generator/index.html'),
                robotsTxtGenerator: resolve(__dirname, 'src/tools/robots-txt-generator/index.html'),
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
