'use client';
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, UserCircle2 } from 'lucide-react';
import FixedHeader from '../components/Header';
import AddDepartmentForm from '../department/DepartmentAddForm';

const DepartmentsTable = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8000/department/', {
        credentials: 'include', // Include credentials
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleAddDepartment = () => {
    setShowForm(true);
    setEditMode(false);
    setEditDepartment(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditMode(false);
    setEditDepartment(null);
  };

  const handleEditDepartment = (department) => {
    setShowForm(true);
    setEditMode(true);
    setEditDepartment(department);
  };

  const handleDeleteDepartment = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/department/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Include credentials
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setDepartments(departments.filter(dept => dept.id !== id));
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  const handleDepartmentAddedOrUpdated = () => {
    fetchDepartments();
  };

  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Departments</h1>
        <button
          className="bg-purple-900 text-white px-4 py-2 rounded"
          onClick={handleAddDepartment}
        >
          Add Departments
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="mr-4 mt-4">
            <input
              type="text"
              placeholder="Search"
              className="border rounded p-1"
            />
          </div>
        </div>

        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">UNIQUE ID</th>
              <th className="py-3 px-6 text-left">DEPARTMENT HEAD</th>
              <th className="py-3 px-6 text-left">DEPARTMENT NAME</th>
              <th className="py-3 px-6 text-left">EMPLOYEE UNDERWORK</th>
              {/* <th className="py-3 px-6 text-center">ACTIONS</th> */}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{dept.id}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <UserCircle2 className="mr-2 h-8 w-8 text-gray-400" />
                    {dept.head}
                  </div>
                </td>
                <td className="py-3 px-6 text-left">{dept.name}</td>
                <td className="py-3 px-6 text-left">{dept.employees}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center space-x-2">
                    <button className="text-green-500 hover:text-green-600" onClick={() => handleEditDepartment(dept)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteDepartment(dept.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <AddDepartmentForm onClose={handleCloseForm} editMode={editMode} editDepartment={editDepartment} onDepartmentAddedOrUpdated={handleDepartmentAddedOrUpdated} />}
    </div>
  );
};

export default DepartmentsTable;
