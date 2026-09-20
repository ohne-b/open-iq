import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fontsource-variable/dm-sans';
import './styles.css';
import { App, AppErrorBoundary } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
);
