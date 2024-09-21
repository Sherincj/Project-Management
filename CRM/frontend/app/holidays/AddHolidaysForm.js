"use client";

import { useState } from 'react';
import { TextField, Button, Grid, Alert, CircularProgress } from '@mui/material';

export default function AddHolidays({ onClose }) {
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to format the date to DD-MM-YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle input change for the date and format it as DD-MM-YYYY for display
  const handleDateChange = (e) => {
    const formattedDate = e.target.value;
    setHolidayDate(formattedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedHolidayDate = formatDate(holidayDate); // Format the date for submission
      const response = await fetch('http://localhost:8000/api/holidays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: holidayName,
          date: formattedHolidayDate, // Use the formatted date here
        }),
        credentials: 'include', // Include credentials for token authentication
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to create holiday');
      }

      const newHoliday = await response.json();
      console.log('Holiday created successfully:', newHoliday);

      // Reset form fields
      setHolidayName('');
      setHolidayDate('');
      onClose();
    } catch (error) {
      console.error('Error creating holiday:', error);
      setError('Failed to create holiday. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 -ml-14 w-[650px]">
      <div className="p-4">
        <h2 className="text-2xl mb-4">Add Holiday</h2>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} className="mb-6">
              <TextField
                fullWidth
                id="holidayName"
                label="Holiday Name"
                variant="outlined"
                placeholder="Enter holiday name"
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
                required
                aria-label="Holiday Name"
              />
            </Grid>
            <Grid item xs={12} className="mb-6">
              <TextField
                fullWidth
                id="holidayDate"
                label="Holiday Date"
                variant="outlined"
                value={holidayDate}
                onChange={handleDateChange}
                required
                type="date"
                InputLabelProps={{
                  shrink: true, // Keeps the label above the date input
                }}
                aria-label="Holiday Date"
              />
            </Grid>
            <Grid item xs={12} className="flex justify-end space-x-2">
              <Button variant="outlined" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                className="mr-2"
              >
                {loading ? <CircularProgress size={24} /> : 'Send'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
}