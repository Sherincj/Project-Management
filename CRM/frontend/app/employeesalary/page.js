import React from 'react';
import FixedHeader from '../components/Header';

const SalarySlip = () => {
  return (
    <div className="container  mx-auto lg:ml-64 mt-16 sm:mt-20 p-4">
      <FixedHeader />
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Salaryslip</h1>

        <div className="bg-white shadow-md rounded-lg  p-8 mt-8">

      <div className="mb-8">
        <p className="font-semibold text-lg">SalarySlip 01/Nov/2020</p>
      </div>
      
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="font-bold text-lg mb-2">From:</h2>
          <p>PixelWibes</p>
          <p>111 Berkeley Rd</p>
          <p>STREET ON THE FOSSE, Poland</p>
          <p>Email: info@deoweb.com</p>
          <p>Phone: +44 888 666 3333</p>
        </div>
        <div className="text-right">
          <h2 className="font-bold text-lg mb-2">To:</h2>
          <p>Dylan Hunter</p>
          <p>Web Designer</p>
          <p>Employee ID: 00008</p>
          <p>Joining Date: 10 Feb 2017</p>
          <p>Phone: +66 243 456 789</p>
        </div>
      </div>
      
      <div className="flex mb-8">
        <div className="w-1/2 pr-4">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">EARNINGS</th>
                <th className="py-2 px-4 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">1</td>
                <td className="py-2 px-4">Basic Salary</td>
                <td className="py-2 px-4 text-right">$8000,00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">2</td>
                <td className="py-2 px-4">House Rent Allowance (H.R.A.)</td>
                <td className="py-2 px-4 text-right">$50,00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">3</td>
                <td className="py-2 px-4">Conveyance</td>
                <td className="py-2 px-4 text-right">$50,00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">4</td>
                <td className="py-2 px-4">Other Allowance</td>
                <td className="py-2 px-4 text-right">$50,00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="py-2 px-4" colSpan="2">Subtotal</td>
                <td className="py-2 px-4 text-right">$8150,00</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="w-1/2 pl-4">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">DEDUCTIONS</th>
                <th className="py-2 px-4 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">1</td>
                <td className="py-2 px-4">Tax Deducted at Source (T.D.S.)</td>
                <td className="py-2 px-4 text-right">$15,00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">2</td>
                <td className="py-2 px-4">Provident Fund</td>
                <td className="py-2 px-4 text-right">$200,00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">3</td>
                <td className="py-2 px-4">ESI</td>
                <td className="py-2 px-4 text-right">$0,00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">4</td>
                <td className="py-2 px-4">Other Deductions</td>
                <td className="py-2 px-4 text-right">$0,00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="py-2 px-4" colSpan="2">Subtotal</td>
                <td className="py-2 px-4 text-right">$215,00</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end mb-8">
        <div className="w-1/3">
          <table className="w-full">
            <tbody>
              <tr className="font-bold">
                <td className="py-2 px-4">(ER) - (DE)</td>
                <td className="py-2 px-4 text-right">$7935</td>
              </tr>
              <tr className="font-bold text-lg">
                <td className="py-2 px-4">Total</td>
                <td className="py-2 px-4 text-right">$7935</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-bold mb-2">Terms & Condition</h3>
        <p className="text-sm text-gray-600">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over</p>
      </div>
      
      <div className="flex justify-end">
        <button className="bg-gray-500 text-white px-6 py-2 rounded mr-4">Print</button>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded">Send Invoice</button>
      </div>
      </div>
    </div>
  );
};

export default SalarySlip;