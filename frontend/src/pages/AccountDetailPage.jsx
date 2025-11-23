import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountDetailPage.css';

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const roomData = {
    'F1': { id: 'F1', name: 'F1 - Phòng đôi', image: '/img/room1.jpg', price: 2500000 },
    'F2': { id: 'F2', name: 'F2 - Phòng giường đôi', image: '/img/room2.jpg', price: 3200000 },
    'F3': { id: 'F3', name: 'F3 - Twin room', image: '/img/room3.jpg', price: 2800000 }
  };

  useEffect(() => {
    if (!token) return navigate('/login');

    const fetchData = async () => {
      try {
        const resUser = await fetch('http://localhost:5000/api/account/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await resUser.json();
        setUser(userData.user);

        const resBooking = await fetch('http://localhost:5000/api/bookings/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingData = await resBooking.json();
        setBooking(bookingData.booking);
      } catch (err) {
        alert('Lỗi khi tải thông tin tài khoản');
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${booking.roomId}/checkin`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Check-in thành công');
        setBooking(data.booking);
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      alert('Lỗi mạng khi check-in');
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${booking.roomId}/checkout`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Check-out thành công');
        setBooking(data.booking);
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      alert('Lỗi mạng khi check-out');
    }
    setLoading(false);
  };

  const bookedRoom = booking ? roomData[booking.roomId] : null;

  return (
    <div className="account-detail-page">
      <div className="sidebar">
        <h2>👤 Thông tin tài khoản</h2>
        {user && (
          <div className="user-info">
            <p><strong>Tài khoản:</strong> {user.TaiKhoan}</p>
            <p><strong>Email:</strong> {user.Email}</p>
            <p><strong>Điện thoại:</strong> {user.Phone || 'Chưa cập nhật'}</p>
            <button className="edit-btn">✏️ Sửa thông tin</button>
          </div>
        )}
      </div>

      <div className="booking-area">
        <h2>📦 Phòng đã đặt</h2>
        {booking && bookedRoom ? (
          <div className="room-card">
            <img src={bookedRoom.image} alt={bookedRoom.name} />
            <div className="room-info">
              <h3>{bookedRoom.name}</h3>
              <p>Giá: {bookedRoom.price.toLocaleString('vi-VN')} VNĐ</p>
              <p>Trạng thái: <strong>{booking.status}</strong></p>
              <p>Ngày đặt: {new Date(booking.createdAt).toLocaleString()}</p>
              <div className="booking-actions">
                <button
                  className="checkin"
                  onClick={handleCheckIn}
                  disabled={loading || booking.status !== 'pending'}
                >
                  ✅ Check in
                </button>
                <button
                  className="checkout"
                  onClick={handleCheckOut}
                  disabled={loading || booking.status !== 'checked-in'}
                >
                  ⛔ Check out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="no-booking">Hiện tại bạn chưa đặt phòng nào.</p>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
