const axios = require('axios');

module.exports = async (req, res) => {
  const { url, key } = req.query;

  if (key !== 'loku2006') {
    return res.status(403).json({ status: false, error: 'Invalid API key' });
  }

  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ status: false, error: 'Missing or invalid TikTok URL' });
  }

  try {
    const response = await axios.get(`https://toolzin.com/api/tiktok?url=${encodeURIComponent(url)}`);

    const data = response.data;

    if (!data || !data.video || !data.video.nowm) {
      return res.status(500).json({ status: false, error: 'Failed to fetch valid video info' });
    }

    return res.status(200).json({
      status: true,
      title: data.title,
      author: data.author,
      nickname: data.nickname,
      video: {
        nowm: data.video.nowm,
        wm: data.video.wm,
        image: data.video.cover
      }
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: 'Error scraping video' });
  }
};
