'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm from './AddTaskForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHourglass,
  faCheckCircle,
  faSpinner,
  faComment,
  faLock,
} from '@fortawesome/free-solid-svg-icons';

const getStatusIcon = (status) => {
  switch (status) {
    case 'No Progress':
      return faHourglass;
    case 'In Progress':
      return faSpinner;
    case 'Complete':
      return faCheckCircle;
    default:
      return null;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'No Progress':
      return '#aaa';
    case 'In Progress':
      return 'orange';
    case 'Complete':
      return 'green';
    default:
      return '';
  }
};

const updateTaskStatus = async (taskId, newStatus, fetchTasks) => {
  try {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    await fetchTasks();
  } catch (error) {
    console.error('Failed to update task status:', error);
  }
};

const StatusDropdown = ({ task, updateStatus, closeDropdown }) => {
  const statuses = ['No Progress', 'In Progress', 'Complete'];

  return (
    <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        {statuses.map((status) => (
          <button
            key={status}
            className={`block w-full text-left px-4 py-2 text-sm ${
              task.status === 'Complete' ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            } flex items-center`}
            role="menuitem"
            onClick={() => {
              if (task.status !== 'Complete') {
                updateStatus(task.id, status);
                closeDropdown();
              }
            }}
            disabled={task.status === 'Complete'}
          >
            <FontAwesomeIcon
              icon={getStatusIcon(status)}
              color={getStatusColor(status)}
              className="mr-2"
            />
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

const isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  return (
    compareDate.getDate() === today.getDate() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
};

const formatDateWithTime = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
};

export default function KanbanBoard() {
  const router = useRouter();
  const [doingCollapsed, setDoingCollapsed] = useState(false);
  const [doneCollapsed, setDoneCollapsed] = useState(false);
  const [notDoingCollapsed, setNotDoingCollapsed] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null);

  const [notDoingTasks, setNotDoingTasks] = useState([]);
  const [doingTasks, setDoingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const extractProjectId = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  };
  
  const fetchTasks = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks?project_id=${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const tasks = await response.json();
  
      if (!Array.isArray(tasks)) {
        throw new Error('Response is not an array');
      }
  
      setNotDoingTasks(tasks.filter(task => task.status === 'No Progress' || task.assignedTo === ""));
      setDoingTasks(tasks.filter(task => task.status === 'In Progress' && task.assignedTo !== ""));
      setDoneTasks(tasks.filter(task => task.status === 'Complete'));
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setErrorMessage('Failed to fetch tasks. Please try again.');
    }
  };
  
  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };
  
  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };
  
  // Example usage: Fetch tasks for a specific project
  const projectId = extractProjectId();
  fetchTasks(projectId);


  const handleTaskAdded = async (newTask) => {
    let taskWithProjectId;
  
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
  
      // Extract project ID from the current path
      const pathParts = window.location.pathname.split('/');
      const projectId = pathParts[pathParts.length - 1];
  
      // Include project_id in the newTask object
      taskWithProjectId = {
        ...newTask,
        project_id: projectId
      };
  
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(taskWithProjectId),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add task');
      }
  
      await fetchTasks();
      setIsTaskFormOpen(false);
      setSuccessMessage('Task added successfully');
    } catch (error) {
      console.error('Failed to add task:', error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
      console.log('Sending task data:', JSON.stringify(taskWithProjectId));
    }
  };

  const handleTaskUpdate = async (taskId, updatedTask) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await fetchTasks();
      setIsTaskFormOpen(false);
      setSuccessMessage('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error);
      setErrorMessage('Failed to update task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await fetchTasks();
      setSuccessMessage('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      setErrorMessage('Failed to delete task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentClick = (task) => {
    router.push(`/comments?taskId=${task.id}&title=${encodeURIComponent(task.title)}&dueDate=${encodeURIComponent(task.dueDate)}&status=${encodeURIComponent(task.status)}`);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <div className="bg-white w-[111%] rounded-lg p-4 mb-14 -mt-24 h-[10vh] shadow">
        <button
          className="bg-purple-900 text-white py-2 px-4 mt-2 rounded float-right"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      {isLoading && <p className="text-center">Loading...</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

      <div className="max-w-6xl ml-6">
        {[
          { section: 'Not Doing', tasks: notDoingTasks, collapsed: notDoingCollapsed, setCollapsed: setNotDoingCollapsed },
          { section: 'Doing', tasks: doingTasks, collapsed: doingCollapsed, setCollapsed: setDoingCollapsed },
          { section: 'Done', tasks: doneTasks, collapsed: doneCollapsed, setCollapsed: setDoneCollapsed }
        ].map(({ section, tasks, collapsed, setCollapsed }, index) => (
          <div key={section} className={`mb-${index === 2 ? '4' : '14'}`}>
            <h2
              className="text-lg font-semibold mb-2 flex items-center cursor-pointer"
              onClick={() => setCollapsed(!collapsed)}
            >
              <span className="mr-2">
                {collapsed ? '▶' : '▼'}
              </span>
              {section}
            </h2>
            {!collapsed && (
              <div className="bg-white rounded shadow p-2">
                {tasks.length > 0 ? (
                  tasks.map((task, i) => (
                    <div key={i} className="relative mb-2">
                      <div className={`flex items-center justify-between text-gray-800 bg-gray-100 p-2 rounded transition-colors duration-300 ${task.status === 'Complete' ? 'opacity-50' : ''}`}>
                        <div className="flex items-center">
                          <div className={`mr-2 ${task.status === 'Complete' ? 'cursor-not-allowed' : 'cursor-pointer'} relative`}>
                            <div onClick={() => task.status !== 'Complete' && setOpenStatusDropdown(openStatusDropdown === task.id ? null : task.id)}>
                              {task.status === 'Complete' ? (
                                <FontAwesomeIcon
                                  icon={faLock}
                                  color={getStatusColor(task.status)}
                                  size="lg"
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={getStatusIcon(task.status)}
                                  color={getStatusColor(task.status)}
                                  size="lg"
                                />
                              )}
                            </div>
                            {openStatusDropdown === task.id && task.status !== 'Complete' && (
                              <StatusDropdown
                                task={task}
                                updateStatus={(taskId, newStatus) => updateTaskStatus(taskId, newStatus, fetchTasks)}
                                closeDropdown={() => setOpenStatusDropdown(null)}
                              />
                            )}
                          </div>

                          <div className="font-semibold ml-2">{task.title}</div>

                          <div className="font-semibold ml-4">{task.assignedTo}</div>

                          <div className="text-gray-600 ml-4 font-semibold flex items-center">
                            {task.status === 'Complete'
                              ? (
                                <>
                                  <span>Completed: {formatDateWithTime(task.completedDate)}</span>
                                  <span className="ml-2">Due: {formatDateWithTime(task.dueDate)}</span>
                                </>
                              )
                              : (
                                <span className={isToday(task.dueDate) ? 'text-red-500' : ''}>
                                  {formatDateWithTime(task.dueDate)}
                                </span>
                              )}
                            <FontAwesomeIcon
                              icon={faComment}
                              className="ml-4 cursor-pointer"
                              onClick={() => handleCommentClick(task)}
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <button
                            className="text-blue-500 mr-2"
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500"
                            onClick={() => handleTaskDelete(task.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {task.status === 'Complete' && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 rounded pointer-events-none"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No tasks available</div>
                )}
                {section !== 'Done' && (
                  <button
                    className="w-full font-semibold text-left text-gray-500 hover:bg-gray-100 p-2 rounded transition-colors duration-300"
                    onClick={handleAddTask}
                  >
                    + Task Add
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div>
            <TaskForm
              onClose={handleCloseTaskForm}
              onTaskAdded={handleTaskAdded}
              onTaskUpdated={handleTaskUpdate}
              initialData={editingTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}