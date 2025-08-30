const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'checked-in', 'checked-out'], // ❗️THÊM 'pending'
    default: 'pending' // ❗️SET default là 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
