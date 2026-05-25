import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : '';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" data-testid="nav-dashboard">Dashboard</Link>
      <Link to="/applications" data-testid="nav-applications">Applications</Link>
      <Link to="/kanban" data-testid="nav-kanban">Kanban</Link>
      <span className="nav-end">
        <button
          className="btn-icon"
          data-testid="dark-mode-toggle"
          onClick={() => setDark(d => !d)}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? '☀️' : '🌙'}
        </button>
        {user
          ? <>
              <span data-testid="nav-username">{user.name}</span>
              <button data-testid="nav-logout-btn" onClick={handleLogout}>Logout</button>
            </>
          : <Link to="/login">Sign In</Link>
        }
      </span>
    </nav>
  );
}
