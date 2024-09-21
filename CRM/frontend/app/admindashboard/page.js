import React from 'react';
import FixedHeader from '../components/Header';
import { FileText, Users, UserCheck, CheckSquare, Clock, XCircle, Umbrella, User } from 'lucide-react';
import Image from 'next/image';

const DashboardCard = ({ icon: Icon, title, value, subtitle, color, chart }) => (
  <div className={`p-4 rounded-lg ${color === 'purple' ? 'bg-purple-900 text-white' : 'bg-white shadow'}`}>
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-full ${color === 'purple' ? 'bg-purple-500' : 'bg-gray-100'}`}>
        <Icon size={24} className={color === 'purple' ? 'text-white' : 'text-gray-600'} />
      </div>
      {chart && <div className="text-gray-400">{chart}</div>}
    </div>
    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{value}</div>
    <div className={`text-xs sm:text-sm ${color === 'purple' ? 'text-purple-200' : 'text-gray-500'}`}>{subtitle || title}</div>
  </div>
);

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="p-3 sm:p-4 bg-gray-100 rounded-lg shadow">
    <div className="flex items-center mb-2">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-gray-600" />
      <h3 className="text-xs sm:text-sm font-medium text-gray-600">{title}</h3>
    </div>
    <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">{value}</p>
  </div>
);

const PercentageLine = ({ label, percentage, color }) => (
  <div className="mb-3 sm:mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
      <span className="text-xs sm:text-sm font-medium text-gray-700">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
      <div
        className={`h-2 sm:h-2.5 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

const EmployeeStats = ({ totalEmployees, menPercentage, womenPercentage }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
    <div className="p-3 sm:p-4">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Total Employees</h2>
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4">{totalEmployees}</div>
      <PercentageLine label="Men" percentage={menPercentage} color="bg-blue-500" />
      <PercentageLine label="Women" percentage={womenPercentage} color="bg-pink-500" />
    </div>
  </div>
);

const InterviewList = ({ interviews }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-lg sm:text-xl font-bold p-4 bg-white">Upcoming Interviews</h2>
      <ul className="divide-y divide-gray-200">
        {interviews.map((interview) => (
          <li key={interview.name} className="flex items-center p-4 hover:bg-gray-50">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="text-gray-600" size={20} />
            </div>
            <div className="ml-4 flex-grow">
              <p className="text-sm font-medium text-gray-900">{interview.name}</p>
              <p className="text-xs text-gray-500">{interview.role}</p>
            </div>
            <span className="text-xs text-gray-500">{interview.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
};

const ComprehensiveEmployeeDashboard = () => {
  const performers = [
    { name: "Luke Short", username: "@Short", percentage: 80 },
    { name: "John Hard", username: "@rdacre", percentage: 70 },
    { name: "Paul Rees", username: "@Rees", percentage: 77 },
    { name: "Rachel Parr", username: "@Parr", percentage: 85 },
    { name: "Eric Reid", username: "@Eric", percentage: 95 },
  ];

  const interviews = [
    { name: "Natalie Gibson", role: "UI/UX Designer", time: "1:30 - 1:30" },
    { name: "Peter Piperg", role: "Web Design", time: "9:00 - 1:30" },
    { name: "Robert Young", role: "PHP Developer", time: "1:30 - 2:30" },
    { name: "Victoria Vbell", role: "IOS Developer", time: "2:00 - 3:30" },
    { name: "Mary Butler", role: "Writer", time: "4:00 - 4:30" },
  ];

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <FixedHeader />
      <div className="mt-16 sm:mt-20 md:mt-24 md:ml-0 lg:ml-72">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Employees Availability</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatCard icon={CheckSquare} title="Attendance" value="400" />
              <StatCard icon={Clock} title="Late Coming" value="17" />
              <StatCard icon={XCircle} title="Absent" value="06" />
              <StatCard icon={Umbrella} title="Leave Apply" value="14" />
            </div>
          </div>

          <EmployeeStats totalEmployees={423} menPercentage={48} womenPercentage={52} />

          <div className="space-y-4 sm:space-y-6">
            <DashboardCard
              icon={FileText}
              value="1546"
              subtitle="Applications"
              color="purple"
            />
            <DashboardCard
              icon={Users}
              value="246"
              subtitle="Interviews"
              chart={
                <svg width="50" height="20" viewBox="0 0 50 20">
                  <rect x="0" y="10" width="6" height="10" fill="currentColor" opacity="0.4" />
                  <rect x="8" y="5" width="6" height="15" fill="currentColor" opacity="0.4" />
                  <rect x="16" y="15" width="6" height="5" fill="currentColor" opacity="0.4" />
                  <rect x="24" y="8" width="6" height="12" fill="currentColor" opacity="0.4" />
                  <rect x="32" y="12" width="6" height="8" fill="currentColor" opacity="0.4" />
                </svg>
              }
            />
            <DashboardCard
              icon={UserCheck}
              value="101"
              subtitle="Hired"
              chart={
                <svg width="50" height="20" viewBox="0 0 50 20">
                  <polyline
                    points="0,15 10,10 20,15 30,5 40,10 50,0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <InterviewList interviews={interviews} />
        </div>

      </div>
    </div>
  );
};

export default ComprehensiveEmployeeDashboard;
