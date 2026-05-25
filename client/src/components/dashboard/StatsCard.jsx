export default function StatsCard({ label, value, testId }) {
  return (
    <div className="stats-card" data-testid={testId}>
      <p className="stats-card-value">{value}</p>
      <p className="stats-card-label">{label}</p>
    </div>
  );
}
