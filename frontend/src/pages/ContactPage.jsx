// src/pages/ContactPage.jsx
import React from 'react';
import './ContactPage.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';


const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-left">
          <h2>Hỗ trợ</h2>
          <p>Để lại thông tin cần hỗ trợ ở các địa chỉ sau
          </p>
          <div className="contact-info">
            <p><FaPhoneAlt className="icon" /> +84 900 2800</p>
            <p><FaEnvelope className="icon" /> demo@gmail.com</p>
            <p><img src="/img/Zalo-Logo.png" alt="Zalo" className="icon-img" /> +84 900 2800</p>
            <p><FaMapMarkerAlt className="icon" /> 828 Sư Vạn Hạnh, Phường 12, Quận 10, Hồ Chí Minh</p>
          </div>
        </div>

        <div className="contact-right">
          <form>
            <div className="form-group">
              <div>
                <label>Họ</label>
                <input type="text" placeholder="VD: Nguyễn" />
              </div>
              <div>
                <label>Tên</label>
                <input type="text" placeholder="VD: Văn A" />
              </div>
            </div>
            <div className="form-group">
              <div>
                <label>Email</label>
                <input type="email" placeholder="VD: demo@gmail.com" />
              </div>
              <div>
                <label>SỐ Điện Thoại</label>
                <input type="tel" placeholder="VD: 01231230123" />
              </div>
            </div>
            <div className="form-single">
              <label>Nội dung hỗ trợ</label>
              <textarea placeholder="demo"></textarea>
            </div>
            <button type="submit" className="submit-button">Gửi Yêu Cầu</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
