import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url, apikey } = req.query;

  if (apikey !== 'loku2006') {
    return res.status(403).json({ status: false, message: 'Invalid API Key' });
  }

  if (!url) {
    return res.status(400).json({ status: false, message: 'Missing TikTok URL' });
  }

  try {
    const response = await fetch(`https://api-dark-shan-yt.koyeb.app/download/tiktok?url=${encodeURIComponent(url)}&apikey=edbcfabbca5a9750`);
    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: 'API request failed', error: error.message });
  }
                                                                                                              }
