import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  async function sendLink() {
    setErr('')
    if (!/.+@.+\..+/.test(email)) {
      setErr('Enter a valid email address.')
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
        <Link to="/" className="logo" style={{ color: 'var(--ink)' }}>BookFlow</Link>
      </div>
      <p className="eyebrow">Sign in or create an account</p>
      <h1 style={{ margin: '0.5rem 0 1.5rem' }}>Welcome</h1>

      {sent ? (
        <div className="card">
          <h3>Check your email</h3>
          <p className="muted">We sent a sign-in link to {email}. Click it to continue — no password needed.</p>
        </div>
      ) : (
        <div className="card">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              onKeyDown={(e) => e.key === 'Enter' && sendLink()}
            />
          </div>
          {err && <p className="error">{err}</p>}
          <button className="primary" onClick={sendLink} disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Sending…' : 'Send me a sign-in link'}
          </button>
          <p className="muted" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
            We use passwordless sign-in. First time? An account is created automatically.
          </p>
        </div>
      )}
    </div>
  )
}
