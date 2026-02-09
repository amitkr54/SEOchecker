/**
 * SEO Audit Backend Proxy Server
 * Bypasses CORS restrictions by fetching websites server-side
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dns = require('dns').promises;

const app = express();
const PORT = 3001;

// Enable CORS for frontend (localhost:5173)
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

/**
 * Proxy endpoint to fetch any website
 * GET /api/fetch?url=https://example.com
 */
app.get('/api/fetch', async (req, res) => {
    try {
        const targetUrl = req.query.url;

        // Validate URL
        if (!targetUrl) {
            return res.status(400).json({
                error: 'URL parameter is required',
                usage: '/api/fetch?url=https://example.com'
            });
        }

        // Validate URL format
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            return res.status(400).json({
                error: 'URL must start with http:// or https://'
            });
        }

        console.log(`[FETCH] Fetching: ${targetUrl}`);

        // Fetch the website with headers to mimic a real browser
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'max-age=0'
            },
            timeout: 10000, // 10 second timeout
            maxRedirects: 5,
            validateStatus: (status) => status < 500 // Accept any status < 500
        });

        console.log(`[SUCCESS] ${targetUrl} - Status: ${response.status}, Size: ${(response.data.length / 1024).toFixed(2)} KB`);

        // Return data in AllOrigins-compatible format
        res.json({
            contents: response.data,
            headers: response.headers, // Expose headers for technical checks
            status: {
                url: targetUrl,
                content_type: response.headers['content-type'],
                http_code: response.status,
                response_time: response.headers['x-response-time'] || 'N/A'
            }
        });

    } catch (error) {
        console.error(`[ERROR] Failed to fetch ${req.query.url}:`, error.message);

        // Handle different error types
        if (error.code === 'ENOTFOUND') {
            return res.status(404).json({
                error: 'Website not found or DNS resolution failed',
                details: error.message
            });
        }

        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            return res.status(408).json({
                error: 'Request timeout - website took too long to respond',
                details: error.message
            });
        }

        if (error.response) {
            // Server responded with error status
            return res.status(error.response.status).json({
                error: `Server responded with ${error.response.status}`,
                details: error.response.statusText
            });
        }

        // Generic error
        res.status(500).json({
            error: 'Failed to fetch website',
            details: error.message
        });
    }
});

/**
 * SSL/TLS Certificate Info Endpoint
 * GET /api/ssl?url=https://example.com
 */
const https = require('https');
const tls = require('tls');
app.get('/api/ssl', async (req, res) => {
    let socket;
    try {
        const targetUrl = req.query.url;
        if (!targetUrl) return res.status(400).json({ error: 'URL required' });

        const urlObj = new URL(targetUrl);
        const hostname = urlObj.hostname;

        console.log(`[SSL] Inspecting: ${hostname}`);

        const options = {
            host: hostname,
            port: 443,
            servername: hostname,
            rejectUnauthorized: false
        };

        socket = tls.connect(options, () => {
            const fullCert = socket.getPeerCertificate(true);
            const authorized = socket.authorized;
            const protocol = socket.getProtocol();

            // Extract only what we need to avoid circular references and massive objects
            const cert = {
                subject: fullCert.subject,
                issuer: fullCert.issuer,
                valid_from: fullCert.valid_from,
                valid_to: fullCert.valid_to,
                subjectaltname: fullCert.subjectaltname,
                fingerprint256: fullCert.fingerprint256,
                issuerCertificate: fullCert.issuerCertificate ? {
                    subject: fullCert.issuerCertificate.subject,
                    issuer: fullCert.issuerCertificate.issuer,
                    valid_from: fullCert.issuerCertificate.valid_from,
                    valid_to: fullCert.issuerCertificate.valid_to
                } : null
            };

            res.json({
                authorized,
                cert,
                protocol,
                error: socket.authorizationError
            });
            socket.destroy();
        });

        socket.on('error', (e) => {
            console.error(`[SSL ERROR] ${e.message}`);
            if (!res.headersSent) {
                res.status(500).json({ error: 'SSL analysis failed', details: e.message });
            }
            if (socket) socket.destroy();
        });

        socket.setTimeout(5000, () => {
            if (!res.headersSent) {
                res.status(408).json({ error: 'SSL analysis timeout' });
            }
            if (socket) socket.destroy();
        });

    } catch (error) {
        console.error(`[SSL EXCEPTION] ${error.message}`);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to analyze SSL', details: error.message });
        }
        if (socket) socket.destroy();
    }
});

/**
 * DNS Lookup Endpoint
 * GET /api/dns?domain=example.com&type=TXT
 */
app.get('/api/dns', async (req, res) => {
    try {
        const { domain, type } = req.query;

        if (!domain) {
            return res.status(400).json({ error: 'Domain parameter is required' });
        }

        console.log(`[DNS] Looking up ${type || 'A'} records for ${domain}`);

        let records;
        if (type === 'TXT') {
            records = await dns.resolveTxt(domain);
            // Flatten array of arrays for TXT records
            records = records.map(chunk => chunk.join(''));
        } else if (type === 'A') {
            records = await dns.resolve4(domain);
        } else {
            return res.status(400).json({ error: 'Unsupported record type. Use A or TXT.' });
        }

        res.json({ domain, type: type || 'A', records });

    } catch (error) {
        console.error(`[DNS ERROR] ${error.message}`);

        // Return empty array for passed but empty results (nodata)
        if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
            return res.json({ domain: req.query.domain, type: req.query.type, records: [] });
        }

        res.status(500).json({ error: 'DNS lookup failed', details: error.message });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'SEO Audit Backend',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

/**
 * Root endpoint - API documentation
 */
app.get('/', (req, res) => {
    res.json({
        service: 'SEO Audit Backend Proxy',
        endpoints: {
            '/api/fetch': 'Fetch any website (GET with ?url= parameter)',
            '/api/ssl': 'Analyze SSL/TLS certificate (GET with ?url= parameter)',
            '/api/dns': 'Perform DNS lookup (GET with ?domain= and ?type=)',
            '/api/health': 'Health check endpoint'
        },
        example: '/api/fetch?url=https://example.com'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 SEO Audit Backend Server Started!');
    console.log('='.repeat(60));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/fetch?url=`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(60));
    console.log('Ready to proxy SEO audit requests! 🎉');
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    process.exit(0);
});
