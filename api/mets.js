// Vercel serverless function: returns the NY Mets' upcoming games for the
// bottom ticker.
//
// This runs on Vercel's servers (not the visitor's browser), so it can reach
// ESPN reliably and there's no browser CORS to fail. The response is cached at
// the edge and revalidated automatically, so the schedule stays current without
// any manual updates or weekly jobs. On any failure it returns an empty list so
// the frontend simply falls back to its default ticker text.

const METS_TEAM_ID = '21';
const SCHEDULE_URL =
  'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/21/schedule';

export default async function handler(req, res) {
  // Cache at the edge for an hour, and keep serving the stale copy for up to a
  // day while a fresh one is fetched in the background.
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 6000);
    const espnRes = await fetch(SCHEDULE_URL, { signal: ctrl.signal });
    clearTimeout(timeout);

    if (!espnRes.ok) {
      return res.status(200).json({ items: [] });
    }

    const data = await espnRes.json();
    const events = Array.isArray(data.events) ? data.events : [];
    const now = Date.now();

    const upcoming = events
      .map((ev) => {
        const comp = ev.competitions && ev.competitions[0];
        if (!comp) return null;
        const completed =
          comp.status && comp.status.type && comp.status.type.completed;
        if (completed) return null;
        const date = new Date(ev.date).getTime();
        // Skip anything already well underway or in the past.
        if (Number.isNaN(date) || date < now - 3 * 60 * 60 * 1000) return null;
        const competitors = comp.competitors || [];
        const team = competitors.find(
          (c) => String(c.team && c.team.id) === METS_TEAM_ID
        );
        const opp = competitors.find(
          (c) => String(c.team && c.team.id) !== METS_TEAM_ID
        );
        if (!team || !opp) return null;
        return { date, team, opp, raw: ev.date };
      })
      .filter(Boolean)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);

    const items = upcoming.map(({ team, opp, raw }) => {
      const oppName = (
        (opp.team && (opp.team.abbreviation || opp.team.shortDisplayName)) ||
        '?'
      ).toUpperCase();
      const homeAway = team.homeAway === 'home' ? 'vs' : '@';
      const when = new Date(raw).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'America/New_York',
      });
      return `METS ${homeAway} ${oppName} — ${when}`;
    });

    return res.status(200).json({ items });
  } catch (e) {
    return res.status(200).json({ items: [] });
  }
}
