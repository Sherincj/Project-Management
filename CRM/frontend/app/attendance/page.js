
'use client'
import React, { useState, useEffect } from 'react';
import { Check, Circle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import FixedHeader from '../components/Header';
import axios from 'axios';
import AttendancePopup from './AttendancePopup';
import AttendanceTypePopup from './AttendanceTypePopup';
import DeleteAttendancePopup from './DeleteAttendancePopup';

const AttendanceTable = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceTypeModalOpen, setAttendanceTypeModalOpen] = useState(false);
  const [attendancePopupOpen, setAttendancePopupOpen] = useState(false);
  const [deleteAttendancePopupOpen, setDeleteAttendancePopupOpen] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [currentAttendanceId, setCurrentAttendanceId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8000/employees/', {
          credentials: 'include',
        });
        const data = await response.json();
        setEmployees(data);
        await fetchAttendanceRecords();
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [selectedMonth, selectedYear]);

  const fetchAttendanceRecords = async () => {
    try {
      const attendanceResponse = await fetch(`http://localhost:8000/attendance/?month=${selectedMonth + 1}&year=${selectedYear}`, {
        credentials: 'include',
      });
      const attendanceRecords = await attendanceResponse.json();
      const initialAttendanceData = {};

      attendanceRecords.forEach(record => {
        if (!initialAttendanceData[record.name]) {
          initialAttendanceData[record.name] = {};
        }
        initialAttendanceData[record.name][record.date] = record.status;
      });

      setAttendanceData(initialAttendanceData);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderAttendanceIcon = (status) => {
    if (status === "full_day_present") return <Check className="text-green-500 mx-auto" size={16} />;
    if (status === "half_day_present") return <Circle className="text-yellow-500 mx-auto" size={16} />;
    if (status === "absent") return <X className="text-red-500 mx-auto" size={16} />;
    return <span className="text-gray-300">-</span>;
  };

  const openAttendanceTypeModal = (employeeId, day) => {
    const attendanceDate = new Date(selectedYear, selectedMonth, day + 1).toISOString().split('T')[0];
    setCurrentDate(attendanceDate);
    if (!attendanceData[employeeId] || !attendanceData[employeeId][attendanceDate]) {
      setCurrentEmployeeId(employeeId);
      setCurrentAttendanceId(null);
      setAttendanceTypeModalOpen(true);
    }
  };

  const handleAttendanceTypeChange = async (status) => {
    if (currentEmployeeId && currentDate) {
      const attendanceRecord = {
        name: currentEmployeeId,
        date: currentDate,
        status: status,
      };

      try {
        await axios.post('http://localhost:8000/attendance/', attendanceRecord, {
          withCredentials: true,
        });
        setAttendanceData(prev => ({
          ...prev,
          [currentEmployeeId]: {
            ...prev[currentEmployeeId],
            [currentDate]: status,
          },
        }));
      } catch (error) {
        console.error('Error saving attendance:', error);
      }
    }
    setAttendanceTypeModalOpen(false);
  };

  const openEditModal = (employeeId, day) => {
    const attendanceDate = new Date(selectedYear, selectedMonth, day + 1).toISOString().split('T')[0];
    const attendanceStatus = attendanceData[employeeId]?.[attendanceDate] || null;

    if (attendanceStatus) {
      setCurrentEmployeeId(employeeId);
      setCurrentAttendanceId(attendanceDate);
      setIsEditing(true);
      setAttendancePopupOpen(true);
    }
  };

 const handleEditAttendance = async (id, person, date, attendanceType) => {
    // Convert date to a consistent format (YYYY-MM-DD) without time component
    const formattedDate = new Date(date.setHours(0, 0, 0, 0)).toISOString().split('T')[0];

    try {
        // Log the update attempt for debugging
        console.log(`Updating attendance for ID: ${id}, Person: ${person}, Date: ${formattedDate}, Status: ${attendanceType}`);

        // Send the PUT request to update attendance
        const response = await axios.put(
            `http://localhost:8000/attendance/${id}`,
            {
                name: person,
                date: formattedDate, // Send only the date part
                status: attendanceType,
            },
            {
                withCredentials: true, // Include credentials for authentication
            }
        );

        if (response.status === 200) {
            // Update the local state with the new attendance data
            setAttendanceData((prevData) => {
                const updatedAttendanceData = { ...prevData };
                if (!updatedAttendanceData[person]) {
                    updatedAttendanceData[person] = {}; // Initialize person entry if it doesn't exist
                }
                updatedAttendanceData[person][formattedDate] = attendanceType; // Update using the formatted date
                return updatedAttendanceData;
            });

            // Close the attendance popup
            setAttendancePopupOpen(false);

            console.log('Attendance updated successfully:', response.data);
        } else {
            console.warn('Unexpected response status:', response.status);
        }
    } catch (error) {
        console.error('Error updating attendance:', error);
        alert('Failed to update attendance. Please try again.');
    }
};

  const openDeleteModal = (employeeId, day) => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    if (day >= 0 && day < daysInMonth) {
      const attendanceDate = new Date(selectedYear, selectedMonth, day + 1).toISOString().split('T')[0];
      const attendanceStatus = attendanceData[employeeId]?.[attendanceDate] || null;
  
      if (attendanceStatus) {
        setCurrentEmployeeId(employeeId);
        setCurrentDate(attendanceDate);
        setDeleteAttendancePopupOpen(true);
      }
    } else {
      console.error('Invalid date');
    }
  };

  const handleDeleteAttendance = async () => {
    if (currentEmployeeId && currentDate) {
      try {
        await axios.delete(`http://localhost:8000/attendance/`, {
          data: {
            date: currentDate,
            name: currentEmployeeId,
          },
          withCredentials: true,
        });
  
        const updatedAttendanceData = { ...attendanceData };
        delete updatedAttendanceData[currentEmployeeId][currentDate];
        setAttendanceData(updatedAttendanceData);
  
        setDeleteAttendancePopupOpen(false);
      } catch (error) {
        console.error('Error deleting attendance:', error);
      }
    }
  };
  

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Attendance (Admin)</h1>
        <div className="space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setIsEditing(false);
              setAttendancePopupOpen(true);
            }}
          >
            Edit Attendance
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button onClick={handlePreviousMonth} className="p-2 rounded hover:bg-gray-200">
          <ChevronLeft size={20} />
        </button>
        <div className="text-lg font-bold">
          {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} {selectedYear}
        </div>
        <button onClick={handleNextMonth} className="p-2 rounded hover:bg-gray-200">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b border-r font-medium text-left">EMPLOYEE</th>
              {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => (
                <th key={i} className="py-2 px-2 border-b border-r font-medium text-center">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="bg-white">
                <td className="py-2 px-4 border-b border-r font-medium">{employee.name}</td>
                {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, dayIndex) => {
                  const attendanceDate = new Date(selectedYear, selectedMonth, dayIndex + 1).toISOString().split('T')[0];
                  return (
                    <td
                      key={dayIndex}
                      className="py-2 px-2 border-b border-r text-center cursor-pointer"
                      onClick={() => openAttendanceTypeModal(employee.name, dayIndex)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        openDeleteModal(employee.name, dayIndex);
                      }}
                    >
                      {renderAttendanceIcon(attendanceData[employee.name] && attendanceData[employee.name][attendanceDate])}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {attendanceTypeModalOpen && (
        <AttendanceTypePopup
          onClose={() => setAttendanceTypeModalOpen(false)}
          onSave={handleAttendanceTypeChange}
        />
      )}

      {attendancePopupOpen && (
        <AttendancePopup
          employees={employees}
          selectedDate={new Date(selectedYear, selectedMonth)}
          onClose={() => setAttendancePopupOpen(false)}
          onSave={handleEditAttendance}
          isEditing={isEditing}
          currentEmployeeId={currentEmployeeId}
          currentAttendanceId={currentAttendanceId}
          attendanceData={attendanceData}
        />
      )}

      {deleteAttendancePopupOpen && (
        <DeleteAttendancePopup
          onClose={() => setDeleteAttendancePopupOpen(false)}
          onConfirm={handleDeleteAttendance}
          employeeName={currentEmployeeId}
          date={currentDate}
        />
      )}
    </div>
  );
};

export default AttendanceTable;