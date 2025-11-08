# 🚀 HƯỚNG DẪN DEPLOY BINGO CHECKLIST

## 📦 Chuẩn bị

### 1. Push code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - Bingo Checklist Full Stack"

# Tạo repo trên GitHub và push
git remote add origin https://github.com/<username>/<repo-name>.git
git branch -M main
git push -u origin main
```

---

## 🌐 BACKEND DEPLOY (Render.com - MIỄN PHÍ)

### Bước 1: Tạo tài khoản Render
- Truy cập: https://render.com
- Sign up bằng GitHub

### Bước 2: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repository của bạn
3. Cấu hình:
   - **Name**: `bingo-checklist-backend`
   - **Region**: Singapore (gần VN nhất)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Bước 3: Environment Variables
Thêm các biến môi trường:

```
MONGO_URI=mongodb+srv://quanle0702:Quanle0702@cluster0.6kjbbjy.mongodb.net/bingo?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=bingo_checklist_super_secret_jwt_key_2025_production_change_this
CLIENT_URL=https://bingo-checklist-frontend.vercel.app
PORT=4000
NODE_ENV=production
```

**Lưu ý**: `CLIENT_URL` sẽ được cập nhật sau khi deploy frontend

### Bước 4: Deploy
- Click **"Create Web Service"**
- Đợi 3-5 phút để deploy
- Lấy URL backend (ví dụ: `https://bingo-checklist-backend.onrender.com`)

### Bước 5: Seed Database
Sau khi deploy xong, vào **Shell** tab và chạy:
```bash
npm run seed
```

---

## 🎨 FRONTEND DEPLOY (Vercel - MIỄN PHÍ)

### Bước 1: Tạo tài khoản Vercel
- Truy cập: https://vercel.com
- Sign up bằng GitHub

### Bước 2: Deploy Frontend
1. Click **"Add New"** → **"Project"**
2. Import GitHub repository
3. Cấu hình:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Bước 3: Environment Variables
Thêm biến môi trường:

```
VITE_API_URL=https://bingo-checklist-backend.onrender.com
```

**Thay URL backend bằng URL thật từ Render**

### Bước 4: Deploy
- Click **"Deploy"**
- Đợi 1-2 phút
- Lấy URL frontend (ví dụ: `https://bingo-checklist.vercel.app`)

### Bước 5: Cập nhật CORS
Quay lại Render, cập nhật `CLIENT_URL` trong Environment Variables:
```
CLIENT_URL=https://bingo-checklist.vercel.app
```

Sau đó **Redeploy** backend.

---

## ✅ KIỂM TRA

1. Truy cập frontend URL
2. Đăng ký tài khoản mới
3. Tạo Bingo board
4. Test các tính năng

---

## 🔧 CẤU HÌNH MONGODB ATLAS CHO PRODUCTION

### Whitelist IP cho Render
1. Vào **MongoDB Atlas** → **Network Access**
2. Click **"Add IP Address"**
3. Chọn **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

---

## 🔄 TỰ ĐỘNG DEPLOY (CI/CD)

Sau khi setup xong, mỗi lần bạn:
- Push code lên GitHub
- Vercel và Render sẽ tự động build và deploy

---

## 💡 PHƯƠNG ÁN KHÁC (Cũng miễn phí)

### Backend:
- **Railway**: https://railway.app (dễ dùng hơn Render)
- **Fly.io**: https://fly.io
- **Cyclic**: https://cyclic.sh

### Frontend:
- **Netlify**: https://netlify.com
- **Cloudflare Pages**: https://pages.cloudflare.com

---

## 🔒 BẢO MẬT QUAN TRỌNG

### Sau khi deploy:
1. **Đổi JWT_SECRET** thành một chuỗi phức tạp hơn
2. **Cập nhật MongoDB password** định kỳ
3. **Bật HTTPS** (Render và Vercel tự động có SSL)
4. **Giới hạn CORS** chỉ cho domain của bạn

### Cập nhật backend/server.js:
```javascript
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Chỉ cho phép domain này
    credentials: true,
  })
);
```

---

## 📊 MONITOR & LOGS

### Render:
- Vào **Logs** tab để xem logs backend
- **Metrics** để xem performance

### Vercel:
- **Analytics** để xem traffic
- **Logs** để debug lỗi frontend

---

## 🆘 TROUBLESHOOTING

### Backend không kết nối MongoDB:
✅ Kiểm tra MongoDB Atlas Network Access (whitelist 0.0.0.0/0)
✅ Kiểm tra MONGO_URI trong Environment Variables

### Frontend không gọi được API:
✅ Kiểm tra VITE_API_URL đã đúng chưa
✅ Kiểm tra CORS settings ở backend
✅ Kiểm tra CLIENT_URL ở backend environment

### CORS Error:
✅ Cập nhật CLIENT_URL ở backend với domain thật của frontend
✅ Redeploy backend sau khi update

---

## 🎯 KẾT QUẢ

Sau khi hoàn tất:
- ✅ Backend: `https://bingo-checklist-backend.onrender.com`
- ✅ Frontend: `https://bingo-checklist.vercel.app`
- ✅ Database: MongoDB Atlas
- ✅ Tự động deploy khi push code
- ✅ SSL/HTTPS enabled
- ✅ Hoàn toàn MIỄN PHÍ

---

**Chúc bạn deploy thành công! 🚀**
