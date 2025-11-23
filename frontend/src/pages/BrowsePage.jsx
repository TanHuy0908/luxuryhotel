import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './BrowsePage.css';

// Dummy room data
const rooms = Array.from({ length: 20 }, (_, i) => ({
  id: `F${i + 1}`, // Đảm bảo ID khớp với định dạng trong RoomDetailPage
  name: `F${i + 1} - Phòng ${['đôi', 'giường đôi', 'Suite', 'Penthouse'][i % 4]}`,
  description: 'Đủ nội thất',
  image: `/img/room${(i % 4) + 1}.jpg`,
  views: 20,
  bookings: 20,
}));

const ITEMS_PER_PAGE = 12;

const BrowsePage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rooms.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleRooms = rooms.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="browse-container">
      <div className="search-section">
        <input type="text" placeholder="Tìm kiếm theo mô tả..." />
      </div>

      <div className="browse-grid">
        {visibleRooms.map((room) => (
          // Sử dụng Link để tạo liên kết đến trang chi tiết phòng
          <Link to={`/room/${room.id}`} key={room.id} className="room-card-link">
            <div className="room-card">
              <img src={room.image} alt={room.name} />
              <h4>{room.name}</h4>
              <p>{room.description}</p>
              <div className="room-meta">
                <span>👁 {room.views}</span>
                <span>🛋 {room.bookings}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Previous</button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</button>
      </div>
    </div>
  );
};

export default BrowsePage;
