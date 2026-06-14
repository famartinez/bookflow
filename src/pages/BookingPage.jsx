import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { upcomingDays, slotsForDay, endTime, fmtTime, fmtDay, fmtDayShort } from '../lib/scheduling'
import { useLanguage } from '../contexts/LanguageContext.jsx'

export default function BookingPage() {
  const { slug } = useParams()
  const { t } = useLanguage()
  const [profile, setProfile] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [taken, setTaken] = useState(new Set())
  const [step, setStep] = useState('pick') // pick | form | done
  const [form, setForm] = useState({ name: '', email: '', notes: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.from('profiles').select('*').eq('slug', slug).maybeSingle()
      if (!data) { setNotFound(true); return }
      setProfile(data)
      const days = upcomingDays(data)
      setSelectedDay(days[0] || null)
    })()
  }, [slug])

  useEffect(() => {
    if (!profile || !selectedDay) return
    ;(async () => {
      const from = new Date(selectedDay); from.setHours(0, 0, 0, 0)
      const to = new Date(selectedDay); to.setHours(23, 59, 59, 999)
      const { data } = await supabase.rpc('taken_slots', {
        p_host: profile.id,
        p_from: from.toISOString(),
        p_to: to.toISOString(),
      })
      setTaken(new Set((data || []).map((r) => new Date(r.start_time).getTime())))
    })()
  }, [profile, selectedDay, step])

  async function confirm() {
    setErr('')
    if (!form.name.trim() || !/.+@.+\..+/.test(form.email)) {
      setErr(t.book_err_invalid)
      return
    }
    setBusy(true)
    const start = selectedSlot
    const end = endTime(profile, start)
    const { error } = await supabase.from('bookings').insert({
      host_id: profile.id,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      guest_name: form.name.trim(),
      guest_email: form.email.trim(),
      notes: form.notes.trim() || null,
    })
    setBusy(false)
    if (error) {
      setErr(error.code === '23505' ? t.book_err_taken : error.message)
      if (error.code === '23505') { setStep('pick'); setSelectedSlot(null) }
    } else {
      fetch('/api/google/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostId: profile.id,
          guestName: form.name.trim(),
          guestEmail: form.email.trim(),
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          timezone: profile.timezone,
          notes: form.notes.trim() || null,
        }),
      }).catch(() => {})
      setStep('done')
    }
  }

  if (notFound) {
    return (
      <div className="wrap fade-in" style={{ textAlign: 'center' }}>
        <h1>{t.book_not_found}</h1>
        <p className="muted">{t.book_not_found_desc}</p>
        <Link to="/"><button className="ghost" style={{ marginTop: '1rem' }}>{t.book_go_home}</button></Link>
      </div>
    )
  }
  if (!profile) return <div className="wrap muted">{t.loading}</div>

  const days = upcomingDays(profile)
  const slots = selectedDay ? slotsForDay(profile, selectedDay) : []

  return (
    <div className="wrap fade-in" style={{ maxWidth: 620 }}>
      <p className="eyebrow">{t.book_eyebrow(profile.slot_minutes)}</p>
      <h1 style={{ margin: '0.4rem 0 0.3rem' }}>{profile.display_name}</h1>
      {profile.bio && <p className="muted" style={{ marginBottom: '1.5rem' }}>{profile.bio}</p>}
      <hr className="divider" style={{ margin: '1.2rem 0' }} />

      {step === 'pick' && (
        <>
          <h3 style={{ marginBottom: '0.7rem' }}>{t.book_pick_day}</h3>
          <div className="day-grid" style={{ marginBottom: '1.8rem' }}>
            {days.map((d) => {
              const { dow, date } = fmtDayShort(d)
              const active = selectedDay && d.toDateString() === selectedDay.toDateString()
              return (
                <button key={d.toISOString()} className={`day-btn ${active ? 'active' : 'ghost'}`} onClick={() => setSelectedDay(d)}>
                  <span className="dow">{dow}</span>
                  <span className="date">{date}</span>
                </button>
              )
            })}
          </div>

          <h3 style={{ marginBottom: '0.7rem' }}>{selectedDay && fmtDay(selectedDay)}</h3>
          {slots.length === 0 ? (
            <p className="muted">{t.book_no_times}</p>
          ) : (
            <div className="slot-grid">
              {slots.map((s) => {
                const isTaken = taken.has(s.getTime())
                return (
                  <button key={s.toISOString()} disabled={isTaken} className="ghost"
                    onClick={() => { setSelectedSlot(s); setStep('form') }}>
                    {fmtTime(s)}
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}

      {step === 'form' && (
        <div className="fade-in">
          <button className="ghost" style={{ marginBottom: '1.2rem', fontSize: '0.85rem' }} onClick={() => setStep('pick')}>{t.book_back}</button>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <strong style={{ fontFamily: 'var(--font-display)' }}>{fmtDay(selectedSlot)}</strong>
            <br />{fmtTime(selectedSlot)} – {fmtTime(endTime(profile, selectedSlot))}
          </div>
          <div className="field">
            <label>{t.book_your_name}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>{t.book_your_email}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>{t.book_about}</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          {err && <p className="error">{err}</p>}
          <button className="primary" onClick={confirm} disabled={busy} style={{ width: '100%' }}>
            {busy ? t.book_confirming : t.book_confirm}
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div className="success-mark">✓</div>
          <h2>{t.book_done_heading}</h2>
          <p className="muted" style={{ marginTop: '0.4rem' }}>
            {fmtDay(selectedSlot)} · {fmtTime(selectedSlot)}
          </p>
          <p className="muted" style={{ fontSize: '0.9rem', marginTop: '0.8rem' }}>
            {t.book_done_hold(profile.display_name)}
          </p>
          <button className="ghost" style={{ marginTop: '1.5rem' }} onClick={() => { setStep('pick'); setSelectedSlot(null); setForm({ name: '', email: '', notes: '' }) }}>
            {t.book_another}
          </button>
        </div>
      )}
    </div>
  )
}
