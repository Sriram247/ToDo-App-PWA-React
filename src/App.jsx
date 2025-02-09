import React, { useState, useEffect } from 'react';
import './App.css';

// Helper functions to manage tasks in localStorage
const getTasksFromStorage = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasks;
};

const saveTasksToStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

function App() {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [tasks, setTasks] = useState(getTasksFromStorage());

  // Add a new task
  const addTask = () => {
    if (task.trim()) {
      const newTask = { id: Date.now(), text: task, completed: false, priority };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      setTask('');
      setPriority('Normal');
    }
  };

  // Remove a task
  const removeTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // Toggle task completion (adds strikethrough effect)
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // Update task priority
  const updatePriority = (id, newPriority) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, priority: newPriority } : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // PWA install prompt logic
  useEffect(() => {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      const installButton = document.getElementById('install-button');
      installButton.style.display = 'block';

      installButton.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      });
    });
  }, []);

  return (
    <div className="App">
      <h1>PWA Todo App</h1>
      <a id="install-button" style={{ display: 'none' }}>Install PWA</a>

      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
        </select>

        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <div className="task-details">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <span>{task.text}{' '}</span> 
{/*               <strong className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</strong>
 */}            </div>

            <div className="task-actions">
              <select
                value={task.priority}
                onChange={(e) => updatePriority(task.id, e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>

              <button onClick={() => removeTask(task.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
