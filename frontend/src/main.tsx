//Подключение React
import React from 'react';
import ReactDOM from 'react-dom/client';
//React-styles
import './assets/styles/index.scss';
//React-router
import { BrowserRouter as Router } from 'react-router-dom';
//React-components
import { App } from './app/App.tsx';

// Типизация корневого элемента
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)
