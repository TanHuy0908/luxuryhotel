const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// Middleware xác thực
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token không có' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('❌ Token không hợp lệ:', err);
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

// ✅ Đặt phòng (tạo booking mới)
router.post('/:roomId', verifyToken, async (req, res) => {
  try {
    const existing = await Booking.findOne({
      userId: req.userId,
      roomId: req.params.roomId,
      status: { $in: ['pending', 'checked-in'] }
    });

    if (existing) {
      return res.status(400).json({ message: 'Bạn đã đặt hoặc đang ở phòng này.' });
    }

    const booking = new Booking({
      userId: req.userId,
      roomId: req.params.roomId,
      status: 'pending'
    });

    await booking.save();
    res.json({ message: 'Đặt phòng thành công', booking });
  } catch (err) {
    console.error('❌ Lỗi khi đặt phòng:', err);
    res.status(500).json({ error: 'Lỗi khi đặt phòng' });
  }
});

// ✅ Check-in: chỉ cho phép nếu đã đặt trước (pending)
router.patch('/:roomId/checkin', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      userId: req.userId,
      roomId: req.params.roomId,
      status: 'pending'
    });

    if (!booking) {
      return res.status(400).json({ message: 'Bạn chưa đặt phòng hoặc đã check-in rồi' });
    }

    booking.status = 'checked-in';
    await booking.save();

    res.json({ message: 'Check-in thành công', booking });
  } catch (err) {
    console.error('❌ Lỗi khi check-in:', err);
    res.status(500).json({ error: 'Lỗi khi check-in' });
  }
});

// ✅ Check-out
router.patch('/:roomId/checkout', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { userId: req.userId, roomId: req.params.roomId, status: 'checked-in' },
      { status: 'checked-out' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy phòng đã check-in' });
    }

    res.json({ message: 'Check-out thành công', booking });
  } catch (err) {
    console.error('❌ Lỗi khi check-out:', err);
    res.status(500).json({ error: 'Lỗi khi check-out' });
  }
});

// ✅ Lấy phòng đang đặt hiện tại
router.get('/me', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      userId: req.userId,
      status: { $in: ['pending', 'checked-in'] }
    });

    res.json({ booking });
  } catch (err) {
    console.error('❌ Lỗi khi lấy thông tin đặt phòng:', err);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin đặt phòng' });
  }
});

module.exports = router;
