import { useEffect, useState } from 'react';
import { useApplications } from '../hooks/useApplications.js';
import ApplicationCard from '../components/applications/ApplicationCard.jsx';
import ApplicationForm from '../components/applications/ApplicationForm.jsx';
import api from '../services/api.js';

const STATUSES = ['wishlist','applied','phone_screen','technical','final_round','offer','rejected','withdrawn'];

export default function Applications() {
  const { applications, loading, error, fetchApplications, deleteApplication } = useApplications();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);     // null = create, object = edit
  const [deleteTarget, setDeleteTarget] = useState(null); // id to confirm-delete
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // Client-side filter (instant, no extra API calls)
  const filtered = applications.filter(app => {
    const matchSearch = !search ||
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleEdit  = (app) => { setEditTarget(app); setShowForm(true); };
  const handleAdd   = ()    => { setEditTarget(null); setShowForm(true); };
  const handleClose = ()    => { setShowForm(false); setEditTarget(null); };

  const handleExport = async () => {
    const res = await api.get('/applications/export', { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try { await deleteApplication(deleteTarget); }
    finally { setDeleteLoading(false); setDeleteTarget(null); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Applications</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" data-testid="export-csv-btn" onClick={handleExport}
            style={{ width: 'auto' }}>
            Export CSV
          </button>
          <button className="btn btn-primary" data-testid="add-application-btn" onClick={handleAdd}
            style={{ width: 'auto' }}>
            + Add Application
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search company or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          data-testid="status-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {loading && <p>Loading…</p>}
      {error   && <p className="error-msg">{error}</p>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state" data-testid="empty-state">
          <p style={{ fontSize: 16, fontWeight: 600 }}>No applications yet</p>
          <p style={{ fontSize: 14 }}>Click "+ Add Application" to get started.</p>
        </div>
      )}

      <div className="app-grid" data-testid="applications-list">
        {filtered.map(app => (
          <ApplicationCard
            key={app.id}
            application={app}
            onEdit={() => handleEdit(app)}
            onDelete={() => setDeleteTarget(app.id)}
          />
        ))}
      </div>

      {/* Add / Edit modal */}
      <ApplicationForm
        isOpen={showForm}
        onClose={handleClose}
        initialData={editTarget}
      />

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2>Delete Application</h2>
            </div>
            <div style={{ padding: '16px 24px 24px' }}>
              <p style={{ margin: '0 0 20px', color: '#374151' }}>
                Are you sure? This cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn"
                  style={{ background: '#ef4444', color: '#fff' }}
                  data-testid="delete-confirm-btn"
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
