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

      <section className="landing-hero">
        <p className="eyebrow">{t.landing_eyebrow}</p>
        <h1 className="landing-heading">{t.landing_heading}</h1>
        <p className="muted landing-desc">{t.landing_desc}</p>
        <div className="cta-row">
          <Link to="/login"><button className="primary">{t.landing_cta_primary}</button></Link>
        </div>
      </section>
    </div>
  )
}
