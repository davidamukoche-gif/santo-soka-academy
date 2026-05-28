import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <button className="header-toggle" onClick={onToggleSidebar}>
        <FiMenu />
      </button>
      <div className="header-right">
        <div className="header-user">
          <FiUser />
          <span>{user?.name}</span>
          <span className="header-role">{user?.role}</span>
        </div>
        <button className="header-logout" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
