import type { CorsOptions } from 'cors'

/** "a, b,,c" → ["a", "b", "c"] */
export function parseList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

/** Allowed origins; "*" allows any origin. */
export function parseCorsOrigin(value: string): true | string[] {
  const origins = parseList(value)

  return origins.includes('*') ? true : origins
}

interface CorsConfig {
  /** Comma-separated origins or "*" */
  origin: string
  /** Comma-separated HTTP methods, sent in Access-Control-Allow-Methods */
  methods: string
  /** Sends Access-Control-Allow-Credentials (cookies/credentials in cross-origin requests) */
  credentials: boolean
}

export function buildCorsOptions({ origin, methods, credentials }: CorsConfig): CorsOptions {
  return {
    origin: parseCorsOrigin(origin),
    methods: parseList(methods).map((method) => method.toUpperCase()),
    credentials,
  }
}
