import KanbanBoard from '../components/applications/KanbanBoard.jsx';

export default function KanbanPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Kanban Board</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-3)' }}>Drag cards between columns to update status</p>
      </div>
      <KanbanBoard />
    </div>
  );
}
