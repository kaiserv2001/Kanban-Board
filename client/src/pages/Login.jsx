import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const DEMO_EMAIL = 'demo@demo.com';
const DEMO_PASSWORD = 'demo1234';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(DEMO_EMAIL, DEMO_PASSWORD);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign In</h1>
        {error && (
          <p className="error-msg" data-testid="login-error">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              data-testid="login-email-input"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              data-testid="login-password-input"
              type="password"
              placeholder="Your password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button
            className="btn btn-primary"
            data-testid="login-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div
          data-testid="demo-box"
          style={{
            marginTop: 20,
            padding: 16,
            border: '1px dashed #cbd5e1',
            borderRadius: 8,
            background: '#f8fafc',
          }}
        >
          <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14 }}>
            👋 Just exploring? Use the demo account
          </p>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b' }}>
            No sign-up needed. Email <code>{DEMO_EMAIL}</code> · Password <code>{DEMO_PASSWORD}</code>
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            data-testid="demo-login-btn"
            onClick={handleDemoLogin}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Signing in…' : 'Sign in as demo'}
          </button>
        </div>

        <p className="auth-footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
