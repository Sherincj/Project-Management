'use client'
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import FixedHeader from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// AddHolidays Component
const AddHolidays = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({ name: '', date: '' });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{initialData ? 'Edit Holiday' : 'Add Holiday'}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Holiday Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          >
            {initialData ? 'Update' : 'Add'} Holiday
          </button>
        </div>
      </form>
    </div>
  );
};

// Main HolidayList Component
const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/holidays', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming the token is stored in localStorage
        },
        credentials: 'include', // To include cookies if needed
      });
      if (!response.ok) throw new Error('Failed to fetch holidays');
      const data = await response.json();
      setHolidays(data);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error('Failed to fetch holidays');
    }
  };

  const openModal = (holiday = null) => {
    setEditingHoliday(holiday);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHoliday(null);
  };

  const handleSave = async (holidayData) => {
    try {
      const url = editingHoliday
        ? `http://localhost:8000/api/holidays/${editingHoliday.id}`
        : 'http://localhost:8000/api/holidays';
      const method = editingHoliday ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Add the access token here
        },
        body: JSON.stringify(holidayData),
        credentials: 'include', // Ensure credentials are included if cookies are needed
      });

      if (!response.ok) throw new Error('Failed to save holiday');

      fetchHolidays();
      closeModal();
      toast.success(`Holiday ${editingHoliday ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error saving holiday:', error);
      toast.error('Failed to save holiday');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/holidays/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Add the access token here
          },
          credentials: 'include', // Ensure credentials are included if cookies are needed
        });

        if (!response.ok) throw new Error('Failed to delete holiday');

        fetchHolidays();
        toast.success('Holiday deleted successfully');
      } catch (error) {
        console.error('Error deleting holiday:', error);
        toast.error('Failed to delete holiday');
      }
    }
  };

  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Holidays</h1>
        <button
          className="bg-purple-900 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={() => openModal()}
        >
          + Add Holidays
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
          <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto">
            <span className="mr-2">Show</span>
            <select className="border rounded px-2 py-1">
              <option>10</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <input type="text" placeholder="Search:" className="border rounded px-2 py-1 w-full" />
          </div>
        </div>

        {/* Mobile view: Cards */}
        <div className="sm:hidden">
          {holidays.map((holiday) => (
            <div key={holiday.id} className="border-b p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-red-500">#{holiday.id}</span>
                <div className="flex space-x-2">
                  <button className="text-green-500" onClick={() => openModal(holiday)}><Pencil size={16} /></button>
                  <button className="text-red-500" onClick={() => handleDelete(holiday.id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <p><span className="font-semibold">Date:</span> <span className="text-red-500">{holiday.date}</span></p>
              <p><span className="font-semibold">Name:</span> <span className="text-red-500">{holiday.name}</span></p>
            </div>
          ))}
        </div>

        {/* Desktop view: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">#</th>
                <th className="border p-2 text-left">HOLIDAY DATE</th>
                <th className="border p-2 text-left">HOLIDAY NAME</th>
                <th className="border p-2 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr key={holiday.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-red-500">{holiday.id}</td>
                  <td className="border p-2 text-red-500">{holiday.date}</td>
                  <td className="border p-2 text-red-500">{holiday.name}</td>
                  <td className="border p-2">
                    <div className="flex space-x-2">
                      <button className="text-green-500" onClick={() => openModal(holiday)}><Pencil size={16} /></button>
                      <button className="text-red-500" onClick={() => handleDelete(holiday.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex flex-col sm:flex-row justify-between items-center">
          <span className="mb-2 sm:mb-0">Showing 1 to {holidays.length} of {holidays.length} entries</span>
          <div className="space-x-2">
            {/* Pagination controls can be added here */}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full m-4">
            <AddHolidays onClose={closeModal} onSave={handleSave} initialData={editingHoliday} />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default HolidayList;
