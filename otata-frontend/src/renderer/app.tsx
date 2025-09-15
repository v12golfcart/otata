import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.body);
const App = () => {
  return <h2>Initial from react!</h2>;
};
root.render(App());