'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid } from '@mui/material';

const AddDepartmentForm = ({ onClose, editMode, editDepartment, onDepartmentAddedOrUpdated }) => {
  const [departmentHead, setDepartmentHead] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [employeeUnderWork, setEmployeeUnderWork] = useState('');

  useEffect(() => {
    if (editMode && editDepartment) {
      setDepartmentHead(editDepartment.head);
      setDepartmentName(editDepartment.name);
      setEmployeeUnderWork(editDepartment.employees);
    }
  }, [editMode, editDepartment]);

  const handleSubmit = async () => {
    try {
      if (editMode) {
        const response = await fetch(`http://localhost:8000/department/${editDepartment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ head: departmentHead, name: departmentName, employees: employeeUnderWork }),
          credentials: 'include', // Include credentials
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        onDepartmentAddedOrUpdated();
      } else {
        const response = await fetch('http://localhost:8000/department/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ head: departmentHead, name: departmentName, employees: employeeUnderWork }),
          credentials: 'include', // Include credentials
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        onDepartmentAddedOrUpdated();
      }
      onClose();
    } catch (error) {
      console.error('Failed to add/update department:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl mb-4">{editMode ? 'Edit Department' : 'Add Department'}</h2>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Department Head"
              variant="outlined"
              fullWidth
              value={departmentHead}
              onChange={(e) => setDepartmentHead(e.target.value)}
              className="mb-4"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Department Name"
              variant="outlined"
              fullWidth
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="mb-4"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Employee Under Work"
              variant="outlined"
              fullWidth
              value={employeeUnderWork}
              onChange={(e) => setEmployeeUnderWork(e.target.value)}
              className="mb-4"
            />
          </Grid>
          <Grid item xs={12} className="flex justify-end space-x-2">
            <Button
              variant="outlined"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              className="mr-2"
            >
              {editMode ? 'Update' : 'Send'}
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AddDepartmentForm;
