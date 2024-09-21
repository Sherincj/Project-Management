import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';
import FixedHeader from '../components/Header';

const statisticsData = [
  { name: 'Today', value: 2, total: 8 },
  { name: 'This Week', value: 1, total: 40 },
  { name: 'This Month', value: 2, total: 160 },
  { name: 'Overtime', value: 15.5, total: 24 },
  { name: 'Remaining', value: 1, total: 8 },
];

const recentActivity = [
  { type: 'PH', label: 'Punch In at', time: '10 Am' },
  { type: 'PO', label: 'Punch Out at', time: '11:30 Am' },
  { type: 'BR', label: 'Break Time', time: '1 Pm to 2 Pm' },
  { type: 'PO', label: 'Punch IN at', time: '2:10 Pm' },
  { type: 'PO', label: 'Punch Out at', time: '7:30 Pm' },
];

const timeEntries = [
  { date: 'June 26, 2021', punchIn: '10:05 AM', punchOut: '09:05 PM', breakTime: '01:12 Hr', halfDay: false, fullDay: true, overtime: '01:39 Hr', totalProduction: '09:39 Hr' },
  { date: 'June 25, 2021', punchIn: '10:05 AM', punchOut: '09:05 PM', breakTime: '01:12 Hr', halfDay: false, fullDay: true, overtime: '01:39 Hr', totalProduction: '09:39 Hr' },
  { date: 'June 24, 2021', punchIn: '10:00 AM', punchOut: '02:00 PM', breakTime: '00:00', halfDay: true, fullDay: false, overtime: '00:00', totalProduction: '04:00 Hr' },
];

const Dashboard = () => {
  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-lg shadow w-full h-auto">
          <h2 className="text-lg font-semibold mb-6">Statistics</h2>
          <div className="space-y-6">
            {statisticsData.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 text-sm">{item.name}</span>
                <div className="flex-grow">
                  <div className="bg-gray-200 h-3 rounded-full">
                    <div
                      className={`h-3 rounded-full ${
                        index === 0 ? 'bg-purple-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-green-500' :
                        index === 3 ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${(item.value / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="w-16 text-right text-sm">{item.value}/{item.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
