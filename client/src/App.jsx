import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import Navbar from './components/common/Navbar.jsx';
import DemoNotice from './components/common/DemoNotice.jsx';
import Spinner from './components/common/Spinner.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Applications from './pages/Applications.jsx';
import KanbanPage from './pages/KanbanPage.jsx';
import ApplicationDetail from './pages/ApplicationDetail.jsx';

const Private = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

// Login / Register are for logged-out users only — redirect to the dashboard
// if a session is already active.
const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <Navigate to="/" replace /> : children;
};

export default function App() {
  return (
    <>
      <Navbar />
      <DemoNotice />
      <Routes>
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/" element={<Private><Dashboard /></Private>} />
        <Route path="/applications" element={<Private><Applications /></Private>} />
        <Route path="/kanban" element={<Private><KanbanPage /></Private>} />
        <Route path="/applications/:id" element={<Private><ApplicationDetail /></Private>} />
      </Routes>
    </>
  );
}
