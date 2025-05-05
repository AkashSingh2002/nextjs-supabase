import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Fetch the page content
    const { data: html } = await axios.get(url);

    // Extract title using OpenGraph or fallback to <title>
    const ogTitleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = ogTitleMatch ? ogTitleMatch[1] : titleMatch ? titleMatch[1] : 'No title found';

    // Extract favicon using OpenGraph or fallback to /favicon.ico
    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/);
    const favicon = ogImageMatch ? ogImageMatch[1] : new URL('/favicon.ico', url).href;

    // Generate summary using Jina AI
    const encodedUrl = encodeURIComponent(url);
    let summary;
    try {
      const summaryResponse = await axios.get(`https://r.jina.ai/http://${encodedUrl}`);
      summary = summaryResponse.data || 'No summary available';
    } catch {
      summary = 'Summary temporarily unavailable.';
    }

    res.status(200).json({ title, favicon, summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}