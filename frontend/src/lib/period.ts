/** Current month in the user's timezone, as expected by the API ({ year, month: 1-12 }). */
export function getCurrentPeriod(now = new Date()) {
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}
