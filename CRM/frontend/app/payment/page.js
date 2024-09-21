import React from 'react';
import { ChevronDown, Search } from 'lucide-react';
import FixedHeader from '../components/Header';

const PaymentsTable = () => {
  const payments = [
    { no: '#000001', project: 'Social Geek Made', clientName: 'AgilSoft Tech', dateStart: '10-01-2021', dateEnd: '10-02-2021', amount: '$3250', status: 'Pending' },
    { no: '#000002', project: 'Practice to Perfect', clientName: 'Macrosoft', dateStart: '12-02-2021', dateEnd: '10-04-2021', amount: '$1578', status: 'Paid' },
    { no: '#000003', project: 'Rhinestone', clientName: 'Google', dateStart: '18-02-2021', dateEnd: '20-04-2021', amount: '$1978', status: 'Draf' },
    { no: '#000004', project: 'Box of Crayons', clientName: 'Pixelwibes', dateStart: '28-02-2021', dateEnd: '30-04-2021', amount: '$1978', status: 'Draf' },
    { no: '#000005', project: 'Practice to Perfect', clientName: 'Deltasoft Tech', dateStart: '11-02-2021', dateEnd: '10-04-2021', amount: '$1578', status: 'Paid' },
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'draf': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2">Show</span>
            <select className="border rounded px-2 py-1">
              <option>10</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="relative w-full sm:w-auto">
            <input type="text" placeholder="Search" className="w-full sm:w-64 border rounded pl-8 pr-2 py-1" />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Mobile view */}
        <div className="sm:hidden">
          {payments.map((payment, index) => (
            <div key={index} className="border-b p-4">
              <p className="text-red-500 font-semibold">{payment.no}</p>
              <p className="font-semibold mt-2">{payment.project}</p>
              <p>{payment.clientName}</p>
              <p className="mt-2">
                <span className="font-semibold">Start:</span> {payment.dateStart}
              </p>
              <p>
                <span className="font-semibold">End:</span> {payment.dateEnd}
              </p>
              <p className="mt-2 font-semibold">{payment.amount}</p>
              <p className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(payment.status)}`}>
                  {payment.status}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">NO</th>
                <th className="text-left p-3">PROJECT</th>
                <th className="text-left p-3">CLIENT NAME</th>
                <th className="text-left p-3">DATE START</th>
                <th className="text-left p-3">DATE END</th>
                <th className="text-left p-3">AMOUNT</th>
                <th className="text-left p-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 text-red-500">{payment.no}</td>
                  <td className="p-3">{payment.project}</td>
                  <td className="p-3">{payment.clientName}</td>
                  <td className="p-3">{payment.dateStart}</td>
                  <td className="p-3">{payment.dateEnd}</td>
                  <td className="p-3">{payment.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
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

export default PaymentsTable;