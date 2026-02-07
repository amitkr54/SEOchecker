
// Vercel Serverless Function to fetch HTML from a URL
// This bypasses CORS restrictions by running on the server side



export default async function handler(request, response) {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for preflight
    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }

    const { url } = request.query;

    if (!url) {
        response.status(400).json({ error: 'Missing "url" query parameter' });
        return;
    }

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
        }

        const html = await res.text();

        // Set content type to text/plain to avoid browser interpretation
        response.setHeader('Content-Type', 'text/plain');
        response.status(200).send(html);
    } catch (error) {
        console.error('Proxy error:', error);
        response.status(500).json({ error: error.message });
    }
}
