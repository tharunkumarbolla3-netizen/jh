import React from 'react';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'complete';
  progress: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusBadgeClasses = (status: Task['status']): string => {
    switch (status) {
      case 'not_started':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Task['status']): string => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'complete':
        return 'Complete';
      default:
        return 'Unknown';
    }
  };

  const getProgressBarColor = (status: Task['status']): string => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-400';
      case 'in_progress':
        return 'bg-blue-500';
      case 'complete':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status'];
    onStatusChange(task._id, newStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2">
          {task.title}
        </h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(task.status)}`}>
          {getStatusText(task.status)}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Progress</span>
          <span className="text-xs font-medium text-gray-700">{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${getProgressBarColor(task.status)} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={`status-${task._id}`} className="block text-xs font-medium text-gray-700 mb-1">
          Change Status
        </label>
        <select
          id={`status-${task._id}`}
          value={task.status}
          onChange={handleStatusChange}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>
          Created: {new Date(task.created_at).toLocaleDateString()}
        </div>
        {task.completed_at && (
          <div className="text-green-600">
            Completed: {new Date(task.completed_at).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;