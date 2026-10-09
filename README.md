# 🧹 CleanDrive Pro - Web Tool Dọn Dẹp Dung Lượng Google Drive Thông Minh

Công cụ giao diện Web hiện đại, bảo mật cao giúp bạn phân tích, quét sâu và dọn dẹp dung lượng Google Drive sau khi đăng nhập tài khoản qua chuẩn Google OAuth 2.0 chính thức.

---

## ✨ Tính Năng Nổi Bật

1. **🔐 Đăng nhập bảo mật Google OAuth 2.0**:
   - Sử dụng thư viện chính thức **Google Identity Services (GIS)** và **Google Drive REST API v3**.
   - Dữ liệu và mã token chạy 100% trên trình duyệt của bạn (Client-Side), không thông qua máy chủ bên thứ ba nào.
   - Nâng cấp tốc độ quét với `pageSize: 1000` và mở rộng hạn ngạch lên **50.000 tệp** (không còn bị giới hạn ở 1.000 tệp).

2. **💥 TÍNH NĂNG ĐẶC BIỆT: DỌN TRẮNG DRIVE (FACTORY RESET 0 GB)**:
   - Cơ chế dọn sạch 100% dung lượng Google Drive qua quy trình 3 giai đoạn siêu tốc:
     - **Giai đoạn 1**: Quét & xóa toàn bộ thư mục và tệp gốc (Root). Xóa thư mục gốc sẽ dọn sạch hàng vạn tệp con bên trong cùng lúc.
     - **Giai đoạn 2**: Quét vòng lặp để dọn sạch các tệp mồ côi (orphaned files) còn sót lại.
     - **Giai đoạn 3**: Làm rỗng Thùng rác vĩnh viễn (`emptyTrash`), đưa hạn ngạch Drive về **0 GB**.
   - Bảo mật 2 lớp: Yêu cầu gõ chính xác chữ `XOA TRANG` để mở khóa, chống bấm nhầm tuyệt đối.
   - Bảng tiến trình thời gian thực: Hiển thị phần trăm, ETA, dung lượng giải phóng và nhật ký từng tệp.

3. **⚡ Chế độ Demo (Dùng thử ngay không cần Client ID)**:
   - Cung cấp sẵn hơn 20 tệp mẫu đa dạng (video 4K 4.2GB, tệp nén 2.8GB, tệp trùng lặp mã MD5, tệp trong thùng rác, tệp rỗng 0-byte, tệp cũ từ 2020).
   - Cho phép trải nghiệm cả tính năng chọn lọc lẫn tính năng "Dọn Trắng Drive".

3. **📊 Thống kê trực quan dung lượng bộ nhớ**:
   - Thanh trạng thái hiển thị: Tổng dung lượng (15GB/100GB), Dung lượng đã dùng, Phần trăm cảnh báo.
   - Phân loại rõ ràng: Dung lượng tệp trong Drive, Dung lượng tệp đang chiếm trong Thùng rác (Trash), và Dung lượng còn trống.

4. **🎯 Bộ lọc & Phân tích thông minh**:
   - **Tệp Cực Lớn (> 100MB / > 500MB / > 1GB)**: Tìm ra ngay những "thủ phạm" ngốn bộ nhớ nhiều nhất.
   - **Tệp Trùng Lặp (Duplicate Finder)**: Thuật toán so khớp mã băm MD5 và tên tệp chuẩn xác. Tính năng 1-click **"Chọn tự động bản sao thừa"** giúp giữ lại bản gốc và xóa các bản sao lưu trùng lặp.
   - **Dọn Sạch Thùng Rác (Trash Manager)**: Các tệp trong thùng rác Google Drive vẫn chiếm 100% hạn ngạch bộ nhớ. Nút **"Dọn Sạch Thùng Rác"** giúp xóa vĩnh viễn toàn bộ chỉ với 1 cú click.
   - **Tệp Cũ Bỏ Quên (> 1 Năm)**: Lọc các bản sao lưu, tài liệu cũ lâu năm không sử dụng.
   - **Tệp Rỗng (0 Byte)**: Dọn các tệp lỗi, tệp rác tải dang dở.

5. **🛡️ Cơ chế an toàn & Tiện ích**:
   - Hỗ trợ cả 2 chế độ xóa: **Chuyển vào Thùng rác** (có thể phục hồi) hoặc **Xóa Vĩnh Viễn** (giải phóng dung lượng tức thì).
   - Hộp thoại cảnh báo thông minh tính toán trước chính xác dung lượng sẽ được giải phóng.
   - **Xuất báo cáo CSV**: Cho phép tải danh sách tệp đã quét ra Excel/CSV.

---

## 🚀 Hướng Dẫn Khởi Chạy Nhanh

### Cách 1: Chạy bằng file `start.bat` (Windows)
- Nhấp đúp chuột vào file [start.bat](file:///d:/hoc%20tap/tools/delete/start.bat) trong thư mục.
- Trình duyệt sẽ tự động mở trang web tại địa chỉ: `http://localhost:3000`.

### Cách 2: Chạy qua Terminal / Command Prompt
Mở terminal tại thư mục này và gõ:
```bash
python server.py
```
Hoặc:
```bash
python -m http.server 3000
```
Sau đó truy cập trình duyệt tại: `http://localhost:3000`.

---

## 🔑 Hướng Dẫn Tạo Google OAuth Client ID (Trong 2 phút)

Để kết nối trực tiếp với tài khoản Google Drive thật của bạn:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/) và tạo một Dự án mới (ví dụ: `CleanDrive Tool`).
2. Vào **APIs & Services** &rarr; **Library**, tìm **Google Drive API** và bấm **Enable (Bật)**.
3. Vào **APIs & Services** &rarr; **OAuth consent screen**:
   - Chọn loại: **External** (Bên ngoài) & bấm **Create**.
   - Nhập tên ứng dụng (App name) và email liên hệ của bạn.
   - Ở bước **Test users**, thêm địa chỉ Gmail của chính bạn để cho phép đăng nhập thử nghiệm.
4. Vào **APIs & Services** &rarr; **Credentials** &rarr; **Create Credentials** &rarr; **OAuth client ID**:
   - Application type: Chọn **Web application**.
   - Tại mục **Authorized JavaScript origins**, thêm:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
5. Bấm **Create**, sau đó copy chuỗi **Client ID** (dạng `xxxxxxxxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com`).
6. Mở web CleanDrive Pro, bấm vào nút **Cài đặt API** (biểu tượng bánh răng ở góc trên bên phải), dán Client ID vào và bấm **Lưu cấu hình**.
7. Bấm **Đăng nhập Google** để bắt đầu quét và dọn dẹp Drive!
