const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taskManagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String
});

const Task = mongoose.model('Task', taskSchema);

// Get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({ title, description });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task to MongoDB' });
  }
});

// Edit a task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { title, description } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description }, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
