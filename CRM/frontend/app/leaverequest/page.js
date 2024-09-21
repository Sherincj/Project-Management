'use client'
import React, { useState, useEffect } from 'react';
import FixedHeader from '../components/Header';
import LeaveApplicationForm from '../leaverequest/LeaveAddForm';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

const LeaveRequestTable = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leaveData, setLeaveData] = useState([]);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const fetchLeaveRequests = () => {
    axios.get('http://localhost:8000/leave_request/')
      .then(response => {
        setLeaveData(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave requests:', error);
      });
  };

  useEffect(() => {
    // Initial fetch
    fetchLeaveRequests();

    // Polling mechanism to fetch leave requests every 5 seconds
    const intervalId = setInterval(fetchLeaveRequests, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = (leaveId) => {
    axios.delete(`http://localhost:8000/leave_request/${leaveId}`)
      .then(response => {
        setLeaveData(leaveData.filter(leave => leave.id !== leaveId));
      })
      .catch(error => {
        console.error('Error deleting leave request:', error);
      });
  };

  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Leave Request</h1>
        <button
          className="bg-purple-900 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={toggleForm}
        >
          Add Leave
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <LeaveApplicationForm onClose={toggleForm} />
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
          <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto">
            <span className="mr-2">Show</span>
            <select className="border rounded p-1">
              <option>10</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <input type="text" placeholder="Search" className="border rounded p-1 w-full" />
          </div>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          {leaveData.map((leave) => (
            <div key={leave.id} className="border-b p-4">
              <div className="flex items-center mb-2">
                <span className="font-medium">{leave.name}</span>
              </div>
              <p className="text-sm text-red-500 mb-1">{leave.id}</p>
              <p className="text-sm mb-1"><span className="font-medium">Type:</span> {leave.leave_type}</p>
              <p className="text-sm mb-1"><span className="font-medium">From:</span> {leave.from_date}</p>
              <p className="text-sm mb-1"><span className="font-medium">To:</span> {leave.to_date}</p>
              <p className="text-sm mb-2"><span className="font-medium">Reason:</span> {leave.reason}</p>
              <p className="text-sm mb-2"><span className="font-medium">Status:</span> {leave.status}</p>
              <div className="flex justify-end">
                <button className="text-gray-600 hover:text-gray-900" onClick={() => handleDelete(leave.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LEAVE TYPE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FROM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REASON</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveData.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{leave.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{leave.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.leave_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.from_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.to_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-gray-600 hover:text-gray-900" onClick={() => handleDelete(leave.id)}>
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestTable;
