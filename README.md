# Vinyl Heritage Vietnam

Không gian số giới thiệu, lưu giữ và kể lại những câu chuyện xoay quanh đĩa nhạc, nghệ sĩ và đời sống âm nhạc Việt Nam.

> Mỗi chiếc đĩa lưu giữ một thời đại.

## [LINK-DEMO](https://drive.google.com/drive/folders/1ch69fEvJzArxUTdVh26wiy7COyrBHhxd?usp=sharing)

![Vinyl Heritage](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788429898/6ef8fb24-469f-47fe-97ad-225ab208e1e6.png)

---

## Giới thiệu

**Vinyl Heritage Vietnam** là nền tảng khám phá di sản âm nhạc Việt Nam qua đĩa than (vinyl). Dự án bảo tồn, hệ thống hóa và lan tỏa giá trị lịch sử, nghệ thuật và ký ức được lưu giữ trên các ấn phẩm âm nhạc — từ bản thu, nghệ sĩ, hãng đĩa đến câu chuyện phía sau mỗi mặt đĩa.

Nền tảng kết hợp:

- **Chuyên đề** học tập có cấu trúc
- **Trợ lý AI** hỗ trợ hỏi đáp theo ngữ cảnh
- **Không gian cá nhân** theo dõi tiến trình khám phá

---

## Mục tiêu

- Gìn giữ và kể lại di sản đĩa nhạc Việt Nam một cách dễ tiếp cận
- Hệ thống hóa tư liệu: nghệ sĩ, bản thu, hãng đĩa, bối cảnh lịch sử
- Tạo trải nghiệm học tập tương tác, không chỉ đọc tài liệu tĩnh
- Kết nối cộng đồng yêu vinyl và âm nhạc Việt

---

## Tính năng chính

### 1. Tài khoản & bảo mật

![Auth](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788429941/e4ee29d9-929b-4eae-a5f1-3809af32fad2.png)

- Đăng ký / đăng nhập bằng email và mật khẩu
- Xác thực email qua mã OTP
- Quên mật khẩu và đặt lại mật khẩu
- Phiên đăng nhập bảo mật (JWT)

### 2. Chuyên đề (Bộ sưu tập số)

![Topic](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788429984/135c3940-94a3-4e49-9480-e85ce1678969.png)

- Danh mục chuyên đề theo chủ đề / giai đoạn âm nhạc
- Chi tiết chuyên đề: mô tả, Chuyên đề, đánh giá
- Nội dung Chuyên đề: video, tài liệu, quiz
- Theo dõi tiến trình hoàn thành
- Đánh giá (review & rating) từ học viên

### 4. Trợ lý AI (Ask AI)

![Ask AI](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788430009/3fb95ff0-941e-4f32-b80a-fad15a67e056.png)

- Chat hỗ trợ học chuyên đề
- Hỏi đáp về lịch sử đĩa than, nghệ sĩ, nhãn đĩa Việt Nam
- Gợi ý lộ trình học và cách ôn luyện
- Lịch sử hội thoại, đổi tên / xóa đoạn chat
- Hỗ trợ đính kèm ảnh và nhận diện giọng nói (trình duyệt hỗ trợ)

### 5. Dashboard học viên

![Dashboard](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788430054/59edba9e-7fb2-4936-bfb7-a10c28254bc7.png)

- Tổng quan chuyên đề đã đăng ký
- Hồ sơ cá nhân (avatar, thông tin)
- Quản lý đánh giá đã gửi
- Cài đặt tài khoản
- Theo dõi thành tích

### 6. Trang giới thiệu & liên hệ

- **Giới thiệu**: câu chuyện dự án, giá trị VIỆT (Văn hóa – Ý nghĩa – Di sản – Truyền cảm hứng)
- **Liên hệ / FAQ**: form liên hệ và câu hỏi thường gặp
- **Newsletter**: đăng ký nhận tin cập nhật

### 7. Quản trị (Admin)

<!-- ![Admin](./docs/images/admin.png) -->

- Dashboard thống kê
- Quản lý chuyên đề, Chuyên đề, danh mục
- Quản lý điểm số
- Quản lý người dùng
- Quản lý đánh giá học viên

---

## Công nghệ

| Hạng mục      | Công nghệ                              |
| ------------- | -------------------------------------- |
| Frontend      | Next.js 15, React 19, TypeScript       |
| UI            | Tailwind CSS, shadcn/ui, Framer Motion |
| State / data  | Zustand, TanStack Query                |
| Form          | React Hook Form, Zod                   |
| Media         | React Player, Three.js (viewer)        |
| Auth (client) | JWT qua API                            |
| API           | NestJS backend (tách riêng)            |

---

## Cấu trúc thư mục (rút gọn)

```text
src/
├── app/                 # App Router (auth, main, explorer, admin)
├── components/          # UI theo domain (home, course, ask-ai…)
├── modules/             # Hooks + API theo domain
├── constants/           # Route, nội dung Vinyl, images
├── lib/                 # Axios, utils
└── stores/              # Zustand stores
```

---

## Bắt đầu nhanh

### Yêu cầu

- Node.js 18+
- Yarn (hoặc npm / pnpm)

### Cài đặt

```bash
yarn install
```

### Biến môi trường

Sao chép `.env.example` thành `.env.local` và điền:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_X_TENANT_ID=
```

### Chạy dev

```bash
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Build production

```bash
yarn build
yarn start
```

---

## Script hữu ích

| Lệnh          | Mô tả                                  |
| ------------- | -------------------------------------- |
| `yarn dev`    | Chạy môi trường phát triển (Turbopack) |
| `yarn build`  | Build production                       |
| `yarn start`  | Chạy bản build                         |
| `yarn lint`   | Kiểm tra ESLint                        |
| `yarn format` | Format Prettier                        |

---

## Đối tượng sử dụng

- Người yêu vinyl và âm nhạc Việt Nam
- Học viên muốn tìm hiểu di sản đĩa nhạc có hệ thống
- Giáo viên / nhà nghiên cứu cần tư liệu dễ tiếp cận
- Cộng đồng muốn chia sẻ và lan tỏa ký ức âm nhạc

---

© Vinyl Heritage Vietnam
