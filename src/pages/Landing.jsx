import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useAINews } from '../lib/aiNews.js'

const features = (t) => [
  { num: '01', title: t.landing_feat1_title, desc: t.landing_feat1_desc },
  { num: '02', title: t.landing_feat2_title, desc: t.landing_feat2_desc },
  { num: '03', title: t.landing_feat3_title, desc: t.landing_feat3_desc },
]

export default function Landing() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { headlines, loading, dateLabel } = useAINews()

  return (
    <div className="wrap fade-in">
      <div className="topbar">
        <span className="logo">Talk to Me</span>
        <nav>
          {user
            ? <Link to="/dashboard">{t.nav_dashboard}</Link>
            : <Link to="/login">{t.nav_signin}</Link>}
        </nav>
      </div>

      <section className="news-section">
        <p className="eyebrow">AI News — {dateLabel}</p>
        {loading
          ? <p className="muted news-loading">Loading…</p>
          : headlines.length > 0
            ? <ul className="news-list">
                {headlines.map((h, i) => (
                  <li key={i}>
                    <a href={h.url} target="_blank" rel="noopener noreferrer">{h.title}</a>
                    {h.source && <span className="news-source">{h.source}</span>}
                  </li>
                ))}
              </ul>
            : <p className="muted">No headlines right now.</p>
        }
      </section>

      <hr className="divider" />

      <section className="landing-hero">
        <h1 className="landing-heading">{t.landing_heading}</h1>
        <p className="muted landing-desc">{t.landing_desc}</p>
        <div className="cta-row">
          <Link to="/login"><button className="primary">{t.landing_cta_primary}</button></Link>
          <a href="/book/demo"><button className="ghost">{t.landing_cta_secondary}</button></a>
        </div>
      </section>

      <hr className="divider" />

      <div className="feat-grid">
        {features(t).map(({ num, title, desc }) => (
          <div key={num} className="feat-card">
            <span className="feat-num">{num}</span>
            <h3>{title}</h3>
            <p className="muted">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
