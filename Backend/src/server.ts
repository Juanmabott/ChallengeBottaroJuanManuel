import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

interface Task {
  id: number;
  title: string;
  description: string;
  completed?: boolean;
  createdAt?: Date;
}

function isValidTask(data: unknown): data is Pick<Task, 'title' | 'description' | 'completed'> {
  if (typeof data !== 'object' || data === null) return false;
  const { title, description, completed } = data as Record<string, unknown>;
  return typeof title === 'string' && 
         title.trim().length > 0 && // Agregar validación de string no vacío
         typeof description === 'string' && 
         description.trim().length > 0 && // Agregar validación de string no vacío
         (completed === undefined || typeof completed === 'boolean');
}

const tasks: Task[] = [];
let nextId = 1; // Contador independiente para IDs únicos

app.get('/api/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});


app.get('/api/tasks/:id', (req: Request, res: Response) => {
  let { id } = req.params;
  if (Array.isArray(id)) id = id[0];
  const task = tasks.find(t => t.id === parseInt(id, 10));
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});


app.post('/api/tasks', (req: Request, res: Response) => {
  if (!isValidTask(req.body)) {
    return res.status(400).json({ message: 'Datos invalidos' });
  }
  const { title, description, completed } = req.body;
  const newTask: Task = { 
    id: nextId++,  
    title: title.trim(), 
    description: description.trim(), 
    completed: completed ?? false,  
    createdAt: new Date() 
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req: Request<{ id: string }>, res: Response) => {
  let { id } = req.params;
  if (Array.isArray(id)) id = id[0];
  
  if (!isValidTask(req.body)) {
    return res.status(400).json({ message: 'Invalid data' });
  }
  
  const { title, description, completed } = req.body;
  const task = tasks.find(t => t.id === parseInt(id, 10));
  
  if (task) {
    task.title = title.trim();
    task.description = description.trim();
    if (completed !== undefined) {
      task.completed = completed;
    }
    res.json(task); 
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req: Request<{ id: string }>, res: Response) => {
  let { id } = req.params;
  if (Array.isArray(id)) id = id[0];
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id, 10));
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(200).json({message: `Task ${id} deleted `});
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});