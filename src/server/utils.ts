import * as cheerio from 'cheerio';

//common method

export async function fetchUrl(
  url: string,
  options: {
    timeout?: number;
    headers?: Record<string, string>;
  } = {}
): Promise<Response> {
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
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    // console.error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

////////////////

interface FetchHtmlResult {
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
): Promise<FetchHtmlResult> {

  try {
    const response = await fetchUrl(url,options);

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/html')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    return {
      $,
      html,
      url: response.url,
      status: response.status,
    };
  } catch (error) {
    throw new Error(`Failed to fetchHtml ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

//////////////

interface FetchJsonResult {
  data: any;
  url: string;
  status: number;
}

export async function fetchJson(
  url: string,
  options: {
    timeout?: number;
    headers?: Record<string, string>;
  } = {}
): Promise<FetchJsonResult> {

  try {
    const response = await fetchUrl(url,options);

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const json=await response.json();

    return {
      data:json,
      url: response.url,
      status: response.status,
    };
  } catch (error) {
    throw new Error(`Failed to fetchJson ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
