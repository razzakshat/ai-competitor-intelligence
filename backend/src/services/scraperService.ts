import axios from "axios";
import * as cheerio from "cheerio";
import crypto from "crypto";

export const scrapeWebsite = async (url: string): Promise<string> => {
  try {
    console.log(`🌐 Scraping: ${url}`);

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Remove noise
    $("script").remove();
    $("style").remove();
    $("nav").remove();
    $("footer").remove();
    $("header").remove();

    // Extract meaningful text
    const text = $("body").text();

    // Clean up whitespace
    const cleaned = text
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 8000);

    console.log(`✅ Scraped ${cleaned.length} characters from ${url}`);
    return cleaned;
  } catch (error: any) {
    console.error(`❌ Failed to scrape ${url}:`, error.message);
    throw new Error(`Scraping failed: ${error.message}`);
  }
};

export const generateContentHash = (content: string): string => {
  return crypto.createHash("md5").update(content).digest("hex");
};