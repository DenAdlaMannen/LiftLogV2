
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


// Global error handler for debugging
window.onerror = function (message, source, lineno, colno, error) {
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100%';
  errorDiv.style.backgroundColor = 'red';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '20px';
  errorDiv.style.zIndex = '9999';
  errorDiv.innerHTML = `
    <h3>Application Error</h3>
    <p>${message}</p>
    <pre>${source}:${lineno}:${colno}</pre>
    <pre>${error?.stack || ''}</pre>
  `;
  document.body.appendChild(errorDiv);
};

try {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error("Root element not found");
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e) {
  console.error("Render error:", e);
  document.body.innerHTML += `<div style="color:red; padding:20px;">
    <h1>Render Error</h1>
    <pre>${e instanceof Error ? e.message + '\n' + e.stack : String(e)}</pre>
  </div>`;
}
