import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

export default function Landing() {
  const { user } = useAuth()
  const { t } = useLanguage()

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

      <p className="eyebrow">{t.landing_eyebrow}</p>
      <h1 style={{ margin: '0.6rem 0 1.2rem', maxWidth: '12ch' }}>
        {t.landing_heading}
      </h1>
      <p className="muted" style={{ fontSize: '1.2rem', maxWidth: '50ch', marginBottom: '2rem' }}>
        {t.landing_desc}
      </p>

      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
        <Link to="/login"><button className="primary">{t.landing_cta_primary}</button></Link>
        <a href="/book/demo"><button className="ghost">{t.landing_cta_secondary}</button></a>
      </div>

      <hr className="divider" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div>
          <h3>{t.landing_feat1_title}</h3>
          <p className="muted">{t.landing_feat1_desc}</p>
        </div>
        <div>
          <h3>{t.landing_feat2_title}</h3>
          <p className="muted">{t.landing_feat2_desc}</p>
        </div>
        <div>
          <h3>{t.landing_feat3_title}</h3>
          <p className="muted">{t.landing_feat3_desc}</p>
        </div>
      </div>
    </div>
  )
}
