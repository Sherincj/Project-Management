// app/components/ConditionalHeader.js

'use client'; // Mark this component as a client component

import { usePathname } from 'next/navigation';
import DashboardHeader from './DashboardHeader';

const ConditionalHeader = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname === '/' && <DashboardHeader />}
    </>
  );
};

export default ConditionalHeader;