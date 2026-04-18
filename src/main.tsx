import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.scss';
import { AuthProvider } from './context/AuthContext';
import { CardProvider } from './context/CardContext';
import { LayoutProvider } from './context/LayoutContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CardProvider>
        <LayoutProvider>
          <App />
        </LayoutProvider>
      </CardProvider>
    </AuthProvider>
  </React.StrictMode>,
);