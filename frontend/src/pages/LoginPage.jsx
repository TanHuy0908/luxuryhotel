import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/account/login", {   // ✅ Đúng nếu có "proxy"
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ TaiKhoan: username, MatKhau: password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Đăng nhập thất bại");
      return;
    }

    localStorage.setItem('token', data.token);
    setIsLoggedIn(true);
    alert("Đăng nhập thành công!");
    navigate("/");
  
  } catch (err) {
  console.error("Lỗi:", err);
  alert("Lỗi kết nối đến máy chủ");
}

};


  return (
    <div className="auth-page" style={{ backgroundImage: "url('/img/login-bg.jpg')" }}>
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Đăng nhập</h2>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default LoginPage;
