const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let tasks = [
  { id: 1, title: 'Build GitHub starter repos', completed: false },
  { id: 2, title: 'Customize portfolio website', completed: true }
];

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const newTask = {
    id: Date.now(),
    title,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  const updatedTask = tasks.find((task) => task.id === id);
  if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = tasks.some((task) => task.id === id);
  if (!exists) return res.status(404).json({ message: 'Task not found' });
  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task Manager running on http://localhost:${PORT}`);
});
