import { useRef, useCallback } from 'react'

/**
 * Custom hook for managing a search input element with `useRef`.
 *
 * @returns {Object} - An object containing:
 *  - `inputRef`: A ref to attach to the search input element.
 *  - `focusInput`: A function to focus the input element.
 */
function useSearch() {
  const inputRef = useRef(null)

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return {
    inputRef,
    focusInput,
  }
}

export default useSearch
