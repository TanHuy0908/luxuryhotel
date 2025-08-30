const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  TaiKhoan: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  MatKhau: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
