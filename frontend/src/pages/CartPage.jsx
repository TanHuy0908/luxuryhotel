import React from 'react';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ cartItems, onRemoveFromCart, setCartItems }) => {
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Vui lòng đăng nhập để đặt phòng');
      navigate('/login');
      return;
    }

    try {
      for (const item of cartItems) {
        const res = await fetch(`http://localhost:5000/api/bookings/${item.id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          alert(`❌ Không thể đặt phòng ${item.name}: ${data.message || data.error}`);
          return;
        }
      }

      alert('✅ Đặt phòng thành công!');
      setCartItems([]); // ✅ Xóa giỏ hàng sau khi thanh toán
      navigate('/account');
    } catch (err) {
      console.error('Lỗi khi đặt phòng:', err);
      alert('❌ Lỗi khi kết nối đến server');
    }
  };

  return (
    <div className="cart-page-container">
      <h1>Giỏ hàng của bạn</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">
          Giỏ hàng của bạn đang trống. Hãy quay lại trang sản phẩm để lựa chọn phòng nhé!
        </p>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Giá: {item.price.toLocaleString('vi-VN')} VNĐ</p>
                <button className="remove-item-button" onClick={() => onRemoveFromCart(item.id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Tổng cộng: {totalPrice.toLocaleString('vi-VN')} VNĐ</h3>
            <button className="checkout-button" onClick={handleCheckout}>
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
