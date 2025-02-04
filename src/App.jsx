import React, { useState, useEffect } from 'react';
import './App.css';

// Helper function to manage tasks in localStorage
const getTasksFromStorage = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasks;
};

const saveTasksToStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(getTasksFromStorage());

  // Handle adding a task
  const addTask = () => {
    if (task) {
      const newTask = { id: Date.now(), text: task, completed: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      setTask('');
    }
  };

  // Handle removing a task
  const removeTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // Handle completing a task
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // PWA install prompt logic inside useEffect
  useEffect(() => {
    let deferredPrompt;

    // Listen for the 'beforeinstallprompt' event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the default prompt from appearing
      e.preventDefault();

      // Save the event to trigger it later
      deferredPrompt = e;

      // Show your custom install button or message
      const installButton = document.getElementById('install-button');
      installButton.style.display = 'block';

      // When the user clicks the install button
      installButton.addEventListener('click', () => {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          // Reset the deferred prompt variable
          deferredPrompt = null;
        });
      });
    });
  }, []); // Empty dependency array to only run once

  return (
    <div className="App">
      <h1>PWA Todo App</h1>

      {/* Add a button or modal to prompt the user to install */}
      <button id="install-button" style={{ display: 'none' }}>
        Install PWA
      </button>

      <input
        type="text"
        placeholder="Add a new task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {task.text}
            <button onClick={() => removeTask(task.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
