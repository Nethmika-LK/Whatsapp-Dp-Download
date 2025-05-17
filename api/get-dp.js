import cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { number } = req.query;

  if (!number || !/^\d+$/.test(number)) {
    return res.status(400).json({ success: false, message: 'Invalid number format' });
  }

  try {
    const response = await fetch('https://toolzin.com/tools/whatsapp-dp-downloader', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
      },
      body: `number=${number}`
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const dpUrl = $('.download-btn').attr('href');

    if (!dpUrl || !dpUrl.startsWith('https')) {
      return res.status(404).json({ success: false, message: 'DP not found' });
    }

    return res.status(200).json({ success: true, dpUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
