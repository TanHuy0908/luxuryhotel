import React from 'react';
import './Footer.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p><FaPhoneAlt className="icon" /> 1900 2800</p>
          <p><img src="\img\Zalo-Logo.png" alt="Zalo" className="icon-img" /> 1900 2800</p>
          <p><FaEnvelope className="icon" /> demo.@gmail</p>
        </div>

        <div className="footer-section">
          <h4>Địa chỉ Công ty</h4>
          <p><FaMapMarkerAlt className="icon" /> <strong>828 Sư Vạn Hạnh, Phường 12, Quận 10, Hồ Chí Minh</strong></p>
        </div>

        <div className="footer-section">
          <h4>Thông tin pháp lý</h4>
          <p>Chính sách bảo mật</p>
          <p>Điều khoản & Dịch vụ</p>
          <p>Điều khoản sử dụng</p>
        </div>

        <div className="footer-section">
          <h4>Cập nhật thông tin mới từ chúng tôi</h4>
          <div className="subscribe">
            <input type="email" placeholder="Địa chỉ email" />
            <button>Đăng ký</button>
          </div>
          <small>* Sẽ gửi cho bạn thông tin mới nhất từ chúng tôi</small>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
