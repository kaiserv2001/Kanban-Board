import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

const transporter = (SMTP_USER && SMTP_PASS)
  ? nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

export async function sendDeadlineReminder(to, name, applications) {
  if (!transporter) {
    console.log('[mailer] SMTP not configured — skipping reminder email');
    return;
  }
  const list = applications
    .map(a => `  • ${a.company} — ${a.role} (deadline: ${a.deadline.toDateString()})`)
    .join('\n');
  await transporter.sendMail({
    from: `"Job Hunt Tracker" <${SMTP_USER}>`,
    to,
    subject: `Deadline reminder: ${applications.length} application${applications.length > 1 ? 's' : ''} due tomorrow`,
    text: `Hi ${name},\n\nYou have upcoming deadline${applications.length > 1 ? 's' : ''} tomorrow:\n\n${list}\n\nGood luck!\n— Job Hunt Tracker`,
  });
}
