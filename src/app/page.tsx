'use client'

import React, { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import './globals.css'
import { cn } from '@/lib/utils'

interface Todo {
  title: string
  description: string
  completed: boolean
  id: number
}

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    setIsHydrated(true) // Ensure the component is mounted before accessing localStorage
  }, [])

  if (!isHydrated) {
    return null // Avoid rendering mismatched content on the server
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTodo: Todo = {
      title,
      description,
      completed: false,
      id: todos?.length ? todos[todos.length - 1].id + 1 : 1,
    }

    setTodos([...(todos || []), newTodo])
    setTitle('')
    setDescription('')
  }

  const toggleComplete = (id: number) => {
    setTodos(
      todos?.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo),
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos?.filter((todo) => todo.id !== id))
  }

  return (
    <main className='mx-auto max-w-3xl px-6 pb-20'>
      <section className='pt-8'>
        <form onSubmit={handleSubmit} className='flex flex-col mb-8'>
          <input
            aria-label='enter title'
            placeholder='enter title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cn(
              'rounded-none border border-surface0 bg-base',
              'py-2 px-4 shadow-sm',
              'outline-none transition-colors duration-300',
              'placeholder:text-overlay0 hover:border-surface1',
              'focus:text-text focus:border-surface2',
            )}
          />
          <input
            aria-label='enter description'
            placeholder='enter description'
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(
              'rounded-none border border-surface0 bg-base',
              'py-2 px-4 shadow-sm',
              'outline-none transition-colors duration-300',
              'placeholder:text-overlay0 hover:border-surface1',
              'focus:text-text focus:border-surface2',
            )}
          />
          <button
            type='submit'
            className={cn(
              'rounded-none border border-surface0 bg-base',
              'py-2 px-4 shadow-sm',
              'outline-none transition-colors duration-300',
              'placeholder:text-overlay0 hover:border-surface1',
              'focus:text-text focus:border-surface2',
            )}
          >
            add
          </button>
        </form>

        <ul className='animated-list list-none p-0'>
          {todos?.map((todo) => (
            <li key={todo.id} className='flex gap-4 items-center mb-5'>
              <button
                className='text-left flex-1'
                onClick={() => toggleComplete(todo.id)}
              >
                <span
                  className={`font-bold mr-4 ${todo.completed ? 'line-through' : ''}`}
                >
                  {todo.title}
                </span>
                <span
                  className={`italic text-overlay0 ${todo.completed ? 'line-through' : ''}`}
                >
                  {todo.description}
                </span>
              </button>
              <button
                className='underline ml-auto'
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
