const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "loku2006";

app.get("/api/fdown", async (req, res) => {
  const fbUrl = req.query.url;
  const key = req.query.key;

  if (!fbUrl || !key) {
    return res.json({
      status: false,
      owner: "loku",
      error: "Missing url or API key"
    });
  }

  if (key !== API_KEY) {
    return res.json({
      status: false,
      owner: "loku",
      error: "Invalid API key"
    });
  }

  try {
    const { data } = await axios.post(
      "https://fdown.net/download.php",
      new URLSearchParams({ URLz: fbUrl }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const $ = cheerio.load(data);
    const result = {
      status: true,
      owner: "loku",
      data: {
        success: false,
        thumbnail: $("div.thumbnail img").attr("src") || null,
        duration: null,
        sd: null,
        hd: null,
        mp3: null
      }
    };

    $("a.download-button").each((_, el) => {
      const text = $(el).text().toLowerCase();
      const href = $(el).attr("href");
      if (text.includes("hd")) result.data.hd = href;
      else if (text.includes("sd")) result.data.sd = href;
      else if (text.includes("audio") || text.includes("mp3")) result.data.mp3 = href;
    });

    const durationText = $("div.card-header").text().trim();
    if (durationText.includes("Duration")) {
      result.data.duration = durationText.split(":").pop().trim();
    }

    if (result.data.sd || result.data.hd) {
      result.data.success = true;
    }

    res.json(result);

  } catch (error) {
    res.json({
      status: false,
      owner: "loku",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
