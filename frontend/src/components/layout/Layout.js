import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`layout-main ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
