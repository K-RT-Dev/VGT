import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './App.css';

const container = document.createElement('div');
container.id = 'root'
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);


