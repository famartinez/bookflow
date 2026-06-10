import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import { fmtDay, fmtTime } from '../lib/scheduling'
import ConnectGoogleButton from '../components/ConnectGoogleButton';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (prof) {
        setProfile(prof)
        const { data: bk } = await supabase
          .from('bookings')
          .select('*')
          .eq('host_id', user.id)
          .eq('status', 'confirmed')
          .gte('start_time', new Date().toISOString())
          .order('start_time')
        setBookings(bk || [])
      } else {
        // new user: prefill a blank profile
        const suggestedSlug = (user.email || 'me').split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase()
        setProfile({
          id: user.id,
          slug: suggestedSlug,
          display_name: '',
          bio: '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          day_start: 9,
          day_end: 17,
          slot_minutes: 15,
          workdays: [1, 2, 3, 4, 5],
          _isNew: true,
        })
      }
      setLoading(false)
    })()
  }, [user])
useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get('google')
    if (flag === 'connected') {
      setMsg('Google Calendar connected ✅')
      window.history.replaceState({}, '', '/dashboard')
    } else if (flag === 'error') {
      setMsg('Google connection failed — please try again.')
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [])
  async function save() {
    setMsg('')
    if (!profile.display_name.trim() || !profile.slug.trim()) {
      setMsg('Name and URL slug are required.')
      return
    }
    setSaving(true)
    const payload = {
      id: user.id,
      slug: profile.slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      display_name: profile.display_name.trim(),
      bio: profile.bio?.trim() || null,
      timezone: profile.timezone,
      day_start: Number(profile.day_start),
      day_end: Number(profile.day_end),
      slot_minutes: Number(profile.slot_minutes),
      workdays: profile.workdays,
    }
    const { error } = await supabase.from('profiles').upsert(payload)
    setSaving(false)
    if (error) {
      setMsg(error.message.includes('duplicate') ? 'That URL is taken — try another.' : error.message)
    } else {
      setMsg('Saved.')
      setProfile({ ...profile, ...payload, _isNew: false })
    }
  }

  function toggleDay(d) {
    const has = profile.workdays.includes(d)
    setProfile({
      ...profile,
      workdays: has ? profile.workdays.filter((x) => x !== d) : [...profile.workdays, d].sort(),
    })
  }

  async function cancelBooking(id) {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    setBookings(bookings.filter((b) => b.id !== id))
  }

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return <div className="wrap muted">Loading…</div>

  const bookingUrl = `${window.location.origin}/book/${profile.slug}`

  return (
    <div className="wrap-wide fade-in">
      <div className="topbar">
        <Link to="/" className="logo" style={{ color: 'var(--ink)' }}>BookFlow</Link>
        <button className="ghost" onClick={signOut}>Sign out</button>
      </div>

      <p className="eyebrow">Your booking page</p>
      <h1 style={{ margin: '0.4rem 0 1.5rem' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '2rem', alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Settings</h3>

          <div className="field">
            <label>Calendar</label>
            <ConnectGoogleButton />
          </div>

          <div className="field">
            <label>Display name</label>
            <input value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} placeholder="Frank Martinez" />
          </div>
          <div className="field">
            <label>Booking URL slug</label>
            <input value={profile.slug} onChange={(e) => setProfile({ ...profile, slug: e.target.value })} placeholder="frank" />
            <p className="muted" style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>{bookingUrl}</p>
          </div>
          <div className="field">
            <label>Short bio (optional)</label>
            <textarea rows={2} value={profile.bio || ''} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Let's talk about your project." />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Day starts</label>
              <select value={profile.day_start} onChange={(e) => setProfile({ ...profile, day_start: e.target.value })} style={selectStyle}>
                {hourOptions()}
              </select>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Day ends</label>
              <select value={profile.day_end} onChange={(e) => setProfile({ ...profile, day_end: e.target.value })} style={selectStyle}>
                {hourOptions()}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Slot length</label>
            <select value={profile.slot_minutes} onChange={(e) => setProfile({ ...profile, slot_minutes: e.target.value })} style={selectStyle}>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <div className="field">
            <label>Available days</label>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {DAYS.map((d, i) => (
                <button key={i} onClick={() => toggleDay(i)} className={profile.workdays.includes(i) ? 'primary' : 'ghost'} style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {msg && <p className={msg === 'Saved.' ? 'muted' : 'error'}>{msg}</p>}
          <button className="primary" onClick={save} disabled={saving} style={{ width: '100%', marginTop: '0.5rem' }}>
            {saving ? 'Saving…' : profile._isNew ? 'Create my page' : 'Save changes'}
          </button>
          {!profile._isNew && (
            <a href={bookingUrl} target="_blank" rel="noreferrer">
              <button className="ghost" style={{ width: '100%', marginTop: '0.6rem' }}>View my public page ↗</button>
            </a>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Upcoming bookings</h3>
          {profile._isNew ? (
            <p className="muted">Save your page first, then share your link to start getting bookings.</p>
          ) : bookings.length === 0 ? (
            <p className="muted">No upcoming bookings yet. Share your link!</p>
          ) : (
            bookings.map((b) => (
              <div className="booking-row" key={b.id}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)' }}>{b.guest_name}</div>
                  <div className="muted" style={{ fontSize: '0.85rem' }}>
                    {fmtDay(new Date(b.start_time))} · {fmtTime(new Date(b.start_time))}
                  </div>
                  <div className="muted" style={{ fontSize: '0.8rem' }}>{b.guest_email}</div>
                  {b.notes && <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>“{b.notes}”</div>}
                </div>
                <button className="ghost" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} onClick={() => cancelBooking(b.id)}>Cancel</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const selectStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1px solid var(--line)',
  borderRadius: '2px',
  background: 'var(--card)',
  color: 'var(--ink)',
}

function hourOptions() {
  const opts = []
  for (let h = 0; h <= 23; h++) {
    const label = h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`
    opts.push(<option key={h} value={h}>{label}</option>)
  }
  return opts
}
