const TOKEN_KEY = 'financy:token'

/**
 * Keeps the session token. With "Lembrar-me" it survives closing the browser (localStorage);
 * otherwise it lasts only for the tab session (sessionStorage).
 */
export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
  },

  set(token: string, { remember }: { remember: boolean }) {
    this.clear()
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(TOKEN_KEY, token)
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  },
}
