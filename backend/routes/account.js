const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';


// === ĐĂNG KÝ ===
router.post('/register', async (req, res) => {
  const { TaiKhoan, Email, MatKhau, XacNhanMatKhau } = req.body;

  if (!TaiKhoan || !Email || !MatKhau || !XacNhanMatKhau) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
  }

  if (MatKhau !== XacNhanMatKhau) {
    return res.status(400).json({ error: 'Mật khẩu xác nhận không khớp' });
  }

  try {
    const userExists = await User.findOne({
      $or: [{ Email }, { TaiKhoan }],
    });

    if (userExists) {
      return res.status(400).json({ error: 'Tài khoản hoặc email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(MatKhau, 10);
    const newUser = new User({
      TaiKhoan,
      Email,
      MatKhau: hashedPassword
    });

    await newUser.save();

    res.json({ message: 'Đăng ký thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi đăng ký' });
  }
});


//ĐĂNG NHẬP
router.post('/login', async (req, res) => {
  const { TaiKhoan, MatKhau } = req.body;

  if (!TaiKhoan || !MatKhau) {
    return res.status(400).json({ error: 'Vui lòng nhập tài khoản và mật khẩu' });
  }

  try {
    const user = await User.findOne({ TaiKhoan });
    if (!user) return res.status(401).json({ error: 'Tài khoản không tồn tại' });

    const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
    if (!isMatch) return res.status(401).json({ error: 'Sai mật khẩu' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        TaiKhoan: user.TaiKhoan,
        Email: user.Email,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi đăng nhập' });
  }
});


//MIDDLEWARE XÁC THỰC TOKEN
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token không có' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
};


//xác thực token
router.get('/verify', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-MatKhau');
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    res.json({ message: 'Xác thực thành công', user });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xác thực' });
  }
});

module.exports = router;
