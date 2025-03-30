import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

// template for react v17
// @ts-expect-error v19 type not compatible
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

window.postMessage({ type: 'REACT_MOUNT' });
