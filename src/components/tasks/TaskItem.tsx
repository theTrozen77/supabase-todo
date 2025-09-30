import { useState } from 'react'
import { Task } from '../../lib/database.types'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => Promise<void>
  onUpdate: (id: string, title: string, description?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const TaskItem = ({ task, onToggle, onUpdate, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!editTitle.trim()) return

    setLoading(true)
    await onUpdate(task.id, editTitle, editDescription || null)
    setIsEditing(false)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true)
      await onDelete(task.id)
    }
  }

  const handleToggle = async () => {
    setLoading(true)
    await onToggle(task.id)
    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="mb-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task title"
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="Task description (optional)"
            disabled={loading}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={loading || !editTitle.trim()}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-200 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={loading}
          />
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <span>Created: {formatDate(task.created_at)}</span>
              {task.updated_at !== task.created_at && (
                <span className="ml-4">Updated: {formatDate(task.updated_at)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            disabled={loading}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
