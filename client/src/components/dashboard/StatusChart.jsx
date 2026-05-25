import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  wishlist:     '#6b7280',
  applied:      '#3b82f6',
  phone_screen: '#f59e0b',
  technical:    '#8b5cf6',
  final_round:  '#ec4899',
  offer:        '#10b981',
  rejected:     '#ef4444',
  withdrawn:    '#9ca3af',
};

export default function StatusChart({ byStatus }) {
  const data = Object.entries(byStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.replace(/_/g, ' '),
      value: count,
      color: STATUS_COLORS[status] || '#6b7280',
    }));

  if (data.length === 0) {
    return (
      <div className="chart-card" data-testid="status-chart">
        <h2 className="chart-title">Applications by Status</h2>
        <p className="chart-empty">No data yet</p>
      </div>
    );
  }

  return (
    <div className="chart-card" data-testid="status-chart">
      <h2 className="chart-title">Applications by Status</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pie-legend">
        {data.map((entry, i) => (
          <span key={i} className="pie-legend-item">
            <span className="pie-legend-dot" style={{ background: entry.color }} />
            {entry.name} ({entry.value})
          </span>
        ))}
      </div>
    </div>
  );
}
