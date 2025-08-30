import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BrowsePage from './pages/BrowsePage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import RoomDetailPage from './pages/RoomDetailPage';
import PopularPage from './pages/PopularPage.jsx';
import AccountPage from './pages/AccountDetailPage.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null); // ✅ Booking hiện tại
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setUsername('');
        setCurrentBooking(null);
        setLoadingToken(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUsername(data.username);
          fetchCurrentBooking(token);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUsername('');
          setCurrentBooking(null);
        }
      } catch (err) {
        console.error('Lỗi xác minh token:', err);
        setIsLoggedIn(false);
        setUsername('');
        setCurrentBooking(null);
      } finally {
        setLoadingToken(false);
      }
    };

    const fetchCurrentBooking = async (token) => {
      try {
        const res = await fetch('http://localhost:5000/api/bookings/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentBooking(data.booking || null);
        }
      } catch (err) {
        console.error('Lỗi lấy booking hiện tại:', err);
      }
    };

    verifyToken();
  }, []);

  const handleAddToCart = (room) => {
    if (currentBooking && ['pending', 'checked-in'].includes(currentBooking.status)) {
      alert('❌ Bạn đã đặt phòng và chưa check-out. Vui lòng check-out trước khi đặt phòng mới.');
      return;
    }

    if (cartItems.length > 0) {
      alert('❌ Bạn chỉ được đặt một phòng tại một thời điểm.');
      return;
    }

    setCartItems([{ ...room, quantity: 1 }]);
  };

  const handleRemoveFromCart = (roomId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== roomId));
  };

  if (loadingToken) {
    return <div className="p-4 text-center">🔐 Đang xác minh đăng nhập...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} currentUsername={username} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/popular" element={<PopularPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route
              path="/cart"
              element={<CartPage cartItems={cartItems} setCartItems={setCartItems} onRemoveFromCart={handleRemoveFromCart} />}
            />
            <Route
              path="/room/:roomId"
              element={<RoomDetailPage onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/" /> : <RegisterPage />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
