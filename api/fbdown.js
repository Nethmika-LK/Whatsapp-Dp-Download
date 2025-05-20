const cheerio = require("cheerio");
const fetch = require("node-fetch");
require('dotenv').config();

async function fbdown(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const params = new URLSearchParams();
      params.append('URLz', url);

      const res = await fetch('https://fdown.net/download.php', {
        method: 'POST',
        headers: {
          "Origin": "https://fdown.net",
          "Referer": "https://fdown.net/",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });

      if (!res.ok) return reject(new Error('Failed to fetch fdown.net'));

      const html = await res.text();
      const $ = cheerio.load(html);

      const thumb = $("#result img").attr("src") || null;
      const title = $("#result .lib-header").text().trim() || null;

      const descElem = $("#result div.lib-row").eq(1).text().trim() || "";
      let duration = null;
      const durationMatch = descElem.match(/Duration:\s*([\d:.]+)/i);
      if (durationMatch) {
        duration = durationMatch[1];
      }

      const sd = $("#sdlink").attr("href") || null;
      const hd = $("#hdlink").attr("href") || null;

      let mp3 = null;
      $("a").each((i, el) => {
        const href = $(el).attr("href");
        const text = $(el).text().toLowerCase();
        if (href && (text.includes("mp3") || text.includes("audio"))) {
          mp3 = href;
          return false;
        }
      });

      if (!sd && !hd && !mp3) return reject(new Error("No download links found"));

      const result = { thumb, title, desc: descElem, duration, sd };
      if (hd) result.hd = hd;
      if (mp3) result.mp3 = mp3;

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
}

function fbreg(url) {
  const fbRegex = /^(https?:\/\/)?(www\.)?(m\.facebook|facebook|fb)\.(com|me|watch)\/([\w\-\.\/?=&]+)/;
  return fbRegex.test(url);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST" });
  }

  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized. Invalid API key." });
  }

  const { url } = req.body;
  if (!url || !fbreg(url)) {
    return res.status(400).json({ error: "Invalid or missing Facebook video URL" });
  }

  try {
    const data = await fbdown(url);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
