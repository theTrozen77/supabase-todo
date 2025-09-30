import { useState } from 'react'

interface AddTaskFormProps {
  onAddTask: (title: string, description?: string) => Promise<void>
  loading?: boolean
}

export const AddTaskForm = ({ onAddTask, loading = false }: AddTaskFormProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    await onAddTask(title, description || undefined)
    setTitle('')
    setDescription('')
    setIsExpanded(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new task..."
          disabled={loading}
        />
      </div>

      {isExpanded && (
        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="Add a description (optional)"
            disabled={loading}
          />
        </div>
      )}

      {isExpanded && (
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false)
              setTitle('')
              setDescription('')
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={loading || !title.trim()}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      )}
    </form>
  )
}
