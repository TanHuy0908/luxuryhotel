import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RoomDetailPage.css';

const RoomDetailPage = ({ onAddToCart, cartItems = [], currentBooking = null }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('available');
  const [loading, setLoading] = useState(false);

  // Dummy room data
  const roomData = {
    'F3': {
      id: 'F3',
      name: 'F3 - Twin room',
      image: '/img/room3.jpg',
      description: 'Phòng tầng 3, tiện nghi đầy đủ.',
      price: 2800000,
      details: { interior: 'Đầy đủ', size: '30m²', type: 'Twin room', floor: 'Tầng 3' },
      views: 20,
      available: true
    },
    'F1': {
      id: 'F1',
      name: 'F1 - Phòng đôi',
      image: '/img/room1.jpg',
      description: 'Phòng đôi thoải mái với đầy đủ tiện nghi.',
      price: 2500000,
      details: { interior: 'Đầy đủ', size: '25m²', type: 'Phòng đôi', floor: 'Tầng 1' },
      views: 15,
      available: true
    },
    'F2': {
      id: 'F2',
      name: 'F2 - Phòng giường đôi',
      image: '/img/room2.jpg',
      description: 'Phòng giường đôi sang trọng với view đẹp.',
      price: 3200000,
      details: { interior: 'Đầy đủ', size: '35m²', type: 'Phòng giường đôi', floor: 'Tầng 2' },
      views: 25,
      available: true
    }
  };

  const room = roomData[roomId];
  if (!room) return <div className="room-detail-container">Phòng không tìm thấy.</div>;

  const handleAddToCart = () => {
    // ❌ Nếu đã có phòng đang đặt hoặc chưa checkout
    if (currentBooking && ['pending', 'checked-in'].includes(currentBooking.status)) {
      alert('❌ Bạn đã đặt một phòng và chưa check-out. Vui lòng check-out trước khi đặt phòng mới.');
      return;
    }

    // ❌ Nếu giỏ hàng đã có phòng
    if (cartItems.length > 0) {
      alert('❌ Bạn chỉ có thể đặt 1 phòng mỗi lần. Hãy thanh toán hoặc xóa phòng hiện tại trước.');
      return;
    }

    // ✅ Thêm vào giỏ
    onAddToCart(room);
    navigate('/cart');
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${roomId}/checkin`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert('✅ Check-in thành công!');
        setStatus('checked-in');
      } else {
        const err = await res.json();
        alert(`❌ Check-in thất bại: ${err.message}`);
      }
    } catch (err) {
      alert('❌ Lỗi mạng khi check-in');
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${roomId}/checkout`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert('✅ Check-out thành công!');
        setStatus('checked-out');
      } else {
        const err = await res.json();
        alert(`❌ Check-out thất bại: ${err.message}`);
      }
    } catch (err) {
      alert('❌ Lỗi mạng khi check-out');
    }
    setLoading(false);
  };

  return (
    <div className="room-detail-container">
      <div className="room-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">Quay lại</button>
        <div className="room-status">
          <span className="views">👁️ Người xem {room.views}</span>
          <span className="availability">{room.available ? '🟢 Còn phòng' : '🔴 Hết phòng'}</span>
        </div>
      </div>

      <div className="room-content">
        <div className="room-image-section">
          <img src={room.image} alt={room.name} className="room-detail-image" />
          <div className="check-buttons">
            <button className="check-button check-in" onClick={handleCheckIn} disabled={loading || status === 'checked-in'}>
              Check in
            </button>
            <button className="check-button check-out" onClick={handleCheckOut} disabled={loading || status !== 'checked-in'}>
              Check out
            </button>
          </div>
        </div>

        <div className="room-info-section">
          <h1 className="room-name">{room.name}</h1>
          <div className="room-description-box">
            <h3>Mô tả:</h3>
            <p>{room.description}</p>
          </div>
          <div className="room-details-grid">
            <p><strong>Nội thất:</strong> {room.details.interior}</p>
            <p><strong>Kích thước:</strong> {room.details.size}</p>
            <p><strong>Loại phòng:</strong> {room.details.type}</p>
            <p><strong>Tầng:</strong> {room.details.floor}</p>
            <p><strong>Giá:</strong> {room.price.toLocaleString('vi-VN')} VNĐ</p>
          </div>

          {room.available ? (
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              <span className="button-icon">🏨</span> Đặt phòng
            </button>
          ) : (
            <p className="not-available-message">Phòng này hiện không có sẵn.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
