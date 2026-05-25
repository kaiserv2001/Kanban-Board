import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useEffect } from 'react';
import { useApplications } from '../../hooks/useApplications.js';
import ApplicationCard from './ApplicationCard.jsx';
import { useNavigate } from 'react-router-dom';

const STATUSES = ['wishlist','applied','phone_screen','technical','final_round','offer','rejected','withdrawn'];

const COLUMN_LABELS = {
  wishlist: 'Wishlist', applied: 'Applied', phone_screen: 'Phone Screen',
  technical: 'Technical', final_round: 'Final Round', offer: 'Offer',
  rejected: 'Rejected', withdrawn: 'Withdrawn',
};

export default function KanbanBoard() {
  const { applications, fetchApplications, updateStatus } = useApplications();
  const navigate = useNavigate();

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s);
    return acc;
  }, {});

  const onDragEnd = async (result) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    const newStatus = destination.droppableId;
    const app = applications.find(a => a.id === draggableId);
    if (!app || app.status === newStatus) return;
    // optimistic update handled by context
    await updateStatus(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board" data-testid="kanban-board">
        {STATUSES.map(status => (
          <div key={status} className="kanban-column">
            <div className="kanban-column-header">
              <span className="kanban-column-title">{COLUMN_LABELS[status]}</span>
              <span className="kanban-column-count">{byStatus[status].length}</span>
            </div>
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-column-body${snapshot.isDraggingOver ? ' drag-over' : ''}`}
                  data-testid={`kanban-column-${status}`}
                >
                  {byStatus[status].map((app, index) => (
                    <Draggable key={app.id} draggableId={app.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`kanban-card-wrapper${snapshot.isDragging ? ' dragging' : ''}`}
                          data-testid={`kanban-card-${app.id}`}
                        >
                          <ApplicationCard
                            application={app}
                            onEdit={() => navigate(`/applications/${app.id}`)}
                            onDelete={() => {}}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
