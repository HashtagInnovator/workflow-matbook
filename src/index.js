import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './contexts/AuthContext';
import WorkflowProvider from './contexts/WorkflowContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <WorkflowProvider>
      <App />
    </WorkflowProvider>
  </AuthProvider>
);
