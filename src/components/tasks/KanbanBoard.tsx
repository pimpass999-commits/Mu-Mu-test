import React from 'react';
import { Status, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus, MoreVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useTaskFlow } from '../../hooks/useTaskFlow';
import { cn } from '../../utils/cn';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask?: (status: Status) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskClick, onAddTask }) => {
  const { tasks: allTasks, reorderTasks } = useTaskFlow();
  const columns: Status[] = ['To Do', 'In Progress', 'Review', 'Done'];

  const getTasksByStatus = (status: Status) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movedTask = allTasks.find(t => t.id === draggableId);
    if (!movedTask) return;
    const projectTasks = allTasks.filter((task) => task.projectId === movedTask.projectId);
    const lanes = columns.reduce<Record<Status, Task[]>>((acc, status) => {
      acc[status] = projectTasks
        .filter((task) => task.status === status)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      return acc;
    }, {
      'To Do': [],
      'In Progress': [],
      Review: [],
      Done: [],
    });

    const sourceLane = [...lanes[source.droppableId as Status]];
    const destinationLane =
      source.droppableId === destination.droppableId
        ? sourceLane
        : [...lanes[destination.droppableId as Status]];

    const movedIndex = sourceLane.findIndex((task) => task.id === draggableId);
    if (movedIndex === -1) return;

    const [removedTask] = sourceLane.splice(movedIndex, 1);
    destinationLane.splice(destination.index, 0, {
      ...removedTask,
      status: destination.droppableId as Status,
    });

    lanes[source.droppableId as Status] = sourceLane;
    lanes[destination.droppableId as Status] = destinationLane;

    const items = columns.flatMap((status) =>
      lanes[status].map((task, index) => ({
        taskId: task.id,
        status: task.status,
        position: index,
      })),
    );

    void reorderTasks(movedTask.projectId, items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-6 min-h-[600px]">
        {columns.map((status) => {
          const columnTasks = getTasksByStatus(status);
          return (
            <div key={status} className="flex-shrink-0 w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{status}</h3>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors"
                    onClick={() => onAddTask?.(status)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-3 space-y-3 border border-dashed border-slate-200 dark:border-slate-800 transition-colors",
                      snapshot.isDraggingOver && "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    )}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                          >
                            <TaskCard task={task} onClick={() => onTaskClick(task)} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        <p className="text-sm text-slate-400 dark:text-slate-500">No tasks</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
