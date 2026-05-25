import Application from '../models/Application.js';
import { sendDeadlineReminder } from './mailer.js';

export async function checkDeadlines() {
  const now = new Date();
  const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const apps = await Application.find({
    deadline: { $gte: now, $lte: in24h },
    status: { $nin: ['offer', 'rejected', 'withdrawn'] },
  }).populate('user', 'email name');

  const byUser = {};
  for (const app of apps) {
    const uid = app.user._id.toString();
    if (!byUser[uid]) byUser[uid] = { user: app.user, apps: [] };
    byUser[uid].apps.push(app);
  }

  const entries = Object.values(byUser);
  if (entries.length === 0) {
    console.log('[deadlineReminder] No upcoming deadlines in the next 24 h');
    return;
  }

  for (const { user, apps } of entries) {
    try {
      await sendDeadlineReminder(user.email, user.name, apps);
      console.log(`[deadlineReminder] Sent to ${user.email} (${apps.length} app${apps.length > 1 ? 's' : ''})`);
    } catch (err) {
      console.error(`[deadlineReminder] Failed for ${user.email}:`, err.message);
    }
  }
}
