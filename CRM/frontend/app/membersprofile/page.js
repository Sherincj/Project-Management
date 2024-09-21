import React from 'react';
import FixedHeader from '../components/Header';

const EmployeeDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      {/* Main Container with reduced width */}
      <div className="container mx-auto mt-16 sm:mt-14 max-w-4xl pl-4 sm:pl-6 md:pl-8">
        <FixedHeader />
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 md:mb-8">Employee Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4">
              <div className="w-20 h-20 bg-red-500 rounded-full flex-shrink-0 mb-2 sm:mb-0"></div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">Luke Short</h2>
                <p className="text-gray-600">Web Designer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-semibold">Phone:</span> 202-555-0174</p>
                <p><span className="font-semibold">Date of Birth:</span> 19/03/1980</p>
              </div>
              <div>
                <p><span className="font-semibold">Email:</span> LukeShort@gmail.com</p>
                <p><span className="font-semibold">Address:</span> 2734 West Fork Street, EASTON 02334.</p>
              </div>
            </div>
          </div>

          {/* Current Task Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Current Task</h3>
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap justify-between items-center mb-2">
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded mb-1 sm:mb-0">UI/UX Design</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">In progress</span>
                </div>
                <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In id nec scelerisque massa.</p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-2 inline-block">Social Geek Made</span>
              </div>
              <div>
                <div className="flex flex-wrap justify-between items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mb-1 sm:mb-0">Website Design</span>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Review</span>
                </div>
                <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In id nec scelerisque massa.</p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-2 inline-block">Practice to Perfect</span>
              </div>
            </div>
          </div>

          {/* Current Work Project Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Current Work Project</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-xs">SG</span>
                  </div>
                  <span className="font-medium">Social Geek Made</span>
                </div>
                <h4 className="font-semibold mb-2">UI/UX Design</h4>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>5 Attach</span>
                  <span>4 Month</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>5 Members</span>
                  <span>10</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>35 Days Left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-pink-500 h-2.5 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">PP</span>
                  </div>
                  <span className="font-medium">Practice to Perfect</span>
                </div>
                <h4 className="font-semibold mb-2">Website Design</h4>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>4 Attach</span>
                  <span>1 Month</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>4 Members</span>
                  <span>3</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>15 Days Left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-pink-500 h-2.5 rounded-full w-11/12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Information Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Bank Information</h3>
            <ul className="space-y-2">
              {[
                { label: 'Bank Name', value: 'Kotak' },
                { label: 'Account No.', value: '5436874596325486' },
                { label: 'IFSC Code', value: 'Kotak000021' },
                { label: 'Pan No', value: 'ACQPF6584L' },
                { label: 'UPI Id', value: '454812kotak@upi' },
              ].map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="break-all">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
