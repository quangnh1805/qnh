const { MongoClient } = require('mongodb');

export default async function handler(req, res) {
  // Chỉ chấp nhận yêu cầu POST (gửi dữ liệu lên)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Chỉ chấp nhận phương thức POST' });
  }

  const { username, password } = req.body;
  const uri = process.env.MONGODB_URI; // Vercel sẽ lấy cái này từ cài đặt bảo mật
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('qnh'); // <--- Tên Database của bạn trên Atlas
    const users = database.collection('users'); // <--- Tên Table của bạn

    // Tìm xem có user nào khớp cả username và password không
    const user = await users.findOne({ username, password });

    if (user) {
      // Đăng nhập đúng, bảo trình duyệt chuyển hướng sang trang chủ
      return res.status(200).json({ success: true, redirect: '/home.html' });
    } else {
      // Đăng nhập sai
      return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu!' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi kết nối: ' + error.message });
  } finally {
    await client.close();
  }
}