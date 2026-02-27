const { MongoClient } = require('mongodb');

export default async function handler(req, res) {
  // 1. Chỉ cho phép phương thức POST (bảo mật hơn GET)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Chỉ chấp nhận phương thức POST' });
  }

  // 2. Lấy dữ liệu từ giao diện gửi lên
  const { username, password } = req.body;

  // 3. Chuỗi kết nối lấy từ biến môi trường (Environment Variable) trên Vercel
  const uri = process.env.MONGODB_URI; 
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('myDatabase'); // Tên DB của bạn
    const users = database.collection('users'); // Tên bảng (collection) của bạn

    // 4. Tìm kiếm user trong DB có username và password khớp
    const user = await users.findOne({ username: username, password: password });

    if (user) {
      // Đăng nhập đúng
      return res.status(200).json({ 
        success: true, 
        message: 'Đăng nhập thành công!',
        redirect: '/home.html' 
      });
    } else {
      // Sai tài khoản/mật khẩu
      return res.status(401).json({ 
        success: false, 
        message: 'Tài khoản hoặc mật khẩu không chính xác' 
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi kết nối Database' });
  } finally {
    await client.close();
  }
}