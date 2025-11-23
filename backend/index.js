const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// ROUTE ĐĂNG NHẬP / ĐĂNG KÝ
const accountRoutes = require('./routes/account');
app.use('/api/account', accountRoutes);

// ROUTE CHECKIN / CHECKOUT
const bookingRoutes = require('./routes/Booking'); // ✅ Đúng đường dẫn
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
