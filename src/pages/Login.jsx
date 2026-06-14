import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  async function sendLink() {
    setErr('')
    if (!/.+@.+\..+/.test(email)) {
      setErr(t.login_invalid_email)
      return
    }
    setBusy(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/dashboard' },
    })
    setBusy(false)
    if (error) setErr(error.message)
    else setSent(true)
  }

  return (
    <div className="wrap fade-in" style={{ maxWidth: 460 }}>
      <div className="topbar">
        <Link to="/" className="logo" style={{ color: 'var(--ink)' }}>Talk to Me</Link>
      </div>
      <p className="eyebrow">{t.login_eyebrow}</p>
      <h1 style={{ margin: '0.5rem 0 1.5rem' }}>{t.login_heading}</h1>

      {sent ? (
        <div className="card">
          <h3>{t.login_check_heading}</h3>
          <p className="muted">{t.login_check_desc(email)}</p>
        </div>
      ) : (
        <div className="card">
          <div className="field">
            <label>{t.login_email_label}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.login_email_placeholder}
              onKeyDown={(e) => e.key === 'Enter' && sendLink()}
            />
          </div>
          {err && <p className="error">{err}</p>}
          <button className="primary" onClick={sendLink} disabled={busy} style={{ width: '100%' }}>
            {busy ? t.login_sending : t.login_send_btn}
          </button>
          <p className="muted" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
            {t.login_note}
          </p>
        </div>
      )}
    </div>
  )
}
