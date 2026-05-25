import { useEffect, useState } from 'react';
import { useApplications } from '../hooks/useApplications.js';
import StatsCard from '../components/dashboard/StatsCard.jsx';
import StatusChart from '../components/dashboard/StatusChart.jsx';
import TimelineChart from '../components/dashboard/TimelineChart.jsx';

export default function Dashboard() {
  const { stats, fetchStats } = useApplications();
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setStatsLoading(true);
    fetchStats().finally(() => setStatsLoading(false));
  }, [fetchStats]);

  if (statsLoading) return <p style={{ padding: 24 }}>Loading…</p>;

  return (
    <main className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      {stats ? (
        <>
          <div className="stats-grid" data-testid="stats-total-card">
            <StatsCard label="Total Applications" value={stats.total} testId="stats-total" />
            <StatsCard label="Response Rate" value={`${Math.round(stats.responseRate * 100)}%`} testId="stats-response-rate" />
            <StatsCard label="Added This Week" value={stats.thisWeek} testId="stats-this-week" />
          </div>

          <div className="charts-grid">
            <StatusChart byStatus={stats.byStatus || {}} />
            <TimelineChart perWeek={stats.perWeek || []} />
          </div>
        </>
      ) : (
        <div className="empty-state">No data yet. Add some applications to see your stats.</div>
      )}
    </main>
  );
}
