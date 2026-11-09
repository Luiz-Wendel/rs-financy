import { describe, expect, it } from 'vitest'

import { getPageNumbers, getPageRange } from './pagination'

describe('getPageNumbers', () => {
  it('shows every page when there are few pages', () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3])
  })

  it('centers the current page in the window', () => {
    expect(getPageNumbers(6, 10)).toEqual([4, 5, 6, 7, 8])
  })

  it('keeps the window inside the first and last pages', () => {
    expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5])
    expect(getPageNumbers(10, 10)).toEqual([6, 7, 8, 9, 10])
  })

  it('returns no pages when there are no results', () => {
    expect(getPageNumbers(1, 0)).toEqual([])
  })
})

describe('getPageRange', () => {
  it('returns the first and last item of the page', () => {
    expect(getPageRange(1, 10, 27)).toEqual({ from: 1, to: 10 })
    expect(getPageRange(3, 10, 27)).toEqual({ from: 21, to: 27 })
  })

  it('returns zeros when there are no results', () => {
    expect(getPageRange(1, 10, 0)).toEqual({ from: 0, to: 0 })
  })
})
