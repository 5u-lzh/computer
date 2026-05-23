import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { RGBProvider } from './context/RGBContext';
import { BuildProvider } from './context/BuildContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RGBProvider>
        <BuildProvider>
          <App />
        </BuildProvider>
      </RGBProvider>
    </BrowserRouter>
  </React.StrictMode>
);
