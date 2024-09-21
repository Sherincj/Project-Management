'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, Home, Briefcase, Ticket, Users, DollarSign, Layers, FileText, Box, Menu, X } from 'lucide-react';

const SubMenu = ({ items, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="ml-6 mt-2 space-y-2">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="block text-sm text-purple-300 hover:text-white py-2"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

const MenuItem = ({ icon: Icon, label, href, isActive, onClick, subItems }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const toggleSubMenu = (e) => {
    e.preventDefault();
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div>
      <Link
        href={href}
        className={`flex items-center text-purple-300 hover:text-white px-6 py-3 rounded-lg ${isActive ? 'bg-purple-700 text-white' : ''}`}
        onClick={onClick}
      >
        <Icon size={20} className="mr-3" />
        <span className="text-sm font-medium">{label}</span>
        {subItems && (
          <ChevronDown
            size={16}
            className={`ml-auto transform transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`}
            onClick={toggleSubMenu}
          />
        )}
      </Link>
      {subItems && <SubMenu items={subItems} isOpen={isSubMenuOpen} />}
    </div>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/", subItems: [
      { label: "Admin Dashboard", href: "/admindashboard" },
      // { label: "Project Dashboard", href: "/projectdashboard" },
    ]},
    { icon: Briefcase, label: "Projects", href: "", subItems: [
      { label: "Projects", href: "/projectslist" },
      { label: "Tasks", href: "/tasks" },
      { label: "Leaders", href: "/leaders" },
    ]},

    { icon: Users, label: "Employees", href: "", subItems:[
      { label: "Members", href: "/members" },
      { label: "Members Profile", href: "/membersprofile" },
      { label: "Holidays", href: "/holidays" },
      { label: "Attendance Employees", href: "/attendanceemployees" },
      { label: "Attendance ", href: "/attendance" },
      { label: "Leave Request", href: "/leaverequest" },
      { label: "Department", href: "/department" },
    ] },
    { icon: DollarSign, label: "Accounts", href: "", subItems: [
      { label: "Payment", href: "/payment" },
    ] },
    { icon: Layers, label: "Payroll", href: "", subItems: [
      {label: "Employee Salary", href: "/employeesalary"},
    ] },

  ];

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-purple-800 text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" onClick={toggleSidebar}></div>
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-56 bg-[#4C3575] text-white z-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-lg overflow-y-auto`}
      >
        <div className="p-6 flex flex-col  h-full">
          {/* <div className="flex items-center mb-8">
            <div className=" p-2">
              <Image src="/logo.png" alt="logo" width={170} height={32} />
            </div>
            <h1 className="text-xl font-bold ml-3 text-white">My-Task</h1>
          </div> */}

          <nav className="flex-grow space-y-10 mt-28">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href}
                onClick={closeSidebar}
                subItems={item.subItems}
              />
            ))}
          </nav>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
