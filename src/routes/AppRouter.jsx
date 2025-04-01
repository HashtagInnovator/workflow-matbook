import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage/LoginPage';
import WorkflowListPage from '../pages/WorkflowListPage/WorkflowListPage';
import WorkflowEditorPage from '../pages/WorkflowEditorPage/WorkflowEditorPage';
import RequireAuth from './RequireAuth';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/workflows"
        element={
          <RequireAuth>
            <WorkflowListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/workflows/create"
        element={
          <RequireAuth>
            <WorkflowEditorPage />
          </RequireAuth>
        }
      />
      <Route
        path="/workflows/:workflowId"
        element={
          <RequireAuth>
            <WorkflowEditorPage />
          </RequireAuth>
        }
      />

      {/* Default Route */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRouter;
