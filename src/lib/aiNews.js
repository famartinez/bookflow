import { useState, useEffect } from 'react'

const FEED = 'https://techcrunch.com/category/artificial-intelligence/feed/'
const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED)}&count=5`

export function useAINews() {
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok') {
          setHeadlines(data.items.map(item => ({ title: item.title, url: item.link })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { headlines, loading }
}
