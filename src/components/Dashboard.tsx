import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTasks } from '../hooks/useTasks'
import { AddTaskForm } from './tasks/AddTaskForm'
import { TaskItem } from './tasks/TaskItem'

export const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleTask } = useTasks()
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const handleAddTask = async (title: string, description?: string) => {
    await addTask({ title, description: description || null })
  }

  const handleUpdateTask = async (id: string, title: string, description?: string) => {
    await updateTask(id, { title, description: description || null })
  }

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id)
  }

  const handleToggleTask = async (id: string) => {
    await toggleTask(id)
  }

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed
      case 'completed':
        return task.completed
      default:
        return true
    }
  })

  const taskStats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{taskStats.active}</div>
            <div className="text-sm text-gray-600">Active Tasks</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Add Task Form */}
        <AddTaskForm onAddTask={handleAddTask} loading={loading} />

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {loading && tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Get started by adding your first task above!'
                  : `You don't have any ${filter} tasks.`
                }
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
