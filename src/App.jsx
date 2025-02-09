import React, { useState, useEffect } from 'react';
import './App.css';

// ✅ Helper functions to manage tasks in localStorage
const getTasksFromStorage = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Retrieve tasks from localStorage or return an empty array
  return tasks;
};

const saveTasksToStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks to localStorage
};

function App() {
  // ✅ React state hooks
  const [task, setTask] = useState('');              // Holds the current task input
  const [priority, setPriority] = useState('Normal'); // Holds the selected priority
  const [tasks, setTasks] = useState(getTasksFromStorage()); // Stores all tasks

  // ✅ Add a new task to the list
  const addTask = () => {
    if (task.trim()) { // Prevent adding empty tasks
      const newTask = { id: Date.now(), text: task, completed: false, priority }; // Create a new task object
      const updatedTasks = [...tasks, newTask]; // Add the new task to the existing list
      setTasks(updatedTasks);                  // Update the state with the new task list
      saveTasksToStorage(updatedTasks);        // Save the updated list to localStorage
      setTask('');                             // Clear the task input field
      setPriority('Normal');                  // Reset priority to default
    }
  };

  // ✅ Remove a task by ID
  const removeTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id); // Filter out the task to be removed
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // ✅ Toggle task completion status (adds/removes strikethrough effect)
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // ✅ Update the priority of an existing task
  const updatePriority = (id, newPriority) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, priority: newPriority } : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // ✅ Handle PWA installation prompt
  useEffect(() => {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();                    // Prevent default browser prompt
      deferredPrompt = e;                    // Store the event for triggering later

      const installButton = document.getElementById('install-button');
      installButton.style.display = 'block'; // Show the custom install button

      installButton.addEventListener('click', () => {
        deferredPrompt.prompt();             // Trigger the install prompt

        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;             // Reset after handling
        });
      });
    });
  }, []);

  return (
    <div className="App">
      <h1>PWA Todo App</h1>

      {/* ✅ Custom PWA install button (hidden by default) */}
      <a id="install-button" style={{ display: 'none' }}>Install PWA</a>

      {/* ✅ Input section for adding new tasks */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task"
          value={task}
          onChange={(e) => setTask(e.target.value)} // Update task input as user types
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
        </select>

        <button onClick={addTask}>Add Task</button>
      </div>

      {/* ✅ Task list display */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <div className="task-details">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)} // Toggle completion status
              />
              <span>{task.text}{' '}</span> {/* Task text with space */}
              {/* Priority display can be re-enabled here if needed */}
              {/* <strong className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</strong> */}
            </div>

            <div className="task-actions">
              <select
                value={task.priority}
                onChange={(e) => updatePriority(task.id, e.target.value)} // Update task priority
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>

              <button onClick={() => removeTask(task.id)}>Remove</button> {/* Remove task button */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
