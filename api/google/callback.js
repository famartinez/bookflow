import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { code, state: userId, error } = req.query;

  // Host clicked "Cancel" on Google's screen, or something went wrong
  if (error || !code || !userId) {
    return res.redirect('/dashboard?google=error');
  }

  try {
    // 1. Exchange the one-time code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `https://${req.headers.host}/api/google/callback`,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokenRes.json();

    if (!tokens.refresh_token) {
      console.error('No refresh token returned:', tokens);
      return res.redirect('/dashboard?google=error');
    }

    // 2. (Optional but nice) find out which Google account they connected
    let googleEmail = null;
    try {
      const meRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const me = await meRes.json();
      googleEmail = me.email || null;
    } catch {
      // not critical — ignore failures here
    }

    // 3. Save the refresh token (server-side, service role key)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error: dbError } = await supabase
      .from('google_credentials')
      .upsert({
        user_id: userId,
        refresh_token: tokens.refresh_token,
        google_email: googleEmail,
      });

    if (dbError) {
      console.error('Supabase save failed:', dbError);
      return res.redirect('/dashboard?google=error');
    }

    // 4. Back to the dashboard with the success flag
    return res.redirect('/dashboard?google=connected');
  } catch (err) {
    console.error('Callback error:', err);
    return res.redirect('/dashboard?google=error');
  }
}