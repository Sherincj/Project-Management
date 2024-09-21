import React from 'react';
import FixedHeader from '../components/Header';

const TaskManagement = () => {
  return (
    <div className="p-4 sm:p-6 bg-gray-100 lg:ml-64">
      <FixedHeader />
      <div className="mt-16 sm:mt-20 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Task Management</h1>
        {/* <button className="mt-2 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded">+ Create Task</button> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Task Progress */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Task Progress</h2>
          <div className="space-y-4">
            {['Website Design', 'Quality Assurance', 'Development', 'Testing', ].map((task, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <span className="text-sm sm:text-base">{task}</span>
                <div className="w-full sm:w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${['bg-blue-300', 'bg-green-300', 'bg-orange-300', 'bg-yellow-300'][index]}`} style={{width: ['70%', '30%', '50%', '90%'][index]}}></div>
                </div>
                <span className="text-xs text-gray-500">01/0{index + 3}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { initials: 'RH', name: 'Rechard', action: 'Add New Task', time: '20Min ago' },
              { initials: 'SP', name: 'Shipa', action: 'Review Completed', time: '40Min ago' },
              { initials: 'MR', name: 'Mora', action: 'Task To Completed', time: '1Hr ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${['bg-green-500', 'bg-pink-300', 'bg-purple-300'][index]}`}>
                  {activity.initials}
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">{activity.name} {activity.action}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Status Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {['In Progress', 'Needs Review', 'Completed'].map((status, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">{status}</h2>
            <div className="bg-gray-100 p-4 rounded">
              <div className="flex flex-wrap justify-between items-center mb-2 space-y-2 sm:space-y-0">
                
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In id nec scelerisque massa.</p>
              <div className="flex flex-wrap justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                <span>28 Mar</span>
           
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManagement;
