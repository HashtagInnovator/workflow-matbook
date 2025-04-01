// src/contexts/WorkflowContext.js
import React, { createContext, useState, useEffect } from 'react';

// We'll store workflows in local storage under "workflows"
const WORKFLOWS_KEY = 'workflows';

export const WorkflowContext = createContext();

const WorkflowProvider = ({ children }) => {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    // Load from localStorage on mount
    const storedWorkflows = localStorage.getItem(WORKFLOWS_KEY);
    if (storedWorkflows) {
      setWorkflows(JSON.parse(storedWorkflows));
    }
  }, []);

  // Helper: save current workflows array to local storage
  const saveToLocalStorage = (workflowArray) => {
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflowArray));
  };

  // Return all workflows
  const getWorkflows = () => {
    return workflows; // The state is always in sync with localStorage
  };

  // Return a single workflow by ID
  const getWorkflowById = (id) => {
    return workflows.find((wf) => wf.id === id) || null;
  };

  // Create a new workflow
  const createWorkflow = (newWorkflow) => {
    // newWorkflow is an object with { id, name, status, nodes, edges, etc. }
    const updated = [...workflows, newWorkflow];
    setWorkflows(updated);
    saveToLocalStorage(updated);
  };

  // Update an existing workflow
  const updateWorkflow = (id, updatedData) => {
    const updated = workflows.map((wf) => {
      if (wf.id === id) {
        return { ...wf, ...updatedData };
      }
      return wf;
    });
    setWorkflows(updated);
    saveToLocalStorage(updated);
  };

  // Delete a workflow by ID
  const deleteWorkflow = (id) => {
    const updated = workflows.filter((wf) => wf.id !== id);
    setWorkflows(updated);
    saveToLocalStorage(updated);
  };

  return (
    <WorkflowContext.Provider
      value={{
        workflows,
        getWorkflows,
        getWorkflowById,
        createWorkflow,
        updateWorkflow,
        deleteWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowProvider;
