import { useState, useEffect } from 'react'

const DATE_LABEL = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const API = 'https://hn.algolia.com/api/v1/search_by_date?query=artificial+intelligence&tags=story&hitsPerPage=10'

function domain(url) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return '' }
}

export function useAINews() {
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => {
        setHeadlines(
          data.hits
            .filter(h => h.url && h.title)
            .slice(0, 5)
            .map(h => ({ title: h.title, url: h.url, source: domain(h.url) }))
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { headlines, loading, dateLabel: DATE_LABEL }
}
