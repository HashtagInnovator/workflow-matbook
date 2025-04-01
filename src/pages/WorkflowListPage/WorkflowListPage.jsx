import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowContext } from '../../contexts/WorkflowContext'; 
import { AuthContext } from '../../contexts/AuthContext';
import './WorkflowListPage.css';

// Instead of Lucide, use pin images from your assets
import pinDisabled from '../../assets/pinDisabled.png';
import pinEnabled from '../../assets/pinEnabled.png';
import { MoreVertical, Download, ChevronLeft, ChevronRight } from 'lucide-react';

function WorkflowListPage() {
  const navigate = useNavigate();

  // Context for workflows + auth
  const { workflows, getWorkflows, updateWorkflow } = useContext(WorkflowContext);
  const { user } = useContext(AuthContext);

  // We'll store a local filtered list for display
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15; // Hard-code or compute if needed

  // On mount (and whenever workflows changes), re-apply the search filter
  useEffect(() => {
    filterWorkflows(searchTerm);
    // eslint-disable-next-line
  }, [workflows]);

  // Filter by name or ID
  const filterWorkflows = (term) => {
    const all = getWorkflows();
    if (!term) {
      setFilteredWorkflows(all);
      return;
    }
    const lowerTerm = term.toLowerCase();
    const results = all.filter((wf) =>
      wf.name.toLowerCase().includes(lowerTerm) ||
      wf.id.toLowerCase().includes(lowerTerm)
    );
    setFilteredWorkflows(results);
  };

  // Handle search
  const handleSearchChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    filterWorkflows(newTerm);
  };

  // Toggle pin
  const togglePin = (workflow) => {
    const updatedWorkflow = {
      ...workflow,
      isPinned: !workflow.isPinned,
    };
    updateWorkflow(workflow.id, updatedWorkflow);
  };

  // Edit workflow → update "editedOn" + "editedBy" (optional) then navigate
  const handleEdit = (workflowId) => {
    const now = new Date();
    const editorName = user?.name || user?.email || 'Guest';

    const updatedData = {
      editedOn: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      editedBy: editorName,
    };
    updateWorkflow(workflowId, updatedData);
    navigate(`/workflows/${workflowId}`);
  };

  // Execute workflow
  const handleExecute = (workflowId) => {
    console.log(`Executing workflow: ${workflowId}`);
    // Possibly update local storage "status" or "lastExecuted"
  };

  // Create new workflow
  const handleCreateNew = () => {
    navigate('/workflows/create');
  };

  // Pagination helpers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="workflow-builder-container">
      {/* The page background can be #FDFBF6 in your CSS */}
      <div className="workflow-header">
        <div className="header-left">
          <button className="menu-button">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1>Workflow Builder</h1>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search By Workflow Name/ID"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <button className="create-process-button" onClick={handleCreateNew}>
            + Create New Process
          </button>
        </div>
      </div>

      <div className="workflow-table-container">
        <table className="workflow-table">
          <thead>
            <tr>
              <th>Workflow Name</th>
              <th>ID</th>
              <th>Last Edited On</th>
              <th>Description</th>
              <th className="action-column"></th>
              <th className="action-column"></th>
              <th className="action-column"></th>
              <th className="action-column"></th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkflows.map((workflow, index) => {
              // If there's no description, show some fallback
              const desc = workflow.description 
                ? workflow.description 
                : "This is your workflow’s description. Add more details here...";
              
              return (
                <tr key={workflow.id || index}>
                  <td>{workflow.name}</td>
                  <td>{workflow.id}</td>
                  <td>{`${workflow.editedBy || ''} | ${workflow.editedOn || ''}`.trim()}</td>
                  <td>{desc}</td>
                  <td>
                    <button 
                      className={`pin-button ${workflow.isPinned ? 'pin-active' : ''}`}
                      onClick={() => togglePin(workflow)}
                    >
                      <img 
                        src={workflow.isPinned ? pinEnabled : pinDisabled} 
                        alt="Pin Icon" 
                        className="pin-icon"
                      />
                    </button>
                  </td>
                  <td>
                    <button
                      className="execute-button"
                      onClick={() => handleExecute(workflow.id)}
                    >
                      Execute
                    </button>
                  </td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(workflow.id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="action-buttons">
                    <button className="more-button">
                      <MoreVertical size={18} />
                    </button>
                    <button className="download-button">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredWorkflows.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  No workflows found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          className="pagination-arrow"
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
          let pageToShow;
          if (totalPages <= 5) {
            pageToShow = index + 1;
          } else if (currentPage <= 3) {
            pageToShow = index + 1;
            if (index === 4) pageToShow = totalPages;
          } else if (currentPage >= totalPages - 2) {
            pageToShow = totalPages - 4 + index;
            if (index === 0) pageToShow = 1;
          } else {
            pageToShow = currentPage - 2 + index;
            if (index === 0) pageToShow = 1;
            if (index === 4) pageToShow = totalPages;
          }
          if (
            (currentPage > 3 && index === 1 && totalPages > 5) ||
            (currentPage < totalPages - 2 && index === 3 && totalPages > 5)
          ) {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }
          return (
            <button
              key={pageToShow}
              className={`pagination-number ${currentPage === pageToShow ? 'active' : ''}`}
              onClick={() => goToPage(pageToShow)}
            >
              {pageToShow}
            </button>
          );
        })}

        <button 
          className="pagination-arrow"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default WorkflowListPage;
