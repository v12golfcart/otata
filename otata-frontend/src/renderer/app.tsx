import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

const App = () => {
  return (
    <div className="overlay-container">
      <div className="overlay-content">
        <span className="task-text">📝 Placeholder task here</span>
      </div>
    </div>
  );
};

root.render(<App />);