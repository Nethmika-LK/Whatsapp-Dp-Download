import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { number } = req.query;
  if (!number) {
    return res.status(400).json({ success: false, message: 'Number query param required' });
  }

  try {
    const url = `https://toolzin.com/tools/whatsapp-dp-downloader?number=${number}`;

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(response.data);
    const dpUrl = $('img.avatar').attr('src');

    if (dpUrl) {
      return res.status(200).json({ success: true, dpUrl });
    } else {
      return res.status(404).json({ success: false, message: 'DP not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching DP' });
  }
}
