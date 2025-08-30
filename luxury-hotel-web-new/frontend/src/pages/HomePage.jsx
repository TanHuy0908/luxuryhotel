import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HomePage.css';

const rooms = [
  { image: '/img/room1.jpg', name: 'Phòng 1', description: 'Phòng đơn hiện đại.' },
  { image: '/img/room2.jpg', name: 'Phòng 2', description: 'Phòng đôi tiện nghi.' },
  { image: '/img/room3.jpg', name: 'Phòng 3', description: 'Phòng gia đình rộng rãi.' },
  { image: '/img/room4.jpg', name: 'Phòng 4', description: 'Phòng cao cấp sang trọng.' },
];

const HomePage = () => {
  return (
    <div className="home-container">
      <h2 className="featured-title">Nổi bật</h2>
      <div className="carousel-wrapper">
        <Carousel showThumbs={false} autoPlay infiniteLoop>
          {rooms.map((room, idx) => (
            <div key={idx} className="room-item">
              <img src={room.image} alt={room.name} className="room-image" />
              <div className="legend">
                <h3>{room.name}</h3>
                <p>{room.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default HomePage;
