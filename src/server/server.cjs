const express = require('express');
const fetch = require('node-fetch');
const { URL } = require('url');

const app = express();
const port = process.env.PORT || 5174;
app.use(express.json({ limit: '2mb' }));

app.get('/api/wmts/capabilities', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url param');
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    res.set('Content-Type', 'application/xml');
    res.send(text);
  } catch (err) {
    res.status(500).send(String(err));
  }
});

app.get('/api/tiles/*', async (req, res) => {
  try {
    const targetPath = req.params[0];
    if (!targetPath) return res.status(400).send('Missing tile path');
    const targetUrl = `https://${targetPath}`;
    const resp = await fetch(targetUrl);
    const buffer = await resp.arrayBuffer();
    res.set('Content-Type', resp.headers.get('content-type') || 'image/png');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send(String(err));
  }
});

// Mosaic endpoint: accept JSON { templateUrl, z, x, y, format }
app.post('/api/mosaic', async (req, res) => {
  try {
    const { templateUrl, z, x, y, format = 'png' } = req.body;
    if (!templateUrl || z === undefined || x === undefined || y === undefined) {
      return res.status(400).send('Missing parameters');
    }

    const Jimp = require('jimp');
    const tileSize = 256;
    const canvas = new Jimp(tileSize * 3, tileSize * 3, 0x000000ff);

    const fetchTileBuffer = async (url) => {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Tile fetch failed');
      const ab = await resp.arrayBuffer();
      return Buffer.from(ab);
    };

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const tx = x + dx;
        const ty = y + dy;
        const url = templateUrl.replace('{z}', z).replace('{x}', tx).replace('{y}', ty);
        try {
          const buf = await fetchTileBuffer(url);
          const img = await Jimp.read(buf);
          const px = (dx + 1) * tileSize;
          const py = (dy + 1) * tileSize;
          canvas.composite(img, px, py);
        } catch (err) {
          // leave black
        }
      }
    }

    canvas.getBuffer(Jimp.MIME_PNG, (err, outBuffer) => {
      if (err) return res.status(500).send(String(err));
      res.set('Content-Type', 'image/png');
      res.send(outBuffer);
    });
  } catch (err) {
    res.status(500).send(String(err));
  }
});

app.listen(port, () => console.log(`Server proxy (CJS) listening on http://localhost:${port}`));
