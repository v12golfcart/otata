import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

const App = () => {
  return <h2>Hello from React!</h2>;
};

root.render(<App />);