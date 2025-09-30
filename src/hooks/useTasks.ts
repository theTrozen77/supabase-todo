import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Task, NewTask, TaskUpdate } from '../lib/database.types'
import { useAuth } from '../contexts/AuthContext'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Fetch tasks for the current user
  const fetchTasks = async () => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tasks:', error)
        setError(error.message)
      } else {
        setTasks(data || [])
        setError(null)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  // Add a new task
  const addTask = async (taskData: Omit<NewTask, 'user_id'>) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const newTask: NewTask = {
        ...taskData,
        user_id: user.id,
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single()

      if (error) {
        console.error('Error adding task:', error)
        return { error: error.message }
      }

      // Update local state
      setTasks(prev => [data, ...prev])
      return { data, error: null }
    } catch (error) {
      console.error('Error adding task:', error)
      return { error: 'Failed to add task' }
    }
  }

  // Update an existing task
  const updateTask = async (id: string, updates: TaskUpdate) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating task:', error)
        return { error: error.message }
      }

      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? data : task
        )
      )
      return { data, error: null }
    } catch (error) {
      console.error('Error updating task:', error)
      return { error: 'Failed to update task' }
    }
  }

  // Delete a task
  const deleteTask = async (id: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting task:', error)
        return { error: error.message }
      }

      // Update local state
      setTasks(prev => prev.filter(task => task.id !== id))
      return { error: null }
    } catch (error) {
      console.error('Error deleting task:', error)
      return { error: 'Failed to delete task' }
    }
  }

  // Toggle task completion status
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return { error: 'Task not found' }

    return updateTask(id, { completed: !task.completed })
  }

  // Set up real-time subscription
  useEffect(() => {
    fetchTasks()

    if (!user) return

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('tasks_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [payload.new as Task, ...prev.filter(t => t.id !== payload.new.id)])
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev =>
              prev.map(task =>
                task.id === payload.new.id ? payload.new as Task : task
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(task => task.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    fetchTasks,
  }
}
