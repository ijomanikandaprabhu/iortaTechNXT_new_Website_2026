import { logger } from "@/lib/logger";

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  /** Abort after this many ms. */
  timeoutMs?: number;
};

/**
 * Thin JSON HTTP wrapper shared by every external integration. Keeps timeout,
 * error shape, and logging consistent so CRM clients stay tiny.
 */
export async function httpJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body, timeoutMs = 10_000 } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await res.text();
    const parsed = text ? safeJsonParse(text) : null;

    if (!res.ok) {
      logger.error("http request failed", { url, status: res.status });
      throw new HttpError(`Request to ${url} failed with ${res.status}`, res.status, parsed);
    }

    return parsed as T;
  } finally {
    clearTimeout(timer);
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
