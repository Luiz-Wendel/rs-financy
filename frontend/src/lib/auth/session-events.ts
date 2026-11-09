const SESSION_EXPIRED = 'financy:session-expired'

/** Fired by the Apollo error link when the API rejects the token. */
export function notifySessionExpired() {
  window.dispatchEvent(new Event(SESSION_EXPIRED))
}

export function onSessionExpired(listener: () => void) {
  window.addEventListener(SESSION_EXPIRED, listener)
  return () => window.removeEventListener(SESSION_EXPIRED, listener)
}
