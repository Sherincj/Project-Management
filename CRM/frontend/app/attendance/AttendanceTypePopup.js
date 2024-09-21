import React from 'react';
import { Check, Circle, X } from 'lucide-react';

const AttendanceTypePopup = ({ onClose, onSave }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-2">Select Attendance Type</h2>
        <div className="flex justify-around mb-4">
          <button onClick={() => onSave("full_day_present")} className="flex items-center">
            <Check className="text-green-500 mr-1" size={20} />
            <span>Full Day Present</span>
          </button>
          <button onClick={() => onSave("half_day_present")} className="flex items-center">
            <Circle className="text-yellow-500 mr-1" size={20} />
            <span>Half Day Present</span>
          </button>
          <button onClick={() => onSave("absent")} className="flex items-center">
            <X className="text-red-500 mr-1" size={20} />
            <span>Full Day Absent</span>
          </button>
        </div>
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AttendanceTypePopup;
