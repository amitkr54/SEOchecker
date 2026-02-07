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
