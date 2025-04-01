import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WorkflowContext } from '../../contexts/WorkflowContext';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState
} from 'react-flow-renderer';
import './WorkflowEditorPage.css';

function WorkflowEditorPage() {
  const { workflowId } = useParams(); 
  const { getWorkflows, createWorkflow, updateWorkflow } = useContext(WorkflowContext);
  const navigate = useNavigate();

  // We'll store the entire workflow's name & description separately
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  // React Flow recommended approach: useNodesState/useEdgesState
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Modal
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Right properties panel: selected node info
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeLabel, setSelectedNodeLabel] = useState('');

  // Load existing workflow if editing
  useEffect(() => {
    if (workflowId) {
      const all = getWorkflows();
      const found = all.find((wf) => wf.id === workflowId);
      if (found) {
        // load the existing workflow data
        setNodes(found.nodes || []);
        setEdges(found.edges || []);
        setWorkflowName(found.name || '');
        setWorkflowDescription(found.description || '');
      }
    }
  }, [workflowId, getWorkflows, setNodes, setEdges]);

  // Handle connect events from React Flow
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // When a node is clicked, let’s show it in the property panel
  const onNodeClick = (evt, node) => {
    setSelectedNode(node);
    setSelectedNodeLabel(node.data?.label || '');
  };

  // Add a new node of a certain "type" at a default position
  const handleAddNode = (type) => {
    const newId = `node_${Date.now()}`;
    let label = '';
    if (type === 'api') {
      label = 'API Step';
    } else if (type === 'email') {
      label = 'Email Step';
    } else {
      label = 'New Step';
    }
    const newNode = {
      id: newId,
      position: { x: 250, y: 100 }, // you can randomize or track mouse position
      data: { label: label, stepType: type },
      type: 'default'
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Save the workflow
  const handleOpenSaveModal = () => {
    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
  };

  const handleConfirmSave = () => {
    if (workflowId) {
      // Updating an existing
      updateWorkflow(workflowId, {
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges
      });
    } else {
      // Creating a new
      const newId = 'WF-' + Date.now();
      createWorkflow({
        id: newId,
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges,
        isPinned: false,
        editedOn: '',
        editedBy: ''
      });
    }
    setShowSaveModal(false);
    navigate('/workflows');
  };

  // Cancel creation/edit
  const handleCancel = () => {
    navigate('/workflows');
  };

  // When user changes the selected node label in the property panel
  const handleNodeLabelChange = (e) => {
    const newLabel = e.target.value;
    setSelectedNodeLabel(newLabel);
    if (selectedNode) {
      // update the node in the main nodes array
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newLabel
              }
            };
          }
          return node;
        })
      );
    }
  };

  // Clear selection if user clicks outside
  const onPaneClick = () => {
    setSelectedNode(null);
  };

  return (
    <div className="editor-layout">
      {/* Left Sidebar with step components (like CreateNewProcessXX.png) */}
      <div className="editor-sidebar">
        <h3>Components</h3>
        <button className="sidebar-button" onClick={() => handleAddNode('api')}>
          + API Step
        </button>
        <button className="sidebar-button" onClick={() => handleAddNode('email')}>
          + Email Step
        </button>
        {/* Add more step types or icons as needed */}
      </div>

      {/* Main content area */}
      <div className="editor-main">
        {/* Top Toolbar: Save, Cancel, maybe Zoom In/Out */}
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <button onClick={handleAddNode} className="generic-add-button">+ Add Step</button>
          </div>
          <div className="toolbar-center">
            <h2 className="toolbar-title">
              {workflowId ? 'Edit Workflow' : 'Create New Process'}
            </h2>
          </div>
          <div className="toolbar-right">
            <button onClick={handleOpenSaveModal} className="save-button">Save</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </div>

        {/* ReactFlow area */}
        <div className="reactflow-wrapper" onClick={onPaneClick}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Right properties panel (if a node is selected) */}
      <div className="editor-properties">
        <h3>Properties</h3>
        {selectedNode ? (
          <div className="properties-panel">
            <label>Step Label</label>
            <input
              type="text"
              value={selectedNodeLabel}
              onChange={handleNodeLabelChange}
            />
            <p>
              <b>Type:</b> {selectedNode.data?.stepType || 'default'}
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              You could add more fields here, such as URL, method, email addresses, etc.
            </p>
          </div>
        ) : (
          <p style={{ margin: '1rem', fontSize: '0.9rem', color: '#777' }}>
            Select a node to edit its properties.
          </p>
        )}
      </div>

      {/* Save Workflow Modal */}
      {showSaveModal && (
        <div className="save-modal-overlay">
          <div className="save-modal">
            <h2>
              Save your workflow
              <span onClick={handleCloseSaveModal}></span>
            </h2>

            <div className="modal-form-group">
              <label>Name</label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Name here"
              />
            </div>

            <div className="modal-form-group">
              <label>Description</label>
              <textarea
                rows="3"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Write here..."
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleConfirmSave} className="confirm-save-button">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkflowEditorPage;
