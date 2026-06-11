import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { hostId, guestName, guestEmail, startTime, endTime, timezone, notes } = req.body;

  try {
    // 1. Get the host's refresh token
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data: cred } = await supabase
      .from('google_credentials')
      .select('refresh_token, google_email')
      .eq('user_id', hostId)
      .maybeSingle();

    if (!cred) {
      // Host never connected Google — not an error, just skip calendar
      return res.status(200).json({ calendar: 'skipped' });
    }

    // 2. Swap refresh token for a fresh access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: cred.refresh_token,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
      }),
    });
    const { access_token } = await tokenRes.json();
    if (!access_token) {
      console.error('Token refresh failed for host', hostId);
      return res.status(200).json({ calendar: 'failed' });
    }

    // 3. Create the event — attendees + sendUpdates=all → Google emails both parties
    const eventRes = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: `BookFlow: ${guestName}`,
          description: notes || '',
          start: { dateTime: startTime, timeZone: timezone },
          end: { dateTime: endTime, timeZone: timezone },
          attendees: [{ email: guestEmail }],
          conferenceData: {
            createRequest: {
              requestId: `bookflow-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        }),
      }
    );
    const event = await eventRes.json();

    if (event.error) {
      console.error('Calendar API error:', event.error);
      return res.status(200).json({ calendar: 'failed' });
    }

    return res.status(200).json({
      calendar: 'created',
      eventId: event.id,
      meetLink: event.hangoutLink || null,
    });
  } catch (err) {
    console.error('create-event error:', err);
    return res.status(200).json({ calendar: 'failed' });
  }
}