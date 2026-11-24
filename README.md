# AI CertPath — Khóa Chinh Phục Chứng Chỉ AI-103 → AI-500

Website học tập **100% offline**, giao diện tiếng Việt, được thiết kế như một lớp học thực thụ cùng thầy hướng dẫn từ nền tảng **AI-103 Associate** đến **AI-500 Multi-Agent Solutions Expert** (đối chiếu đề cương Microsoft Learn). Không phải website chính thức của Microsoft.

## Cách mở và học trên Windows

1. Mở thư mục `ai500-academy`, nhấp đúp file `index.html` bằng trình duyệt Chrome hoặc Edge (không cần cài đặt server vì toàn bộ bài giảng và đề thi được nạp qua `<script>` tương thích trực tiếp với `file://`).
2. Hoặc nếu muốn chạy qua HTTP server cục bộ:
   ```powershell
   npx serve .
   # hoặc nếu máy có Python:
   python -m http.server 8000
   ```

## Điểm nổi bật của khóa học

### 1. Hệ thống 60 Bài Giảng Chi Tiết Như Thầy Đứng Lớp (10 Học phần)
Mỗi bài trong tổng số **60 bài học** (`P1–P6`, `A1–A6`, `B1–B6`, `C1–C6`, `D1–D6`, `E1–E6`, `F1–F6`, `G1–G6`, `H1–H6`, `I1–I6`) đều có cấu trúc sư phạm 8 phần đầy đủ:
- **👨‍🏫 Lời dẫn nhập của Thầy:** Đặt bài toán thực tế tại doanh nghiệp và lý do chủ đề xuất hiện trong đề thi.
- **💡 Liên hệ đời thường (Analogy):** Giải thích khái niệm phức tạp qua hình ảnh gần gũi, dễ nhớ ngay lần đầu.
- **🗺️ Sơ đồ tư duy & Luồng hoạt động (4 bước trực quan):** Nắm trọn kiến trúc và đường đi dữ liệu.
- **📖 Bài giảng chi tiết 3–4 chuyên mục:** Phân tích từ bản chất gốc rễ đến đánh đổi kiến trúc (trade-offs).
- **⚖️ Bảng so sánh & Quy tắc chọn giải pháp:** Phục vụ trực tiếp dạng câu hỏi phân biệt dịch vụ của Microsoft.
- **💻 Code thực chiến & Thầy phân tích từng dòng:** Đoạn code Python / CLI / cấu hình chuẩn sản xuất kèm giải thích ý nghĩa bảo mật, tối ưu và xử lý lỗi.
- **🧪 Bài Lab cầm tay chỉ việc từng bước:** Mục tiêu, 4 bước triển khai cụ thể, kết quả nghiệm thu và checklist 3 bước.
- **🎯 Góc Luyện Thi Microsoft & Kiểm tra cuối bài:** Mẹo nhận diện từ khóa đề thi (Exam Keyword), cảnh báo bẫy sinh viên hay mắc và **2 câu hỏi tình huống có giải thích cả đáp án đúng lẫn đáp án nhiễu** (tổng cộng **120 câu hỏi cuối bài**).

### 2. Phòng Thi Thử Mô Phỏng & Thầy Giáo Chữa Đề 4 Bước
- **6 Bộ đề luyện thi đầy đủ:**
  - **2 Đề thi thử AI-103 chuẩn cấu trúc 5 miền kỹ năng** (mỗi đề 25 câu, 45 phút, có **Case Study doanh nghiệp** ở đầu đề).
  - **2 Đề thi thử AI-500 chuẩn cấu trúc 4 miền kỹ năng Expert** (mỗi đề 25 câu, 50 phút, có **Case Study kiến trúc Multi-Agent** ở đầu đề).
  - **2 Đề khởi động rà soát phản xạ khái niệm nhanh** cho AI-103 và AI-500.
- **2 Chế độ làm bài linh hoạt:**
  - **⏱️ Thi thử bấm giờ (Chuẩn Pearson VUE):** Đồng hồ đếm ngược, chế độ xem từng câu hoặc toàn trang, đánh dấu câu phân vân (`🚩`), quy đổi thang điểm **100–1000** (chuẩn đạt **700/1000**) và biểu đồ phân tích điểm mạnh/yếu theo từng **Exam Domain**.
  - **👨‍🏫 Luyện đề & Xem Thầy chữa trực tiếp:** Làm xong câu nào có thể mở xem ngay lời giải chi tiết của thầy.
- **Phương pháp Chữa đề 4 bước độc quyền cho từng câu:**
  1. 🎯 **Bước 1 — Bắt từ khóa đề bài (Exam Keyword)**
  2. ✅ **Bước 2 — Giải thích bản chất kỹ thuật (Vì sao đáp án đúng)**
  3. ❌ **Bước 3 — Mổ xẻ từng phương án nhiễu (Vì sao các câu kia sai)**
  4. 💡 **Bước 4 — Mẹo phản xạ phòng thi & Nút 1-click mở lại đúng bài giảng gốc để ôn tập**
- **📕 Sổ tay câu sai tự động:** Tự động lưu lại mọi câu làm sai qua các lần thi thử để tạo **Đề Phục Thù** cho tới khi nắm vững 100%.

## Cấu trúc thư mục
- `index.html` — Trang khởi chạy chính
- `styles.css` — Giao diện lớp học & phòng thi responsive
- `data.js` — Khung chương trình 10 học phần, nguồn tài liệu chính thức & ngân hàng câu hỏi khởi động
- `content/lessons-p-a.js` — Bài giảng chi tiết Học phần P & A (12 bài)
- `content/lessons-b-c.js` — Bài giảng chi tiết Học phần B & C (12 bài)
- `content/lessons-d-e.js` — Bài giảng chi tiết Học phần D & E (12 bài)
- `content/lessons-f-g.js` — Bài giảng chi tiết Học phần F & G (12 bài)
- `content/lessons-h-i.js` — Bài giảng chi tiết Học phần H & I (12 bài)
- `content/exams-103.js` — 2 Bộ đề thi thử AI-103 (50 câu + Case Study + Chữa đề 4 bước)
- `content/exams-500.js` — 2 Bộ đề thi thử AI-500 (50 câu + Case Study + Chữa đề 4 bước)
- `app.js` — Logic lớp học, đồng hồ Pomodoro, phòng thi thử, thống kê miền kỹ năng & sổ tay câu sai

## Lưu ý
- Toàn bộ bài luyện và đề thi thử do đội ngũ giảng dạy tự biên soạn dựa trên đề cương công khai của Microsoft Learn để rèn tư duy thiết kế; **không phải** đề thi thật của Microsoft.
- Chứng chỉ chính thức chỉ do Microsoft cấp thông qua kỳ thi tại Pearson VUE.
