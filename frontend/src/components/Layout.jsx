import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ showSidebar, children }) => {
  return (
    <div className='min-h-screen flex'>
      {showSidebar && <Sidebar />}
      <div className='flex-1 flex flex-col'>
        <Navbar />
        <main className='flex-1 overflow-y-auto'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;