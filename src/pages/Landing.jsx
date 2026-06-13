import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

export default function Landing() {
  const { user } = useAuth()
  return (
    <div className="wrap fade-in">
      <div className="topbar">
        <span className="logo">Talk to Me</span>
        <nav>
          {user ? <Link to="/dashboard">Dashboard</Link> : <Link to="/login">Sign in</Link>}
        </nav>
      </div>

      <p className="eyebrow">Scheduling, minus the back-and-forth</p>
      <h1 style={{ margin: '0.6rem 0 1.2rem', maxWidth: '12ch' }}>
        Share a link. Get booked.
      </h1>
      <p className="muted" style={{ fontSize: '1.2rem', maxWidth: '50ch', marginBottom: '2rem' }}>
        Give people one link and let them grab a 15-minute slot on your calendar — no emails,
        no double-bookings. Each account gets its own public booking page.
      </p>

      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
        <Link to="/login"><button className="primary">Create your page →</button></Link>
        <a href="/book/demo"><button className="ghost">See a live example</button></a>
      </div>

      <hr className="divider" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div>
          <h3>Your own URL</h3>
          <p className="muted">Send people to talktome.app/book/your-name. They pick a time, you get the booking.</p>
        </div>
        <div>
          <h3>No double-booking</h3>
          <p className="muted">Taken slots disappear automatically. The database enforces one booking per slot.</p>
        </div>
        <div>
          <h3>Set your hours</h3>
          <p className="muted">Choose your workdays, start and end time, and slot length from the dashboard.</p>
        </div>
      </div>
    </div>
  )
}
