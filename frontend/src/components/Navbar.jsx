// src/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';

const Navbar = ({ isLoggedIn, setIsLoggedIn, currentUsername }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const username = currentUsername || "Người dùng";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // ✅ Sửa điểm này
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <img src="/img/logo.png" alt="Logo" className="logo-image" />
        </div>
        <ul className="nav-links">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
          <li><NavLink to="/browse" className={({ isActive }) => isActive ? "active" : ""}>Browse</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact Us</NavLink></li>
          <li><NavLink to="/popular" className={({ isActive }) => isActive ? "active" : ""}>Popular</NavLink></li>
        </ul>
      </div>

      <div className="navbar-right">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>

        {!isLoggedIn ? (
          <>
            <Link className="login-text" to="/login">Đăng nhập</Link>
            <Link className="login-button" to="/register">Đăng ký</Link>
          </>
        ) : (
          <>
            <Link to="/cart" className="icon-button cart-button square-button">
              <FaShoppingCart />
            </Link>

            <div className="profile-container" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="profile-info">
                <span className="username">{username}</span>
                <FaUser className="user-icon" />
              </div>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate('/account')}>Xem chi tiết</button>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
