import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import './index.css'
import App from './App.jsx'
// * as serviceWorker from './sw.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register the service worker
//serviceWorker.register();