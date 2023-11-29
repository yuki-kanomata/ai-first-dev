// src/Task.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface Task {
  ID: number
  Subject: string
  DueDate: string
  IsDone: boolean
}

const Task: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:8080/tasks')
    setTasks(response.data)
  }

  const addTask = async () => {
    if (newTask === '') return
    const formattedDate = new Date(dueDate).toISOString()
    await axios.post('http://localhost:8080/tasks', {
      Subject: newTask,
      DueDate: formattedDate,
    })
    setNewTask('')
    setDueDate('')
    fetchTasks()
  }

  const toggleTaskDone = async (id: number, isDone: boolean) => {
    await axios.put(`http://localhost:8080/tasks/${id}`, { IsDone: !isDone })
    fetchTasks()
  }

  const deleteTask = async (id: number) => {
    await axios.delete(`http://localhost:8080/tasks/${id}`)
    fetchTasks()
  }

  return (
    <div className="flex justify-center gap-5 p-5">
      <div className="flex flex-col w-1/3">
        <div className="flex items-center justify-center space-x-4">
          <TextField
            label="件名"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="mt-4"
          />
          <TextField
            label="期日"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            className="mt-4"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addTask}
            className="mt-4"
          >
            タスクを追加
          </Button>
        </div>
        <List>
          {tasks.map((task) => {
            const date = new Date(task.DueDate)
            const formattedDate = `期日: ${date.getFullYear()}年${
              date.getMonth() + 1
            }月${date.getDate()}日`
            return (
              <ListItem key={task.ID}>
                <Checkbox
                  checked={task.IsDone}
                  onChange={() => toggleTaskDone(task.ID, task.IsDone)}
                />
                <ListItemText
                  primary={
                    <span className={task.IsDone ? 'line-through' : ''}>
                      {task.Subject}
                    </span>
                  }
                  secondary={formattedDate}
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteTask(task.ID)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            )
          })}
        </List>
      </div>
    </div>
  )
}

export default Task
