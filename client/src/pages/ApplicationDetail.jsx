import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';

const TABS = ['Overview', 'Notes', 'Timeline'];

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [noteBody, setNoteBody] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState('');
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  useEffect(() => {
    api.get(`/applications/${id}`)
      .then(res => setApp(res.data.application))
      .catch(() => navigate('/applications'));
  }, [id, navigate]);

  const handleDeleteNote = async (noteId) => {
    setDeletingNoteId(noteId);
    try {
      const res = await api.delete(`/applications/${id}/notes/${noteId}`);
      setApp(res.data.application);
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteBody.trim()) return;
    setNoteLoading(true);
    setNoteError('');
    try {
      const res = await api.post(`/applications/${id}/notes`, { body: noteBody });
      setApp(res.data.application);
      setNoteBody('');
    } catch (err) {
      setNoteError(err.response?.data?.message || 'Failed to add note');
    } finally {
      setNoteLoading(false);
    }
  };

  if (!app) return <p style={{ padding: 24 }}>Loading…</p>;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '—';

  return (
    <div className="page">
      {/* Header */}
      <div className="detail-header">
        <div>
          <Link to="/applications" className="detail-back" data-testid="detail-back">← Applications</Link>
          <h1 data-testid="detail-company">{app.company}</h1>
          <p data-testid="detail-role" style={{ margin: '2px 0 0', color: 'var(--text-3)', fontSize: 16 }}>{app.role}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`detail-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
            data-testid={`tab-${tab.toLowerCase()}`}
          >{tab}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="detail-body">
        {activeTab === 'Overview' && (
          <div className="detail-grid" data-testid="detail-overview">
            <DetailRow label="Status" value={app.status?.replace(/_/g,' ')} data-testid="detail-status" />
            <DetailRow label="Applied" value={formatDate(app.appliedDate)} />
            <DetailRow label="Deadline" value={formatDate(app.deadline)} />
            <DetailRow label="Job URL" value={app.jobUrl
              ? <a href={app.jobUrl} target="_blank" rel="noreferrer">{app.jobUrl}</a>
              : '—'} />
            {app.description && (
              <div className="detail-row full-width">
                <span className="detail-label">Description</span>
                <p style={{ margin: '4px 0 0', lineHeight: 1.6 }}>{app.description}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Notes' && (
          <div data-testid="detail-notes">
            <form onSubmit={handleAddNote} style={{ marginBottom: 20 }}>
              <div className="form-group">
                <label htmlFor="note-body">Add a note</label>
                <textarea
                  id="note-body"
                  rows={3}
                  value={noteBody}
                  onChange={e => setNoteBody(e.target.value)}
                  placeholder="Interview feedback, follow-up reminders…"
                  data-testid="note-input"
                />
              </div>
              {noteError && <p className="error-msg">{noteError}</p>}
              <button
                className="btn btn-primary"
                type="submit"
                disabled={noteLoading || !noteBody.trim()}
                style={{ width: 'auto' }}
                data-testid="add-note-btn"
              >{noteLoading ? 'Adding…' : 'Add Note'}</button>
            </form>

            {app.notes?.length === 0 && (
              <p style={{ color: 'var(--text-3)', fontSize: 14 }}>No notes yet.</p>
            )}
            <div className="notes-list">
              {[...(app.notes || [])].reverse().map(note => (
                <div key={note._id} className="note-item" data-testid={`note-${note._id}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{note.body}</p>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDeleteNote(note._id)}
                      disabled={deletingNoteId === note._id}
                      data-testid={`delete-note-${note._id}`}
                      style={{ flexShrink: 0 }}
                    >{deletingNoteId === note._id ? '…' : '×'}</button>
                  </div>
                  <span className="note-date">{formatDate(note.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Timeline' && (
          <div data-testid="detail-timeline">
            {app.timeline?.length === 0 && (
              <p style={{ color: 'var(--text-3)', fontSize: 14 }}>No timeline events yet.</p>
            )}
            <div className="timeline-list">
              {[...(app.timeline || [])].reverse().map((event, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>{event.event}</p>
                    <span className="note-date">{formatDate(event.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span>{value}</span>
    </div>
  );
}
