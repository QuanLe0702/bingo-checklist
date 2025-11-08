import dotenv from "dotenv";
import mongoose from "mongoose";
import Template from "./models/Template.js";

dotenv.config();

/**
 * Seed database với 5 template mẫu
 */
const templates = [
  {
    title: "🎄 Bingo Noel",
    description: "Bảng Bingo cho mùa Giáng sinh vui vẻ",
    category: "noel",
    size: { rows: 5, cols: 5 },
    featured: true,
    theme: {
      primary: "#dc2626",
      bg: "#fef2f2",
      textColor: "#1f2937",
      fontFamily: "Inter",
    },
    cells: [
      { id: "cell-0-0", r: 0, c: 0, text: "Trang trí cây thông", emoji: "🎄", checked: false },
      { id: "cell-0-1", r: 0, c: 1, text: "Gói quà", emoji: "🎁", checked: false },
      { id: "cell-0-2", r: 0, c: 2, text: "Nướng bánh quy", emoji: "🍪", checked: false },
      { id: "cell-0-3", r: 0, c: 3, text: "Hát nhạc Noel", emoji: "🎵", checked: false },
      { id: "cell-0-4", r: 0, c: 4, text: "Xem phim Giáng sinh", emoji: "🎬", checked: false },
      { id: "cell-1-0", r: 1, c: 0, text: "Gửi thiệp chúc mừng", emoji: "💌", checked: false },
      { id: "cell-1-1", r: 1, c: 1, text: "Làm ông già Noel", emoji: "🎅", checked: false },
      { id: "cell-1-2", r: 1, c: 2, text: "Uống chocolate nóng", emoji: "☕", checked: false },
      { id: "cell-1-3", r: 1, c: 3, text: "Chụp ảnh cùng gia đình", emoji: "📸", checked: false },
      { id: "cell-1-4", r: 1, c: 4, text: "Đi chơi tuyết", emoji: "⛄", checked: false },
      { id: "cell-2-0", r: 2, c: 0, text: "Trang trí nhà cửa", emoji: "🏠", checked: false },
      { id: "cell-2-1", r: 2, c: 1, text: "Làm người tuyết", emoji: "☃️", checked: false },
      { id: "cell-2-2", r: 2, c: 2, text: "FREE", emoji: "🎯", checked: true },
      { id: "cell-2-3", r: 2, c: 3, text: "Đọc truyện Noel", emoji: "📖", checked: false },
      { id: "cell-2-4", r: 2, c: 4, text: "Làm vòng hoa", emoji: "🎀", checked: false },
      { id: "cell-3-0", r: 3, c: 0, text: "Viết thư cho Santa", emoji: "✉️", checked: false },
      { id: "cell-3-1", r: 3, c: 1, text: "Tặng quà", emoji: "🎁", checked: false },
      { id: "cell-3-2", r: 3, c: 2, text: "Đi nhà thờ", emoji: "⛪", checked: false },
      { id: "cell-3-3", r: 3, c: 3, text: "Ăn bánh gừng", emoji: "🍪", checked: false },
      { id: "cell-3-4", r: 3, c: 4, text: "Đón giao thừa", emoji: "🎆", checked: false },
      { id: "cell-4-0", r: 4, c: 0, text: "Làm từ thiện", emoji: "❤️", checked: false },
      { id: "cell-4-1", r: 4, c: 1, text: "Treo tất Noel", emoji: "🧦", checked: false },
      { id: "cell-4-2", r: 4, c: 2, text: "Nhảy múa", emoji: "💃", checked: false },
      { id: "cell-4-3", r: 4, c: 3, text: "Chơi game gia đình", emoji: "🎮", checked: false },
      { id: "cell-4-4", r: 4, c: 4, text: "Ngắm đèn Noel", emoji: "✨", checked: false },
    ],
  },
  {
    title: "🎂 Bingo Sinh Nhật",
    description: "Bảng Bingo cho tiệc sinh nhật vui vẻ",
    category: "birthday",
    size: { rows: 4, cols: 4 },
    featured: true,
    theme: {
      primary: "#ec4899",
      bg: "#fdf2f8",
      textColor: "#1f2937",
      fontFamily: "Inter",
    },
    cells: [
      { id: "cell-0-0", r: 0, c: 0, text: "Thổi nến", emoji: "🕯️", checked: false },
      { id: "cell-0-1", r: 0, c: 1, text: "Cắt bánh", emoji: "🎂", checked: false },
      { id: "cell-0-2", r: 0, c: 2, text: "Mở quà", emoji: "🎁", checked: false },
      { id: "cell-0-3", r: 0, c: 3, text: "Chụp ảnh", emoji: "📸", checked: false },
      { id: "cell-1-0", r: 1, c: 0, text: "Hát sinh nhật", emoji: "🎵", checked: false },
      { id: "cell-1-1", r: 1, c: 1, text: "Đeo mũ party", emoji: "🎩", checked: false },
      { id: "cell-1-2", r: 1, c: 2, text: "Chơi game", emoji: "🎮", checked: false },
      { id: "cell-1-3", r: 1, c: 3, text: "Nhảy múa", emoji: "💃", checked: false },
      { id: "cell-2-0", r: 2, c: 0, text: "Ăn kem", emoji: "🍨", checked: false },
      { id: "cell-2-1", r: 2, c: 1, text: "Thổi kèn", emoji: "📯", checked: false },
      { id: "cell-2-2", r: 2, c: 2, text: "Bong bóng bay", emoji: "🎈", checked: false },
      { id: "cell-2-3", r: 2, c: 3, text: "Làm điều ước", emoji: "⭐", checked: false },
      { id: "cell-3-0", r: 3, c: 0, text: "Trang trí", emoji: "🎀", checked: false },
      { id: "cell-3-1", r: 3, c: 1, text: "Gọi bạn bè", emoji: "👯", checked: false },
      { id: "cell-3-2", r: 3, c: 2, text: "Ăn pizza", emoji: "🍕", checked: false },
      { id: "cell-3-3", r: 3, c: 3, text: "Confetti", emoji: "🎉", checked: false },
    ],
  },
  {
    title: "📚 Bingo Học Tiếng Anh",
    description: "Thử thách 30 ngày học tiếng Anh",
    category: "english",
    size: { rows: 5, cols: 5 },
    featured: true,
    theme: {
      primary: "#2563eb",
      bg: "#eff6ff",
      textColor: "#1f2937",
      fontFamily: "Inter",
    },
    cells: [
      { id: "cell-0-0", r: 0, c: 0, text: "Học 20 từ mới", emoji: "📖", checked: false },
      { id: "cell-0-1", r: 0, c: 1, text: "Xem phim không phụ đề", emoji: "🎬", checked: false },
      { id: "cell-0-2", r: 0, c: 2, text: "Nói chuyện 15 phút", emoji: "🗣️", checked: false },
      { id: "cell-0-3", r: 0, c: 3, text: "Viết nhật ký", emoji: "✍️", checked: false },
      { id: "cell-0-4", r: 0, c: 4, text: "Đọc báo tiếng Anh", emoji: "📰", checked: false },
      { id: "cell-1-0", r: 1, c: 0, text: "Nghe podcast", emoji: "🎧", checked: false },
      { id: "cell-1-1", r: 1, c: 1, text: "Luyện phát âm", emoji: "🗨️", checked: false },
      { id: "cell-1-2", r: 1, c: 2, text: "Làm bài tập grammar", emoji: "📝", checked: false },
      { id: "cell-1-3", r: 1, c: 3, text: "Chat với người nước ngoài", emoji: "💬", checked: false },
      { id: "cell-1-4", r: 1, c: 4, text: "Học idioms", emoji: "💡", checked: false },
      { id: "cell-2-0", r: 2, c: 0, text: "Xem TED talk", emoji: "🎤", checked: false },
      { id: "cell-2-1", r: 2, c: 1, text: "Đọc sách tiếng Anh", emoji: "📚", checked: false },
      { id: "cell-2-2", r: 2, c: 2, text: "FREE", emoji: "🎯", checked: true },
      { id: "cell-2-3", r: 2, c: 3, text: "Làm bài test", emoji: "📋", checked: false },
      { id: "cell-2-4", r: 2, c: 4, text: "Học phrasal verbs", emoji: "🔤", checked: false },
      { id: "cell-3-0", r: 3, c: 0, text: "Shadow speaking", emoji: "👤", checked: false },
      { id: "cell-3-1", r: 3, c: 1, text: "Viết email", emoji: "📧", checked: false },
      { id: "cell-3-2", r: 3, c: 2, text: "Học bài hát", emoji: "🎵", checked: false },
      { id: "cell-3-3", r: 3, c: 3, text: "Review từ vựng", emoji: "🔄", checked: false },
      { id: "cell-3-4", r: 3, c: 4, text: "Tham gia club", emoji: "👥", checked: false },
      { id: "cell-4-0", r: 4, c: 0, text: "Học collocations", emoji: "🔗", checked: false },
      { id: "cell-4-1", r: 4, c: 1, text: "Luyện listening", emoji: "👂", checked: false },
      { id: "cell-4-2", r: 4, c: 2, text: "Dịch đoạn văn", emoji: "🌐", checked: false },
      { id: "cell-4-3", r: 4, c: 3, text: "Học slang", emoji: "😎", checked: false },
      { id: "cell-4-4", r: 4, c: 4, text: "Presentation 5 phút", emoji: "🎯", checked: false },
    ],
  },
  {
    title: "⚡ Bingo Năng Suất",
    description: "Thử thách năng suất 25 ngày",
    category: "productivity",
    size: { rows: 5, cols: 5 },
    featured: true,
    theme: {
      primary: "#16a34a",
      bg: "#f0fdf4",
      textColor: "#1f2937",
      fontFamily: "Inter",
    },
    cells: [
      { id: "cell-0-0", r: 0, c: 0, text: "Dậy lúc 5h sáng", emoji: "⏰", checked: false },
      { id: "cell-0-1", r: 0, c: 1, text: "Tập thể dục 30 phút", emoji: "🏃", checked: false },
      { id: "cell-0-2", r: 0, c: 2, text: "Đọc sách 1 tiếng", emoji: "📚", checked: false },
      { id: "cell-0-3", r: 0, c: 3, text: "Lập kế hoạch ngày", emoji: "📝", checked: false },
      { id: "cell-0-4", r: 0, c: 4, text: "Hoàn thành 3 việc quan trọng", emoji: "✅", checked: false },
      { id: "cell-1-0", r: 1, c: 0, text: "Thiền 15 phút", emoji: "🧘", checked: false },
      { id: "cell-1-1", r: 1, c: 1, text: "Uống 2L nước", emoji: "💧", checked: false },
      { id: "cell-1-2", r: 1, c: 2, text: "Không dùng điện thoại buổi sáng", emoji: "📵", checked: false },
      { id: "cell-1-3", r: 1, c: 3, text: "Viết nhật ký", emoji: "✍️", checked: false },
      { id: "cell-1-4", r: 1, c: 4, text: "Dọn dẹp workspace", emoji: "🧹", checked: false },
      { id: "cell-2-0", r: 2, c: 0, text: "Deep work 2 tiếng", emoji: "🎯", checked: false },
      { id: "cell-2-1", r: 2, c: 1, text: "Học skill mới", emoji: "🚀", checked: false },
      { id: "cell-2-2", r: 2, c: 2, text: "FREE", emoji: "⭐", checked: true },
      { id: "cell-2-3", r: 2, c: 3, text: "Review tiến độ", emoji: "📊", checked: false },
      { id: "cell-2-4", r: 2, c: 4, text: "Không trì hoãn", emoji: "⚡", checked: false },
      { id: "cell-3-0", r: 3, c: 0, text: "Ngủ trước 10h", emoji: "😴", checked: false },
      { id: "cell-3-1", r: 3, c: 1, text: "Giới hạn social media", emoji: "📱", checked: false },
      { id: "cell-3-2", r: 3, c: 2, text: "Ăn healthy", emoji: "🥗", checked: false },
      { id: "cell-3-3", r: 3, c: 3, text: "Time blocking", emoji: "⏱️", checked: false },
      { id: "cell-3-4", r: 3, c: 4, text: "Nói không với distraction", emoji: "🚫", checked: false },
      { id: "cell-4-0", r: 4, c: 0, text: "Pomodoro technique", emoji: "🍅", checked: false },
      { id: "cell-4-1", r: 4, c: 1, text: "Network 1 người", emoji: "🤝", checked: false },
      { id: "cell-4-2", r: 4, c: 2, text: "Hoàn thành project", emoji: "🎉", checked: false },
      { id: "cell-4-3", r: 4, c: 3, text: "Reflect & improve", emoji: "💭", checked: false },
      { id: "cell-4-4", r: 4, c: 4, text: "Celebrate wins", emoji: "🏆", checked: false },
    ],
  },
  {
    title: "💪 Bingo Fitness",
    description: "Thử thách tập luyện 9 ngày",
    category: "fitness",
    size: { rows: 3, cols: 3 },
    featured: true,
    theme: {
      primary: "#ea580c",
      bg: "#fff7ed",
      textColor: "#1f2937",
      fontFamily: "Inter",
    },
    cells: [
      { id: "cell-0-0", r: 0, c: 0, text: "Chạy bộ 5km", emoji: "🏃", checked: false },
      { id: "cell-0-1", r: 0, c: 1, text: "50 push-ups", emoji: "💪", checked: false },
      { id: "cell-0-2", r: 0, c: 2, text: "Plank 3 phút", emoji: "⏱️", checked: false },
      { id: "cell-1-0", r: 1, c: 0, text: "100 squats", emoji: "🦵", checked: false },
      { id: "cell-1-1", r: 1, c: 1, text: "Yoga 30 phút", emoji: "🧘", checked: false },
      { id: "cell-1-2", r: 1, c: 2, text: "Bơi 500m", emoji: "🏊", checked: false },
      { id: "cell-2-0", r: 2, c: 0, text: "Đạp xe 10km", emoji: "🚴", checked: false },
      { id: "cell-2-1", r: 2, c: 1, text: "Gym 1 tiếng", emoji: "🏋️", checked: false },
      { id: "cell-2-2", r: 2, c: 2, text: "Stretch toàn thân", emoji: "🤸", checked: false },
    ],
  },
];

/**
 * Hàm seed
 */
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Xóa templates cũ
    await Template.deleteMany({});
    console.log("🗑️  Deleted old templates");

    // Thêm templates mới
    await Template.insertMany(templates);
    console.log("✅ 5 templates seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDB();
