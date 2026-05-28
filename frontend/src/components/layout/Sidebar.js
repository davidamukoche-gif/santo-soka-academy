import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiUsers, FiGrid, FiDollarSign, FiTool,
  FiMessageSquare, FiBarChart2, FiSettings, FiUser, FiCreditCard
} from 'react-icons/fi';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  const adminLinks = [
    { to: '/', icon: <FiHome />, label: 'Dashboard' },
    { to: '/tenants', icon: <FiUsers />, label: 'Tenants' },
    { to: '/units', icon: <FiGrid />, label: 'Units' },
    { to: '/payments', icon: <FiDollarSign />, label: 'Payments' },
    { to: '/maintenance', icon: <FiTool />, label: 'Maintenance' },
    { to: '/feedback', icon: <FiMessageSquare />, label: 'Feedback' },
    { to: '/reports', icon: <FiBarChart2 />, label: 'Reports' },
    { to: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  const caretakerLinks = [
    { to: '/', icon: <FiHome />, label: 'Dashboard' },
    { to: '/tenants', icon: <FiUsers />, label: 'Tenants' },
    { to: '/units', icon: <FiGrid />, label: 'Units' },
    { to: '/payments', icon: <FiDollarSign />, label: 'Payments' },
    { to: '/maintenance', icon: <FiTool />, label: 'Maintenance' },
    { to: '/feedback', icon: <FiMessageSquare />, label: 'Feedback' },
    { to: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  const tenantLinks = [
    { to: '/portal', icon: <FiHome />, label: 'Dashboard' },
    { to: '/portal/payments', icon: <FiCreditCard />, label: 'My Payments' },
    { to: '/portal/maintenance', icon: <FiTool />, label: 'Maintenance' },
    { to: '/portal/feedback', icon: <FiMessageSquare />, label: 'Feedback' },
    { to: '/portal/profile', icon: <FiUser />, label: 'Profile' },
  ];

  const links = user?.role === 'tenant' ? tenantLinks :
    user?.role === 'caretaker' ? caretakerLinks : adminLinks;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-logo">
          {isOpen ? 'RentFlow' : 'RF'}
        </h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/' || link.to === '/portal'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {isOpen && <span className="sidebar-label">{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
