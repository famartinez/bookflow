import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // adjust to wherever your supabase client lives

export default function ConnectGoogleButton() {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);

    // Get the logged-in host's user id so the callback knows who's connecting
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in first.');
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({
      client_id: '657033476930-rar6vh58piftdrsk0ibcrjs06jbs0b37.apps.googleusercontent.com',
      redirect_uri: `${window.location.origin}/api/google/callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar.events',
      access_type: 'offline',
      prompt: 'consent',
      state: user.id,
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  return (
    <button onClick={handleConnect} disabled={loading}>
      {loading ? 'Redirecting…' : '📅 Connect Google Calendar'}
    </button>
  );
}