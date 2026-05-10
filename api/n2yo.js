// Vercel serverless proxy for N2YO API
// Keeps API key server-side and fixes CORS
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { path } = req.query;
  if (!path) { res.status(400).json({ error: 'Missing path param' }); return; }

  const N2YO_KEY = process.env.N2YO_KEY;
  if (!N2YO_KEY) { res.status(500).json({ error: 'N2YO_KEY not configured' }); return; }

  const upstream = `https://api.n2yo.com/rest/v1/satellite/${path}&apiKey=${N2YO_KEY}`;
  try {
    const response = await fetch(upstream);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Upstream error', detail: err.message });
  }
}
