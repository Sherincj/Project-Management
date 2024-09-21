'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FixedHeader from '../components/Header';
import CreateProjectForm from './CreateProjectForm';
import { Pencil, Trash2, Plus, X, ChevronDown, MoreVertical, Edit } from 'lucide-react';

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function ProjectCard({ project, onAddMember, onClick, onEdit, onStatusChange, onProgressChange, onDelete, className }) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [localProgress, setLocalProgress] = useState(project.progress);
  const validMembers = typeof project.members === 'number' && project.members >= 0 ? project.members : 0;

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const handleStatusChange = (status) => {
    onStatusChange(project.id, status);
    setIsStatusDropdownOpen(false);
  };

  const handleProgressChange = (e) => {
    e.stopPropagation();
    const newProgress = parseInt(e.target.value, 10);
    setLocalProgress(newProgress);
  };

  const handleProgressChangeEnd = () => {
    onProgressChange(project.id, localProgress);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(project.id);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 relative cursor-pointer hover:shadow-md transition-shadow duration-300 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h3 className="text-lg font-bold">{project.name}</h3>
        </div>
        <div className="relative">
          <button
            className="flex items-center text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
            onClick={(e) => {
              e.stopPropagation();
              toggleStatusDropdown();
            }}
          >
            {project.status} Status
            <ChevronDown size={16} className="ml-1" />
          </button>
          {isStatusDropdownOpen && (
            <div className="absolute z-10 mt-1 right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {['Not Started', 'Started', 'Approval', 'Completed'].map((status) => (
                  <a
                    key={status}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(status);
                    }}
                  >
                    {status}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center mb-2">
        {[...Array(Math.min(validMembers, 3))].map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-xs font-semibold text-gray-600"
          >
            {i + 1}
          </div>
        ))}
        {validMembers > 3 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white -ml-2 flex items-center justify-center text-xs font-semibold text-gray-600">
            +{validMembers - 3}
          </div>
        )}
        <button
          className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 -ml-2 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onAddMember();
          }}
        >
          <Plus size={16} className="text-gray-600" />
        </button>
        <span className="ml-3 text-sm text-gray-600">{validMembers} Members</span>
      </div>

      <div className="flex justify-end text-sm text-gray-600 font-bold mb-4">
        <span>Due: {formatDate(project.end_date)}</span>
      </div>

      <div className="mb-2">
        <div className="bg-gray-200 rounded-full h-2 relative">
          <div
            className="bg-red-400 rounded-full h-2 absolute top-0 left-0"
            style={{width: `${localProgress}%`}}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            value={localProgress}
            onChange={handleProgressChange}
            onMouseUp={handleProgressChangeEnd}
            onTouchEnd={handleProgressChangeEnd}
            className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      <div className="text-right text-sm text-gray-600">
         {localProgress}%
      </div>

      <div className="text-right text-sm text-red-500">
        {project.daysLeft} Days Left
      </div>

      <div className="absolute bottom-2 left-2 flex space-x-2">
        <button
          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
        >
          <Pencil size={16} />
        </button>
        <button
          className="p-1 text-gray-600 hover:text-red-600 transition-colors"
          onClick={handleDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function EmployeeActions({ employee }) {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  const toggleRoleDropdown = () => {
    setIsRoleDropdownOpen(!isRoleDropdownOpen);
    setIsMoreOptionsOpen(false);
  };

  const toggleMoreOptions = () => {
    setIsMoreOptionsOpen(!isMoreOptionsOpen);
    setIsRoleDropdownOpen(false);
  };

  const roles = ['All operation permission', 'Only Invite & manage team'];

  return (
    <div className="relative flex items-center">
      <div className="relative">
        <button
          className="flex items-center text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
          onClick={toggleRoleDropdown}
        >
          {employee.role}
          <ChevronDown size={16} className="ml-1" />
        </button>
        {isRoleDropdownOpen && (
          <div className="absolute z-10 mt-1 -ml-20 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {roles.map((role) => (
                <a
                  key={role}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  {role}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="relative ml-2">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={toggleMoreOptions}
        >
          <MoreVertical size={16} />
        </button>
        {isMoreOptionsOpen && (
          <div className="absolute right-0 z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <Edit size={16} className="mr-2" /> Edit
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <Trash2 size={16} className="mr-2" /> Delete
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmployeeInvitationDialog({ onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInvite = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/invitation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          created_by: 'current_user_email',
          expires_at: new Date().toISOString(),
          used: false
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.detail.includes("Invitation already sent")) {
          setError('Invitation already sent');
        } else {
          setError('Failed to send invitation');
        }
        return;
      }

      const data = await response.json();
      console.log('Invitation sent:', data);
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
      setError('An error occurred while sending the invitation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[700px]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Invite people</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex mb-4">
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700" onClick={handleInvite} disabled={loading}>
              {loading ? 'Sending...' : 'Invite'}
            </button>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div>
            <h3 className="font-semibold text-sm text-gray-500">PEOPLE WITH ACCESS</h3>
            {/* Employees list will be fetched from the backend */}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDashboard() {
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch the project data from the backend API using fetch
    fetch('http://localhost:8000/projects/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching project data:', error);
        setLoading(false);
      });
  }, [isProjectCreated]);

  const handleProjectClick = (project) => {
    router.push(`/project/${project.id}`);
  };

  const handleProjectEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleProjectCreated = (newProject) => {
    setIsProjectCreated(true);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects(projects.map(project => (project.id === updatedProject.id ? updatedProject : project)));
  };

  const handleStatusChange = (projectId, newStatus) => {
    // Find the project to update
    const projectToUpdate = projects.find(project => project.id === projectId);

    if (!projectToUpdate) {
      console.error('Project not found');
      return;
    }

    // Create a copy of the project with the updated status
    const updatedProject = {
      ...projectToUpdate,
      status: newStatus
    };

    // Update the project status in the backend
    fetch(`http://localhost:8000/projects/${projectId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject),
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(JSON.stringify(errorData));
          });
        }
        return response.json();
      })
      .then(updatedProject => {
        setProjects(projects.map(project => (project.id === projectId ? updatedProject : project)));
      })
      .catch(error => console.error('Error updating project status:', error));
  };

  const handleProgressChange = (projectId, newProgress) => {
    // Find the project to update
    const projectToUpdate = projects.find(project => project.id === projectId);

    if (!projectToUpdate) {
      console.error('Project not found');
      return;
    }

    // Create a copy of the project with the updated progress
    const updatedProject = {
      ...projectToUpdate,
      progress: newProgress
    };

    // Update the project progress in the backend
    fetch(`http://localhost:8000/projects/${projectId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject),
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(JSON.stringify(errorData));
          });
        }
        return response.json();
      })
      .then(updatedProject => {
        setProjects(projects.map(project => (project.id === projectId ? updatedProject : project)));
      })
      .catch(error => console.error('Error updating project progress:', error));
  };

  const handleDeleteProject = (projectId) => {
    // Delete the project in the backend
    fetch(`http://localhost:8000/projects/${projectId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setProjects(projects.filter(project => project.id !== projectId));
      })
      .catch(error => console.error('Error deleting project:', error));
  };

  const handleFilterClick = (status) => {
    setFilter(status);
  };

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(project => project.status === filter);

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20 sm:ml-[220px]">
      <FixedHeader />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Projects</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full sm:w-auto">
          <div className="flex flex-wrap mb-4 sm:mb-0">
            {['All', 'Not Started', 'Started', 'Approval', 'Completed'].map((status) => (
              <button
                key={status}
                className={`px-3 py-1 mr-2 mb-2 sm:mb-0 text-sm ${
                  filter === status
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600'
                }`}
                onClick={() => handleFilterClick(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            className="bg-purple-900 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
            onClick={() => setShowForm(true)}
          >
            + Create Project
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <CreateProjectForm
            onClose={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
            onProjectCreated={handleProjectCreated}
            onProjectUpdated={handleProjectUpdated}
            initialProject={editingProject}
          />
        </div>
      )}

      {showInvitation && (
        <EmployeeInvitationDialog onClose={() => setShowInvitation(false)} />
      )}

      {loading ? (
        <div className="text-center text-gray-600">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onAddMember={() => setShowInvitation(true)}
              onClick={() => handleProjectClick(project)}
              onEdit={handleProjectEdit}
              onStatusChange={handleStatusChange}
              onProgressChange={handleProgressChange}
              onDelete={handleDeleteProject}
              className={isProjectCreated ? 'animate-fade-in' : ''}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default ProjectDashboard;
