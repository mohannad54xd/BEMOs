import express from 'express';
import fetch from 'node-fetch';
import { URL } from 'url';

const app = express();
const port = process.env.PORT || 5174;

// Simple proxy for WMTS GetCapabilities to avoid CORS and allow server-side parsing
app.get('/api/wmts/capabilities', async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') return res.status(400).send('Missing url param');
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    res.set('Content-Type', 'application/xml');
    res.send(text);
  } catch (err) {
    res.status(500).send(String(err));
  }
});

// Basic tile proxy to forward tile requests (preserve binary)
app.get('/api/tiles/*', async (req, res) => {
  try {
    const targetPath = req.params[0];
    if (!targetPath) return res.status(400).send('Missing tile path');
    const targetUrl = `https://${targetPath}`; // expect path like gibs-a.earthdata.nasa.gov/wmts/...
    const resp = await fetch(targetUrl);
    const buffer = await resp.arrayBuffer();
    res.set('Content-Type', resp.headers.get('content-type') || 'image/png');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send(String(err));
  }
});

app.listen(port, () => {
  console.log(`Server proxy listening on http://localhost:${port}`);
});
