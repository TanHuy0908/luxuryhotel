import React, { useState } from 'react';
import './Auth.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirm) {
    alert("Mật khẩu không khớp!");
    return;
  }

  try {
    const res = await fetch("/api/account/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        TaiKhoan: form.username,
        Email: form.email,
        MatKhau: form.password,
        XacNhanMatKhau: form.confirm
  })
});


    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Đăng ký thất bại");
      return;
    }

    alert("Đăng ký thành công!");
  } catch (err) {
    alert("Lỗi kết nối đến máy chủ");
  }
};


  return (
    <div className="auth-page" style={{ backgroundImage: "url('/img/register-bg.jpg')" }}>
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Đăng ký tài khoản</h2>
        <input type="text" name="username" placeholder="Tên tài khoản" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} />
        <input type="password" name="confirm" placeholder="Xác nhận mật khẩu" onChange={handleChange} />
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default RegisterPage;
