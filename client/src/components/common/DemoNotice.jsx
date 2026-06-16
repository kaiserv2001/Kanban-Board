import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';

const DEMO_EMAIL = 'demo@demo.com';

// Dismissible info bar shown to logged-in users. Makes the demo/auto-cleanup
// behaviour explicit so reviewers know their data is temporary.
export default function DemoNotice() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!user || dismissed) return null;

  const isDemoAccount = user.email === DEMO_EMAIL;
  const message = isDemoAccount
    ? 'You are signed in to the shared demo account. Anyone can view and edit this data, so treat it as a sandbox.'
    : 'Demo project — for demonstration purposes only. This account and all its data are automatically deleted 48 hours after sign-up.';

  return (
    <div
      data-testid="demo-notice"
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        background: '#fef3c7',
        color: '#92400e',
        fontSize: 14,
        borderBottom: '1px solid #fcd34d',
      }}
    >
      <span style={{ fontSize: 16 }}>ℹ️</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#92400e',
          cursor: 'pointer',
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
