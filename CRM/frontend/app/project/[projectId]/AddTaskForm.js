import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglass,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Autocomplete from "@mui/material/Autocomplete";

const TaskForm = ({ onClose, onTaskAdded, onTaskUpdated, initialData }) => {
  const [selectedStatusIcon, setSelectedStatusIcon] = useState(faHourglass);

  const today = new Date().toISOString().split('T')[0];
  const twoDaysLater = new Date();
  twoDaysLater.setDate(twoDaysLater.getDate() + 2);
  const dueDateWithTime = `${twoDaysLater.toISOString().split('T')[0]}T17:30`;

  const [taskData, setTaskData] = useState({
    title: "",
    assignedTo: "",
    startDate: today,
    dueDate: dueDateWithTime,
    status: "No Progress",
    created_by: "nizam@gmail.com",
  });

  useEffect(() => {
    if (initialData) {
      setTaskData({
        ...initialData,
        dueDate: initialData.dueDate, // Ensure dueDate is in the correct format
      });

      switch (initialData.status) {
        case "No Progress":
          setSelectedStatusIcon(faHourglass);
          break;
        case "In Progress":
          setSelectedStatusIcon(faSpinner);
          break;
        case "Complete":
          setSelectedStatusIcon(faCheckCircle);
          break;
        default:
          break;
      }
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "status") {
      switch (e.target.value) {
        case "No Progress":
          setSelectedStatusIcon(faHourglass);
          break;
        case "In Progress":
          setSelectedStatusIcon(faSpinner);
          break;
        case "Complete":
          setSelectedStatusIcon(faCheckCircle);
          break;
        default:
          break;
      }
    }
  };

  const handleAutocompleteChange = (event, value) => {
    setTaskData({
      ...taskData,
      assignedTo: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      onTaskUpdated(initialData.id, taskData);
    } else {
      onTaskAdded(taskData);
    }
  };

  const assignees = [
    "Unassigned",
    "Everyone",
    "Aayisha",
    "Abhijith V.",
    "abhijithuday72543",
    "Abhinandana",
    "ABIN R.",
  ];

  return (
    <div className="p-6 bg-white w-[800px] rounded-md shadow-md">
      <h3 className="text-2xl font-bold mb-6">{initialData ? "Edit Task" : "Add Task"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TextField
            label="Task Title"
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <Autocomplete
            options={assignees}
            value={taskData.assignedTo}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assigned To"
                name="assignedTo"
                margin="normal"
                fullWidth
              />
            )}
          />
          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            value={taskData.startDate}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Due Date"
            type="datetime-local"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Status"
            select
            name="status"
            value={taskData.status}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          >
            <MenuItem value="No Progress">
              <ListItemIcon>
                <FontAwesomeIcon icon={faHourglass} color="#aaa" size="1x" />
              </ListItemIcon>
              No Progress
            </MenuItem>
            <MenuItem value="In Progress">
              <ListItemIcon>
                <FontAwesomeIcon icon={faSpinner} color="orange" size="1x" />
              </ListItemIcon>
              In Progress
            </MenuItem>
            <MenuItem value="Complete">
              <ListItemIcon>
                <FontAwesomeIcon icon={faCheckCircle} color="green" size="1x" />
              </ListItemIcon>
              Complete
            </MenuItem>
          </TextField>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
