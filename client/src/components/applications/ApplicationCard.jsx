import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  wishlist:     { bg: '#f3f4f6', color: '#374151' },
  applied:      { bg: '#eff6ff', color: '#1d4ed8' },
  phone_screen: { bg: '#fffbeb', color: '#b45309' },
  technical:    { bg: '#fff7ed', color: '#c2410c' },
  final_round:  { bg: '#f5f3ff', color: '#6d28d9' },
  offer:        { bg: '#ecfdf5', color: '#065f46' },
  rejected:     { bg: '#fef2f2', color: '#b91c1c' },
  withdrawn:    { bg: '#f9fafb', color: '#6b7280' },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isWithin7Days(dateStr) {
  if (!dateStr) return false;
  const deadline = new Date(dateStr);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
}

export default function ApplicationCard({ application, onEdit, onDelete }) {
  const { id, company, role, status, appliedDate, deadline } = application;
  const statusStyle = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
  const deadlineSoon = isWithin7Days(deadline);

  return (
    <div className="app-card">
      <div className="app-card-header">
        <div>
          <p className="app-card-title" data-testid="card-company">{company}</p>
          <p className="app-card-role" data-testid="card-role">{role}</p>
        </div>
        <div className="app-card-actions">
          <Link
            to={`/applications/${id}`}
            className="btn-icon"
            data-testid={`detail-btn-${id}`}
            title="View details"
          >🔍</Link>
          <button
            className="btn-icon"
            data-testid={`edit-btn-${id}`}
            onClick={onEdit}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="btn-icon danger"
            data-testid={`delete-btn-${id}`}
            onClick={onDelete}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="app-card-meta">
        <span
          className="status-badge"
          data-testid="card-status"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
        >
          {status.replace(/_/g, ' ')}
        </span>

        {appliedDate && (
          <span>Applied: {formatDate(appliedDate)}</span>
        )}

        {deadline && (
          <span style={deadlineSoon ? { color: '#ef4444', fontWeight: 600 } : {}}>
            {deadlineSoon ? '⚠ ' : ''}Deadline: {formatDate(deadline)}
          </span>
        )}
      </div>
    </div>
  );
}
