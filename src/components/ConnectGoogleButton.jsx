import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function ConnectGoogleButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleConnect = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert(t.google_login_first);
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
      {loading ? t.google_redirecting : t.google_connect}
    </button>
  );
}
