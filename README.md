# 🎯 Bingo Checklist - Full-Stack Application

Web app cho phép người dùng tạo và chơi các bảng "Bingo Checklist" (n×n) – mỗi ô chứa một nhiệm vụ, người dùng có thể đánh dấu hoàn thành, tự động tính "Bingo" khi đủ hàng ngang/dọc/chéo.

## ✨ Tính năng

- ✅ **CRUD Bảng Bingo**: Tạo, sửa, xóa bảng Bingo với kích thước tùy chỉnh (2×2 đến 10×10)
- 🎨 **Tùy chỉnh giao diện**: Chọn màu sắc, font chữ, thêm emoji/icon
- 🎮 **Chế độ chơi**: Click để đánh dấu hoàn thành, tự động phát hiện Bingo với hiệu ứng confetti
- 🔗 **Chia sẻ công khai**: Tạo link public để chia sẻ với bạn bè
- 📥 **Xuất file**: Export ảnh PNG hoặc file PDF
- 📋 **Template mẫu**: 5 template có sẵn (Noel, Sinh nhật, Học tiếng Anh, Năng suất, Fitness)
- 🔐 **Xác thực JWT**: Đăng ký, đăng nhập với JWT và httpOnly cookie
- 🌍 **Đa ngôn ngữ**: Hỗ trợ tiếng Việt và tiếng Anh
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị

## 🛠️ Công nghệ

### Frontend
- React 18
- React Router DOM
- Zustand (state management)
- TailwindCSS
- Axios
- React Hook Form
- html-to-image + jsPDF (export)
- canvas-confetti (hiệu ứng)
- react-i18next (đa ngôn ngữ)
- Vite

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- cors, helmet, morgan
- slugify
- zod (validation)

## 📁 Cấu trúc dự án

```
bingo-checklist/
├── backend/
│   ├── server.js              # Entry point
│   ├── config/
│   │   └── db.js              # Kết nối MongoDB
│   ├── models/
│   │   ├── User.js            # Schema User
│   │   ├── Board.js           # Schema Board
│   │   └── Template.js        # Schema Template
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   ├── boardRoutes.js     # Board routes
│   │   └── templateRoutes.js  # Template routes
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── boardController.js
│   │   └── templateController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT auth
│   │   └── errorMiddleware.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── validation.js      # Zod schemas
│   ├── seed.js                # Seed 5 templates
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx           # Landing page
    │   │   ├── Dashboard.jsx      # Danh sách boards
    │   │   ├── BoardEditor.jsx    # Chỉnh sửa board
    │   │   ├── PlayMode.jsx       # Chơi Bingo
    │   │   ├── PublicView.jsx     # Xem public board
    │   │   ├── Auth.jsx           # Login/Register
    │   │   └── Templates.jsx      # Template gallery
    │   ├── components/
    │   │   ├── BoardGrid.jsx      # Lưới Bingo
    │   │   ├── CellEditor.jsx     # Edit cell
    │   │   ├── ThemePicker.jsx    # Chọn theme
    │   │   ├── ShareDialog.jsx    # Dialog chia sẻ
    │   │   └── TemplateGallery.jsx
    │   ├── store/
    │   │   ├── authStore.js       # Zustand auth
    │   │   └── boardStore.js      # Zustand board
    │   ├── i18n/
    │   │   └── index.js           # i18n config
    │   ├── utils/
    │   │   └── api.js             # Axios config
    │   ├── App.jsx                # Main app
    │   ├── main.jsx               # Entry point
    │   └── index.css              # TailwindCSS
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js 18+
- MongoDB Atlas account (hoặc MongoDB local)

### 1. Clone repo

```bash
git clone <your-repo>
cd bingo-checklist
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bingo
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:5173
PORT=4000
NODE_ENV=development
```

**Chú ý**: Thay `<username>`, `<password>`, `<cluster>` bằng thông tin MongoDB Atlas của bạn.

Seed database với 5 templates mẫu:

```bash
npm run seed
```

Chạy backend:

```bash
npm run dev
```

Backend sẽ chạy tại `http://localhost:4000`

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

Tạo file `.env`:

```env
VITE_API_URL=http://localhost:4000
```

Chạy frontend:

```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy user hiện tại
- `POST /api/auth/logout` - Đăng xuất

### Boards
- `GET /api/boards` - Lấy danh sách boards
- `POST /api/boards` - Tạo board mới
- `GET /api/boards/:id` - Lấy chi tiết board
- `PUT /api/boards/:id` - Cập nhật board
- `DELETE /api/boards/:id` - Xóa board
- `POST /api/boards/:id/check` - Check/uncheck cell
- `POST /api/boards/:id/share` - Tạo link share
- `GET /api/boards/public/:slug` - Xem board public

### Templates
- `GET /api/templates` - Lấy danh sách templates
- `GET /api/templates/:id` - Lấy chi tiết template
- `POST /api/templates` - Tạo template mới

## 🎮 Hướng dẫn sử dụng

### 1. Đăng ký tài khoản
- Truy cập `/register`
- Nhập username, email, password
- Đăng ký và tự động đăng nhập

### 2. Tạo Bingo Board
- Vào Dashboard
- Click "Tạo Bingo mới"
- Nhập tên và chọn kích thước (ví dụ: 5×5)
- Click từng ô để nhập nội dung, emoji, ghi chú

### 3. Tùy chỉnh giao diện
- Click nút "Theme"
- Chọn màu sắc, font chữ
- Click "Lưu"

### 4. Chơi Bingo
- Click "Chơi ngay"
- Click vào các ô để đánh dấu hoàn thành
- Khi đủ 1 hàng ngang/dọc/chéo → 🎉 BINGO!

### 5. Chia sẻ
- Click "Chia sẻ"
- Copy link public
- Gửi cho bạn bè

### 6. Xuất file
- Click "PNG" hoặc "PDF" để tải về

## 🌐 Deploy

### Backend (Render / Railway / Heroku)

1. Push code lên GitHub
2. Tạo Web Service trên Render
3. Cấu hình environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (URL frontend sau deploy)
   - `NODE_ENV=production`
4. Deploy

### Frontend (Vercel / Netlify)

1. Push code lên GitHub
2. Import project vào Vercel/Netlify
3. Cấu hình:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variable: `VITE_API_URL=<backend-url>`
4. Deploy

## 📸 Screenshots

*(Thêm screenshots nếu có)*

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc Issue.

## 📄 License

MIT License

## 👨‍💻 Tác giả

Được tạo bởi AI với ❤️

---

**Lưu ý**: 
- Nhớ thay đổi `JWT_SECRET` trong production
- Cấu hình CORS phù hợp khi deploy
- Bật HTTPS trong production
- Backup database định kỳ

🎯 Happy Bingo! 🎉
