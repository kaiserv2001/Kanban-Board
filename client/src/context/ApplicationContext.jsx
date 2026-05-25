import { createContext, useState, useCallback } from 'react';
import api from '../services/api.js';

export const ApplicationContext = createContext(null);

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/applications', { params: filters });
      setApplications(res.data.applications);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await api.get('/applications/stats');
    setStats(res.data);
  }, []);

  const createApplication = async (data) => {
    const res = await api.post('/applications', data);
    setApplications(prev => [res.data.application, ...prev]);
    return res.data.application;
  };

  const updateApplication = async (id, data) => {
    const res = await api.put(`/applications/${id}`, data);
    setApplications(prev => prev.map(a => a.id === id ? res.data.application : a));
    return res.data.application;
  };

  const deleteApplication = async (id) => {
    await api.delete(`/applications/${id}`);
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const updateStatus = async (id, status) => {
    const res = await api.patch(`/applications/${id}/status`, { status });
    setApplications(prev => prev.map(a => a.id === id ? res.data.application : a));
    return res.data.application;
  };

  return (
    <ApplicationContext.Provider value={{
      applications, stats, loading, error,
      fetchApplications, fetchStats,
      createApplication, updateApplication, deleteApplication, updateStatus,
    }}>
      {children}
    </ApplicationContext.Provider>
  );
}
