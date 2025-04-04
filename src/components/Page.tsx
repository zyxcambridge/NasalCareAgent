import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

function Page() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    // 定义异步函数获取todos
    async function getTodos() {
      const { data, error } = await supabase.from('todos').select()

      if (error) {
        console.error('获取todos失败:', error)
        return
      }

      if (data && data.length > 0) {
        setTodos(data)
      }
    }

    // 调用异步函数
    getTodos()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">待办事项列表</h1>
      {todos.length === 0 ? (
        <p>暂无待办事项</p>
      ) : (
        <ul className="list-disc pl-5">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'line-through' : ''}>
              {todo.task}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Page