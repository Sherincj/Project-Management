import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Grid,
} from '@mui/material';

const AttendancePopup = ({
  employees,
  selectedDate,
  onClose,
  onSave,
  isEditing,
  currentEmployeeId,
  currentAttendanceId,
  attendanceData,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendanceType, setAttendanceType] = useState('full_day_present');
  const [attendanceDate, setAttendanceDate] = useState(new Date());

  useEffect(() => {
    if (isEditing && currentEmployeeId && currentAttendanceId) {
      setSelectedEmployee(currentEmployeeId);
      setAttendanceType(attendanceData[currentEmployeeId][currentAttendanceId] || 'full_day_present');
      setAttendanceDate(new Date(currentAttendanceId));
    } else {
      setSelectedEmployee('');
      setAttendanceType('full_day_present');
      setAttendanceDate(new Date());
    }
  }, [isEditing, currentEmployeeId, currentAttendanceId, attendanceData]);

  const handleSave = async () => {
    if (selectedEmployee && attendanceDate) {
      const attendanceUpdate = {
        name: selectedEmployee,
        date: attendanceDate.toISOString().split('T')[0],
        status: attendanceType,
      };
      try {
        console.log('Sending attendance update request:', attendanceUpdate);
        if (isEditing && currentAttendanceId) {
          await axios.put(`http://localhost:8000/attendance/${currentAttendanceId}`, attendanceUpdate, {
            withCredentials: true,
          });
        } else {
          const response = await axios.post('http://localhost:8000/attendance/', attendanceUpdate, {
            withCredentials: true,
          });
          attendanceUpdate.id = response.data.id;
        }
        onSave(attendanceUpdate.id, selectedEmployee, attendanceDate, attendanceType);
        onClose();
      } catch (error) {
        console.error('Error saving attendance:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6">
          <h2 className="text-2xl mb-4">Add Attendance</h2>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <FormControl fullWidth>
                <InputLabel id="employee-label">Select Employee</InputLabel>
                <Select
                  labelId="employee-label"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  label="Select Employee"
                >
                  <MenuItem value="">Select an employee</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.name}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  id="date"
                  label="Select Date"
                  type="date"
                  value={attendanceDate.toISOString().split('T')[0]}
                  onChange={(e) => setAttendanceDate(new Date(e.target.value))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup value={attendanceType} onChange={(e) => setAttendanceType(e.target.value)}>
                  {['full_day_present', 'half_day_present', 'absent'].map((type) => (
                    <FormControlLabel
                      key={type}
                      value={type}
                      control={<Radio />}
                      label={type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
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
              className="mr-2"
              onClick={handleSave}  // Ensure handleSave is called here
            >
              Send
            </Button>
          </Grid>
          </Grid>
      </div>
    </div>
  );
};

export default AttendancePopup;
