import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url, apikey } = req.query;

  if (apikey !== 'loku2006') {
    return res.status(403).json({ status: false, message: 'Invalid API Key' });
  }

  if (!url) {
    return res.status(400).json({ status: false, message: 'TikTok URL is required' });
  }

  try {
    const api = `https://api-dark-shan-yt.koyeb.app/download/tiktok?url=${encodeURIComponent(url)}&apikey=edbcfabbca5a9750`;
    const response = await fetch(api);
    const json = await response.json();

    if (!json || !json.data || !json.data.play) {
      throw new Error('Invalid response from TikTok data source');
    }

    res.status(200).json({
      status: true,
      owner: '@darkshanyt1',
      data: json.data
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch TikTok data',
      error: err.message
    });
  }
}
