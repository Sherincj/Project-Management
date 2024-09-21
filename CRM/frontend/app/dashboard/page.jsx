// "use client";

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FileText, ClipboardCheck, Activity } from 'lucide-react';
// import FixedHeader from '../components/Header';
// import dayjs from 'dayjs';

// const ProjectStats = ({ totalProjects, comingProjects, progressProjects, finishedProjects }) => {
//   const stats = [
//     { title: "Total Projects", value: totalProjects, icon: "📄" },
//     { title: "Coming Projects", value: comingProjects, icon: "🏗️" },
//     { title: "Progress Projects", value: progressProjects, icon: "🔗" },
//     { title: "Finished Projects", value: finishedProjects, icon: "📋" },
//   ];

//   return (
//     <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 xl:gap-6">
//       {stats.map((stat, index) => (
//         <StatCard key={index} {...stat} />
//       ))}
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon }) => {
//   return (
//     <div className="bg-[#4C3575] my-3 md:my-4 lg:my-6 text-white p-2 md:p-4 rounded-lg">
//       <div className="flex items-center">
//         <span className="text-2xl md:text-3xl mr-3">{icon}</span>
//         <div>
//           <h3 className="font-bold text-sm md:text-base">{title}</h3>
//           <p className="text-sm md:text-lg">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProjectTable = ({ projects }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredProjects = projects.filter(project =>
//     project.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 lg:mb-6">
//       <div className="p-3 md:p-4 lg:p-6">
//         <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">Project Information</h2>
//         <input
//           type="text"
//           placeholder="Search projects..."
//           className="border rounded px-3 py-2 w-full mb-3 md:mb-4"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <div className="overflow-x-auto">
//           <table className="w-full text-xs md:text-sm lg:text-base">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                 <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date Start</th>
//                 <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Deadline</th>
//                 <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">End Date</th>
//                 <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Leader</th>
//                 <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Completion</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredProjects.map((project) => {
//                 const projectId = project._id ? (project._id.$oid || project._id) : 'unknown';
//                 const completion = project.status === 'Not Started' ? 25 :
//                                   project.status === 'Started' ? 50 :
//                                   project.status === 'Approval' ? 75 :
//                                   project.status === 'Completed' ? 100 : 0;

//                 const startDate = dayjs(project.start_date);
//                 const endDate = dayjs(project.end_date);
//                 const deadline = endDate.diff(startDate, 'day');

//                 return (
//                   <tr key={projectId}>
//                     <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap">{project.name}</td>
//                     <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap hidden sm:table-cell">{startDate.format('DD-MM-YYYY')}</td>
//                     <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap hidden md:table-cell">{deadline} Days</td>
//                     <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap hidden md:table-cell">{endDate.format('DD-MM-YYYY')}</td>
//                     <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap hidden lg:table-cell">Joyal</td>
//                     <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap">
//                       <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
//                         <div className="bg-purple-600 h-1.5 md:h-2 rounded-full" style={{ width: `${completion}%` }}></div>
//                       </div>
//                       <span className="text-xs md:text-sm text-gray-600">{completion}%</span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DashboardLayout = ({ children }) => {
//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col overflow-hidden">
//       <FixedHeader />
//       <main className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6">
//         <div className="max-w-7xl mx-auto w-full">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// const CombinedDashboard = () => {
//   const [completedTasksCount, setCompletedTasksCount] = useState(0);
//   const [progressTasksCount, setProgressTasksCount] = useState(0);
//   const [totalTasksCount, setTotalTasksCount] = useState(0);
//   const [projects, setProjects] = useState([]);
//   const [totalProjects, setTotalProjects] = useState(0);
//   const [comingProjects, setComingProjects] = useState(0);
//   const [progressProjects, setProgressProjects] = useState(0);
//   const [finishedProjects, setFinishedProjects] = useState(0);

//   useEffect(() => {
//     const fetchCompletedTasksCount = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/tasks/completed/count', { withCredentials: true });
//         setCompletedTasksCount(response.data);
//       } catch (error) {
//         console.error('Error fetching completed tasks count:', error.response ? error.response.data : error.message);
//       }
//     };

//     const fetchProgressTasksCount = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/tasks/progress/count', { withCredentials: true });
//         setProgressTasksCount(response.data);
//       } catch (error) {
//         console.error('Error fetching progress tasks count:', error.response ? error.response.data : error.message);
//       }
//     };

//     const fetchTotalTasksCount = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/tasks/total/count', { withCredentials: true });
//         setTotalTasksCount(response.data);
//       } catch (error) {
//         console.error('Error fetching total tasks count:', error.response ? error.response.data : error.message);
//       }
//     };

//     const fetchProjects = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/projects', { withCredentials: true });
//         setProjects(response.data);
//         setTotalProjects(response.data.length);

//         const coming = response.data.filter(project => project.status === 'Coming').length;
//         const progress = response.data.filter(project => project.status === 'In Progress').length;
//         const finished = response.data.filter(project => project.status === 'Finished').length;

//         setComingProjects(coming);
//         setProgressProjects(progress);
//         setFinishedProjects(finished);
//       } catch (error) {
//         console.error('Error fetching projects:', error.response ? error.response.data : error.message);
//       }
//     };

//     fetchCompletedTasksCount();
//     fetchProgressTasksCount();
//     fetchTotalTasksCount();
//     fetchProjects();
//   }, []);

//   return (
//     <DashboardLayout>
//       <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 lg:mb-6">Welcome to Dashboard</h1>
//       <ProjectStats
//         totalProjects={totalProjects}
//         comingProjects={comingProjects}
//         progressProjects={progressProjects}
//         finishedProjects={finishedProjects}
//       />
//       <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 xl:gap-6 mt-4">
//         <StatCard title="Total Tasks" value={totalTasksCount} icon={<FileText />} />
//         <StatCard title="In Progress Tasks" value={progressTasksCount} icon={<Activity />} />
//         <StatCard title="Completed Tasks" value={completedTasksCount} icon={<ClipboardCheck />} />
//       </div>
//       <ProjectTable projects={projects} />
//     </DashboardLayout>
//   );
// };

// export default CombinedDashboard;
