const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTikTok(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 10; Mobile; rv:106.0) Gecko/106.0 Firefox/106.0',
      },
    });

    const $ = cheerio.load(response.data);
    const scriptData = $('script[id="__NEXT_DATA__"]').html();
    if (!scriptData) return { status: false, message: 'No video data found in page.' };

    const json = JSON.parse(scriptData);
    const videoData = json.props.pageProps.itemInfo.itemStruct;

    return {
      status: true,
      title: videoData.desc,
      author: videoData.author.uniqueId,
      nickname: videoData.author.nickname,
      video: {
        nowm: videoData.video.playAddr,
        wm: videoData.video.downloadAddr,
        cover: videoData.video.cover,
      },
    };
  } catch (err) {
    return { status: false, message: err.message };
  }
}

module.exports = scrapeTikTok;
