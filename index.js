require('dotenv').config();
const express = require('express');
const scrapeTikTok = require('./scraper');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/tiktok', async (req, res) => {
  const { url, apikey } = req.query;

  if (!apikey || apikey !== process.env.API_KEY) {
    return res
      .status(403)
      .json({ status: false, message: 'Invalid or missing API key' });
  }

  if (!url) {
    return res
      .status(400)
      .json({ status: false, message: 'Missing TikTok video URL' });
  }

  const result = await scrapeTikTok(url);
  res.json(result);
});

app.get('/', (req, res) => {
  res.send(
    '<h2>TikTok Downloader API</h2><p>Use <code>/api/tiktok?url=&apikey=</code></p>'
  );
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
