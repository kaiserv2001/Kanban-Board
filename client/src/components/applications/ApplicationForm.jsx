import { useState, useEffect } from 'react';
import { useApplications } from '../../hooks/useApplications.js';

const STATUSES = ['wishlist','applied','phone_screen','technical','final_round','offer','rejected','withdrawn'];

const EMPTY_FORM = {
  company: '',
  role: '',
  status: 'applied',
  appliedDate: '',
  deadline: '',
  jobUrl: '',
  description: '',
};

export default function ApplicationForm({ isOpen, onClose, initialData }) {
  const { createApplication, updateApplication } = useApplications();
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          company: initialData.company || '',
          role: initialData.role || '',
          status: initialData.status || 'applied',
          appliedDate: initialData.appliedDate ? initialData.appliedDate.slice(0, 10) : '',
          deadline: initialData.deadline ? initialData.deadline.slice(0, 10) : '',
          jobUrl: initialData.jobUrl || '',
          description: initialData.description || '',
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setFormError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateApplication(initialData.id, form);
      } else {
        await createApplication(form);
      }
      onClose();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Application' : 'Add Application'}</h2>
          <button className="modal-close" data-testid="form-cancel-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          {formError && <p className="error-msg">{formError}</p>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={form.company}
                onChange={handleChange}
                data-testid="company-input"
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <input
                id="role"
                name="role"
                type="text"
                required
                value={form.role}
                onChange={handleChange}
                data-testid="role-input"
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              data-testid="status-select"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appliedDate">Applied Date</label>
              <input
                id="appliedDate"
                name="appliedDate"
                type="date"
                value={form.appliedDate ? form.appliedDate.slice(0, 10) : ''}
                onChange={handleChange}
                data-testid="applied-date-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="deadline">Deadline</label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={form.deadline ? form.deadline.slice(0, 10) : ''}
                onChange={handleChange}
                data-testid="deadline-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jobUrl">Job URL</label>
            <input
              id="jobUrl"
              name="jobUrl"
              type="url"
              value={form.jobUrl}
              onChange={handleChange}
              data-testid="job-url-input"
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              data-testid="description-input"
              placeholder="Notes about this role…"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              data-testid="save-application-btn"
              disabled={submitting}
              style={{ width: 'auto' }}
            >
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
