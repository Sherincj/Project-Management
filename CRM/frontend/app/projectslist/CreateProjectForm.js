import React, { useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Select,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const CreateProjectForm = ({ onClose, onProjectCreated, onProjectUpdated, initialProject }) => {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [category, setCategory] = React.useState('');
  const [priority, setPriority] = React.useState('Highest');
  const [notification, setNotification] = React.useState('All');
  const [taskPerson, setTaskPerson] = React.useState('');
  const [name, setName] = React.useState('');
  const [budget, setBudget] = React.useState(0);
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState('Not Started');

  useEffect(() => {
    if (initialProject) {
      setName(initialProject.name);
      setCategory(initialProject.category);
      setStartDate(dayjs(initialProject.start_date).isValid() ? dayjs(initialProject.start_date) : null);
      setEndDate(dayjs(initialProject.end_date).isValid() ? dayjs(initialProject.end_date) : null);
      setNotification(initialProject.notification);
      setTaskPerson(initialProject.task_person);
      setBudget(initialProject.budget);
      setPriority(initialProject.priority);
      setDescription(initialProject.description || '');
      setStatus(initialProject.status || 'Not Started');
    }
  }, [initialProject]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!name || !category || !taskPerson || !startDate || !endDate || !notification || budget <= 0) {
      toast.error('Please fill in all required fields with valid data.');
      return;
    }

    const projectData = {
      name,
      category,
      start_date: startDate.toISOString(), // Convert to ISO string for backend
      end_date: endDate.toISOString(),     // Convert to ISO string for backend
      notification,
      task_person: taskPerson,
      budget,
      priority,
      description: description || null, // Use null for optional description if empty
      status, // Include status
    };

    try {
      const response = await fetch(`http://localhost:8000/projects/${initialProject ? initialProject.id : ''}`, {
        method: initialProject ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error('Error: ' + (errorData.detail || 'Unknown error'));
        throw new Error('Failed to save project');
      }

      const updatedProject = await response.json();
      if (initialProject) {
        onProjectUpdated(updatedProject);
      } else {
        onProjectCreated(updatedProject);
      }
      toast.success('Project saved successfully!');
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error('Error saving project: ' + error.message);
    }
  };

  return (
    <div className="p-4 max-w-[700px] w-full bg-white shadow-md rounded-md">
      <h2 className="text-2xl mb-4">{initialProject ? 'Edit Project' : 'Create Project'}</h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Project Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Project Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Project Category"
              required
            >
              <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
              <MenuItem value="Frontend Development">Frontend Development</MenuItem>
              <MenuItem value="Backend Development">Backend Development</MenuItem>
              <MenuItem value="Fullstack Development">Fullstack Development</MenuItem>
              <MenuItem value="Fashion Designer">Fashion Designer</MenuItem>
              <MenuItem value="Graphic Designer">Graphic Designer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Project Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Project End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Notification Sent</InputLabel>
            <Select
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
              label="Notification Sent"
              required
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Team Leader Only">Team Leader Only</MenuItem>
              <MenuItem value="Team Member Only">Team Member Only</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Task Assign Person"
            variant="outlined"
            fullWidth
            value={taskPerson}
            onChange={(e) => setTaskPerson(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Budget"
            variant="outlined"
            fullWidth
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseFloat(e.target.value))}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
              required
            >
              <MenuItem value="Highest">Highest</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
              required
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="Started">Started</MenuItem>
              <MenuItem value="Approval">Approval</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description (optional)"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} className="flex justify-end space-x-2">
          <Button variant="contained" className="mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {initialProject ? 'Update' : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateProjectForm;
