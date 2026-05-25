import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TimelineChart({ perWeek }) {
  if (!perWeek?.length) {
    return (
      <div className="chart-card" data-testid="timeline-chart">
        <h2 className="chart-title">Applications Over Time</h2>
        <p className="chart-empty">No timeline data yet</p>
      </div>
    );
  }

  return (
    <div className="chart-card" data-testid="timeline-chart">
      <h2 className="chart-title">Applications Over Time</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={perWeek} margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={30} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, fill: '#3b82f6' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
