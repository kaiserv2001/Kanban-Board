import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        {error && (
          <p className="error-msg" data-testid="register-error">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              data-testid="register-name-input"
              type="text"
              placeholder="Jane Smith"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              data-testid="register-email-input"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              data-testid="register-password-input"
              type="password"
              placeholder="8+ characters"
              required
              minLength={8}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button
            className="btn btn-primary"
            data-testid="register-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Have an account? <Link to="/login">Sign in</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: 4 }}>
          Just exploring? <Link to="/login">Use the demo account</Link> — no sign-up needed.
        </p>
      </div>
    </div>
  );
}
