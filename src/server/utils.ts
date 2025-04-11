import * as cheerio from 'cheerio';

interface FetchResult {
  $: cheerio.CheerioAPI;
  html: string;
  url: string;
  status: number;
}

export async function fetchHtml(
  url: string,
  options: {
    timeout?: number;
    headers?: Record<string, string>;
  } = {}
): Promise<FetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? 5000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        // 'User-Agent': 'Mozilla/5.0 (compatible; MyParser/1.0)',
        ...options.headers,
      },
      redirect: 'follow',
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/html')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    return {
      $,
      html,
      url: response.url, // Final URL after redirects
      status: response.status,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    // console.error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
