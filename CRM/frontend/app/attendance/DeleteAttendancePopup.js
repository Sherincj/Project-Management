import React from 'react';

const DeleteAttendancePopup = ({ onClose, onConfirm, employeeName, date }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Delete Attendance</h2>
        <p className="mb-4">Are you sure you want to delete the attendance record for {employeeName} on {date}?</p>
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAttendancePopup;
