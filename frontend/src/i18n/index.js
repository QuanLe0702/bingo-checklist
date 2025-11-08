import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    translation: {
      // Common
      home: 'Trang chủ',
      dashboard: 'Bảng điều khiển',
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      register: 'Đăng ký',
      
      // Home
      appTitle: 'Bingo Checklist',
      appSubtitle: 'Tạo và chơi bảng Bingo của riêng bạn',
      createNew: 'Tạo Bingo mới',
      viewTemplates: 'Xem mẫu có sẵn',
      
      // Dashboard
      myBoards: 'Bảng Bingo của tôi',
      createBoard: 'Tạo bảng mới',
      noBoards: 'Bạn chưa có bảng Bingo nào',
      
      // Board
      editBoard: 'Chỉnh sửa',
      playMode: 'Chơi ngay',
      shareBoard: 'Chia sẻ',
      deleteBoard: 'Xóa',
      exportPNG: 'Xuất PNG',
      exportPDF: 'Xuất PDF',
      
      // Auth
      emailAddress: 'Email',
      password: 'Mật khẩu',
      username: 'Tên đăng nhập',
      displayName: 'Tên hiển thị',
      
      // Messages
      bingoWin: '🎉 BINGO! Chúc mừng bạn!',
      saved: 'Đã lưu',
      deleted: 'Đã xóa',
      error: 'Có lỗi xảy ra',
    },
  },
  en: {
    translation: {
      // Common
      home: 'Home',
      dashboard: 'Dashboard',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      
      // Home
      appTitle: 'Bingo Checklist',
      appSubtitle: 'Create and play your own Bingo boards',
      createNew: 'Create new Bingo',
      viewTemplates: 'View templates',
      
      // Dashboard
      myBoards: 'My Bingo Boards',
      createBoard: 'Create new board',
      noBoards: 'You have no Bingo boards yet',
      
      // Board
      editBoard: 'Edit',
      playMode: 'Play',
      shareBoard: 'Share',
      deleteBoard: 'Delete',
      exportPNG: 'Export PNG',
      exportPDF: 'Export PDF',
      
      // Auth
      emailAddress: 'Email',
      password: 'Password',
      username: 'Username',
      displayName: 'Display Name',
      
      // Messages
      bingoWin: '🎉 BINGO! Congratulations!',
      saved: 'Saved',
      deleted: 'Deleted',
      error: 'An error occurred',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Ngôn ngữ mặc định
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
