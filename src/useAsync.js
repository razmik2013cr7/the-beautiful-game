import { useEffect, useState, useCallback } from 'react'

export function useAsync(fn, deps = []) {
  const [data, setData] = useState()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    let cancelled = false
    setLoading(true)
    Promise.resolve()
      .then(fn)
      .then((d) => {
        if (!cancelled) {
          setData(d)
          setError(null)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    const cancel = refresh()
    return cancel
  }, [refresh])

  return { data, error, loading, refresh }
}
