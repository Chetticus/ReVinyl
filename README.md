# Vinyl Heritage Vietnam

Không gian số giới thiệu, lưu giữ và kể lại những câu chuyện xoay quanh đĩa nhạc, nghệ sĩ và đời sống âm nhạc Việt Nam.

> Mỗi chiếc đĩa lưu giữ một thời đại.

## [LINK-DEMO](https://drive.google.com/drive/folders/1ch69fEvJzArxUTdVh26wiy7COyrBHhxd?usp=sharing)

![Vinyl Heritage](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788429898/6ef8fb24-469f-47fe-97ad-225ab208e1e6.png)

---

## Giới thiệu

**Vinyl Heritage Vietnam** là nền tảng khám phá di sản âm nhạc Việt Nam qua đĩa than (vinyl). Dự án bảo tồn, hệ thống hóa và lan tỏa giá trị lịch sử, nghệ thuật và ký ức được lưu giữ trên các ấn phẩm âm nhạc — từ bản thu, nghệ sĩ, thời kỳ đến câu chuyện phía sau mỗi mặt đĩa.

Nền tảng gồm bốn mảng chính:

- **Kho lưu trữ âm nhạc** — nghe, tra cứu và đọc bối cảnh của từng bản thu, song ngữ Việt / Anh
- **Hoạt động khám phá** — bốn dạng trò chơi học tập quanh di sản âm nhạc
- **Chuyên đề** — nội dung học tập có cấu trúc kèm bài học và quiz
- **Trợ lý AI** — hỏi đáp theo ngữ cảnh về đĩa nhạc, nghệ sĩ và lịch sử âm nhạc

Toàn bộ nội dung cốt lõi (kho lưu trữ, trang bản thu, dòng thời gian) truy cập công khai, không cần đăng nhập.

---

## Tính năng chính

### Kho lưu trữ âm nhạc (Archive)

Trái tim của dự án. Mỗi bản thu được xây dựng như một hồ sơ tư liệu hoàn chỉnh.

**Trang duyệt kho** — `/[locale]/archive`

- Tìm kiếm theo từ khóa
- Lọc theo **Thời kỳ / Thể loại / Vùng miền / Nhạc cụ**, dữ liệu lọc lấy từ `archiveApi.lookups`
- Phân trang, trạng thái lọc được đồng bộ vào URL nên có thể chia sẻ đường dẫn kết quả

**Trang chi tiết bản thu** — `/[locale]/recordings/[slug]`

- Trình phát audio chuyển đổi **Digital ↔ Vinylized**, giữ nguyên vị trí phát và trạng thái khi đổi nguồn
- Bối cảnh lịch sử và bối cảnh văn hóa
- Lời ca đầy đủ, ý nghĩa lời ca và ghi chú dị bản
- Những điểm đáng chú ý khi nghe
- Giá trị lưu giữ của bản thu
- Nhạc cụ xuất hiện trong bản thu kèm vai trò và độ tin cậy nhận diện
- Nguồn tham khảo kèm trạng thái kiểm chứng
- Các bản thu liên quan

**Dòng thời gian** — `/[locale]/timeline`

Trình bày âm nhạc Việt Nam theo từng thời kỳ, mỗi thời kỳ kèm bối cảnh âm nhạc, bản thu và nghệ sĩ tiêu biểu.

**Đóng góp tư liệu** — `/[locale]/contribute`

Biểu mẫu công khai cho phép cộng đồng gửi bản thu mới, bổ sung thông tin, đính chính, kể chuyện hoặc cung cấp nguồn tham khảo, kèm liên kết tài nguyên và tùy chọn ghi nhận đóng góp.

> **Digital** là bản âm thanh số của bản thu. **Vinylized** là bản được xử lý từ nguồn Digital nhằm tạo trải nghiệm nghe lấy cảm hứng từ đặc tính đĩa than — không phải âm thanh số hóa trực tiếp từ một đĩa vinyl thật.

### Song ngữ Việt / English

![Archive](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788429984/135c3940-94a3-4e49-9480-e85ce1678969.png)

- Định tuyến theo tiền tố đường dẫn: `/vi/...` và `/en/...`
- Nút chuyển ngôn ngữ giữ nguyên đường dẫn, query string và hash hiện tại
- Nội dung bản thu lưu theo từng ngôn ngữ; khi thiếu bản dịch, giao diện hiển thị thông báo và rơi về ngôn ngữ còn lại
- Metadata SEO và `alternates.languages` sinh riêng cho từng ngôn ngữ

### Tài khoản & bảo mật

![Auth](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788429941/e4ee29d9-929b-4eae-a5f1-3809af32fad2.png)

- Đăng ký / đăng nhập bằng email và mật khẩu
- Xác thực email qua mã OTP 6 số, có gửi lại mã
- Quên mật khẩu và đặt lại mật khẩu
- Tự động làm mới access token khi hết hạn, gộp các request đang chờ để chỉ refresh một lần
- Phân quyền `admin` tại tầng middleware

### Hoạt động khám phá (Discovery Activities)

Bốn dạng hoạt động, tất cả đều có đồng hồ đếm ngược 180 giây và bảng kết quả sau khi nộp.

| Hoạt động   | Đường dẫn                             | Mã API      | Cách chơi                                            |
| ----------- | ------------------------------------- | ----------- | ---------------------------------------------------- |
| Câu hỏi vui | `/discovery-activities/quizz`         | `quiz`      | Trắc nghiệm nhiều lựa chọn có tính giờ               |
| Điền từ     | `/discovery-activities/fill-story`    | `fillBlank` | Điền từ còn thiếu vào câu chuyện                     |
| Ghép hình   | `/discovery-activities/puzzle-heroes` | `puzzle`    | Xếp ô trượt thành ảnh hoàn chỉnh, đếm số nước đi     |
| Sắp xếp     | `/discovery-activities/timeline`      | `ordering`  | Kéo thả sắp xếp sự kiện theo đúng trình tự thời gian |

### Chuyên đề & bài học

- Danh mục chuyên đề với tab phân loại
- Chi tiết chuyên đề: tổng quan, nội dung, đánh giá, chuyên đề liên quan, đăng ký học
- Trình phát bài học: video, tài liệu, quiz, thanh điều hướng bài học thu gọn được
- Ghi nhận tiến trình hoàn thành từng bài
- Học viên gửi đánh giá kèm số sao

### Trợ lý AI (Ask AI)

![Ask AI](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788430009/3fb95ff0-941e-4f32-b80a-fad15a67e056.png)

Đường dẫn `/heritage-guide`, kèm nút nổi có mặt trên mọi trang.

- Hỏi đáp về lịch sử đĩa than, nghệ sĩ và bản thu Việt Nam
- Danh sách hội thoại, đổi tên và xóa hội thoại
- Thẻ gợi ý câu hỏi cho lần đầu sử dụng
- Đính kèm ảnh trong câu hỏi

### Không gian cá nhân (Dashboard)

![Dashboard](https://res.cloudinary.com/dks2uuwb6/image/upload/v1788430054/59edba9e-7fb2-4936-bfb7-a10c28254bc7.png)

| Mục        | Đường dẫn                         | Nội dung                                                         |
| ---------- | --------------------------------- | ---------------------------------------------------------------- |
| Tổng quan  | `/dashboard`                      | Thống kê học tập tổng hợp                                        |
| Chuyên đề  | `/dashboard/topics`               | Chuyên đề đã đăng ký, lọc đang học / đã xong                     |
| Thành tích | `/dashboard/personal-achievement` | Điểm học tập và điểm hoạt động theo từng dạng, kèm bảng xếp hạng |
| Hồ sơ      | `/dashboard/profile`              | Thông tin cá nhân                                                |
| Đánh giá   | `/dashboard/reviews`              | Các đánh giá đã gửi                                              |
| Cài đặt    | `/dashboard/settings`             | Sửa hồ sơ, tải ảnh đại diện, đổi mật khẩu                        |

### Trang nội dung

- **Trang chủ** — hero, bộ sưu tập, câu chuyện, giá trị, cảm nhận, đăng ký nhận tin
- **Giới thiệu** `/about` — tầm nhìn, cách dự án làm việc
- **Liên hệ** `/contact` — biểu mẫu liên hệ có kiểm tra dữ liệu bằng Zod
- **Câu hỏi thường gặp** `/faq` — accordion, nội dung lấy từ từ điển song ngữ

### Quản trị (Admin)

| Khu vực            | Đường dẫn                                 | Chức năng                                                                        |
| ------------------ | ----------------------------------------- | -------------------------------------------------------------------------------- |
| Tổng quan          | `/admin`                                  | Thống kê bản thu, danh mục, đóng góp và các đóng góp mới nhất                    |
| Bản thu            | `/admin/archive/recordings`               | Danh sách, tìm kiếm, lọc trạng thái, xuất bản / gỡ xuất bản, xóa                 |
| Soạn bản thu       | `/admin/archive/recordings/new` · `/[id]` | Trình soạn thảo đầy đủ: song ngữ, nhạc cụ, nguồn tham khảo, tải ảnh bìa và audio |
| Danh mục           | `/admin/archive/taxonomies`               | Quản lý Nghệ sĩ, Album, Thời kỳ, Thể loại, Vùng miền, Nhạc cụ                    |
| Đóng góp           | `/admin/archive/contributions`            | Duyệt đóng góp kèm bảng kiểm nguồn / bản quyền / độ chính xác / trùng lặp        |
| Người dùng         | `/admin/users`                            | Thêm, sửa, xóa tài khoản                                                         |
| Chuyên đề          | `/admin/topics` · `/admin/create-topic`   | Quản lý và tạo chuyên đề, module, bài học, quiz                                  |
| Danh mục chuyên đề | `/admin/topics/categories`                | Quản lý danh mục                                                                 |
| Hoạt động          | `/admin/discovery-activities`             | Quản lý hoạt động và bảng điểm người dùng                                        |
| Đánh giá           | `/admin/reviews`                          | Duyệt đánh giá của học viên                                                      |

Trình soạn bản thu có thanh tiến độ hoàn thiện, tự sinh `slug` từ tiêu đề tiếng Việt và chấm điểm mức đầy đủ của hồ sơ.

---

## Công nghệ

| Hạng mục    | Công nghệ                                                               |
| ----------- | ----------------------------------------------------------------------- |
| Framework   | Next.js 15.2.1 (App Router, Turbopack), React 19, TypeScript 5          |
| Giao diện   | Tailwind CSS v4, Radix UI (shadcn-style), Framer Motion, Swiper         |
| Dữ liệu     | TanStack Query v5, Axios                                                |
| Trạng thái  | Zustand v5 (có `persist`)                                               |
| Biểu mẫu    | React Hook Form + Zod                                                   |
| Đa ngôn ngữ | Tự xây dựng — từ điển TypeScript + middleware, không dùng thư viện i18n |
| Media       | React Player, Three.js / React Three Fiber                              |
| Tương tác   | dnd-kit (kéo thả), CKEditor 5 (soạn thảo)                               |
| Thông báo   | Sonner, React Hot Toast                                                 |
| Backend     | NestJS, triển khai tách riêng                                           |

---

## Yêu cầu

- Node.js 18 trở lên (dự án đang phát triển trên Node 22)
- npm
- Một backend NestJS đang chạy để cung cấp API

---

## Cài đặt

### 1. Cài dependency

```bash
npm install
```

### 2. Cấu hình biến môi trường

Sao chép `.env.example` thành `.env` và điền:

```env
NEXT_PUBLIC_API_URL=https://<domain-backend-cua-ban>
NEXT_PUBLIC_X_TENANT_ID=VINYL
```

`NEXT_PUBLIC_X_TENANT_ID` được gắn vào mọi request dưới dạng header `x-tenant-id`.

### 3. Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) — trang chủ sẽ tự chuyển hướng sang `/vi`.

### 4. Build production

```bash
npm run build
npm start
```

---

## Cấu trúc thư mục

```text
src/
├── app/
│   ├── (auth)/                  # Đăng nhập, đăng ký, OTP, quên / đổi mật khẩu
│   ├── (main)/                  # Trang chủ, giới thiệu, liên hệ, FAQ,
│   │                            # chuyên đề, hoạt động khám phá, trợ lý AI
│   ├── (explorer)/              # Dashboard học viên
│   ├── [locale]/                # Bản song ngữ: archive, recordings, timeline, contribute
│   ├── admin/                   # Trang quản trị
│   └── api/                     # Route handler của Next.js
├── components/
│   ├── archive/                 # AudioPlayer, RecordingCard, LocaleSwitch, biểu mẫu đóng góp
│   ├── admin/archive/           # RecordingEditor, AdminReviewChecklist
│   ├── challenge/               # Bố cục và kết quả của bốn dạng hoạt động
│   ├── ask-ai/                  # Màn hình trò chuyện với AI
│   ├── course/ · lesson/        # Chuyên đề và bài học
│   ├── home/vinyl/              # Các khối của trang chủ
│   ├── common/                  # Header, Footer, hiệu ứng cuộn
│   └── ui/                      # Primitive dùng chung
├── modules/                     # Tách theo domain: domain / hooks / infrastructure
│   ├── archive/                 # api.ts + types.ts của kho lưu trữ
│   ├── auth/ · courses/ · challenges/ · ask-ai/ · admin/
├── i18n/                        # config, dictionaries, archive copy, provider
├── constants/                   # Route, nội dung tĩnh, đường dẫn ảnh
├── lib/                         # Axios, xử lý lỗi, JWT, tiện ích
├── stores/                      # Zustand store
├── hooks/                       # Hook dùng chung
└── middleware.ts                # Chuyển hướng ngôn ngữ, chặn route, phân quyền
```

---

## Luồng màn hình

| Đường dẫn                                                                        | Màn hình                     | Cần đăng nhập       |
| -------------------------------------------------------------------------------- | ---------------------------- | ------------------- |
| `/`                                                                              | Chuyển hướng sang `/vi`      | Không               |
| `/[locale]`                                                                      | Trang chủ                    | Không               |
| `/[locale]/archive`                                                              | Duyệt kho lưu trữ            | Không               |
| `/[locale]/recordings/[slug]`                                                    | Chi tiết bản thu             | Không               |
| `/[locale]/timeline`                                                             | Dòng thời gian theo thời kỳ  | Không               |
| `/[locale]/contribute`                                                           | Gửi đóng góp tư liệu         | Không               |
| `/[locale]/about` · `/contact` · `/faq`                                          | Trang nội dung               | Không               |
| `/topics` · `/topics/[id]`                                                       | Chuyên đề                    | Không               |
| `/topics/[id]/lessons/[lessonId]`                                                | Học bài                      | Có                  |
| `/discovery-activities`                                                          | Danh sách hoạt động khám phá | Không               |
| `/discovery-activities/{loại}/[id]`                                              | Chơi một hoạt động           | Có                  |
| `/heritage-guide`                                                                | Trợ lý AI                    | Không               |
| `/dashboard/*`                                                                   | Không gian cá nhân           | Có                  |
| `/login` · `/register` · `/verify-otp` · `/forgot-password` · `/update-password` | Xác thực                     | Không               |
| `/admin/*`                                                                       | Quản trị                     | Có, vai trò `admin` |

---

## Tầng gọi API

Mọi request đi qua một instance Axios chung tại `src/lib/api/axios.ts`, tự gắn `Authorization` và `x-tenant-id`, tự refresh token khi gặp lỗi 401.

```ts
// src/modules/archive/api.ts
export const archiveApi = {
  list: params => api.get('/archive/recordings', { params }),
  detail: (slug, locale) =>
    api.get(`/archive/recordings/${slug}`, { params: { locale } }),
  lookups: () => api.get('/archive/lookups'),
  timeline: locale => api.get('/archive/timeline', { params: { locale } }),
  createContribution: data => api.post('/archive/contributions', data),
  // ... nhóm /admin/archive/* cho quản trị
};
```

Các nhóm endpoint khác khai báo tập trung tại `src/lib/api/routes/index.ts`:

| Nhóm        | Endpoint tiêu biểu                                                                |
| ----------- | --------------------------------------------------------------------------------- |
| `AUTH`      | `/auth/sign-in`, `/auth/sign-up`, `/auth/verify-email`, `/auth/refresh-token`     |
| `COURSE`    | `/courses`, `/courses/:id`, `/courses/lesson/:id`, `/courses/lesson/:id/progress` |
| `CHALLENGE` | `/challenge`, `/challenge/:id`, `/challenge/:id/submit`                           |
| `USER`      | `/users/me`, `/users/total-score`, `/enrollments/my`, `/users/upload-avatar`      |
| `SCORES`    | `/scores/my-score`, `/scores/leaderboard`                                         |
| `CHAT`      | `/chat`, `/chat/conversations`, `/chat/conversations/:id`                         |
| `ARCHIVE`   | `/archive/*`, `/admin/archive/*` (khai trong `modules/archive/api.ts`)            |

---

## Bảng dữ liệu chính

Kho lưu trữ gồm sáu danh mục và một thực thể trung tâm là **bản thu**.

| Model                  | Vai trò                           | Trường chính                                                                                                                                                                          |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Artist`               | Nghệ sĩ, nhạc sĩ, người biểu diễn | `name`, `slug`                                                                                                                                                                        |
| `Album`                | Album hoặc tuyển tập              | `name`, `slug`                                                                                                                                                                        |
| `Era`                  | Thời kỳ âm nhạc                   | `name`, `slug`, `startYear`, `endYear`, nội dung song ngữ `title` / `summary` / `musicalContext`                                                                                      |
| `Genre`                | Thể loại                          | `name`, `slug`                                                                                                                                                                        |
| `Region`               | Vùng miền                         | `name`, `slug`                                                                                                                                                                        |
| `Instrument`           | Nhạc cụ                           | `name`, `slug`                                                                                                                                                                        |
| `Recording`            | Bản thu                           | `slug`, `year`, `status`, `coverImage`, liên kết tới 5 danh mục trên                                                                                                                  |
| `RecordingTranslation` | Nội dung bản thu theo ngôn ngữ    | `locale`, `title`, `shortSummary`, `historicalContext`, `culturalContext`, `lyricsMeaning`, `lyricsNotes`, `whatToListenFor`, `preservationValue`, `fullLyrics`, `lyricsRightsStatus` |
| `RecordingAudio`       | File âm thanh                     | `type` (`DIGITAL` / `VINYLIZED`), `url`, `sourceNote`, `rightsNote`                                                                                                                   |
| `RecordingInstrument`  | Nhạc cụ trong bản thu             | `instrument`, `roleVi`, `roleEn`, `confidence`                                                                                                                                        |
| `RecordingReference`   | Nguồn tham khảo                   | `title`, `url`, `type`, `publisher`, `publishedYear`, `verificationStatus`                                                                                                            |
| `Contribution`         | Đóng góp từ cộng đồng             | `type`, `status`, bốn trạng thái kiểm duyệt, danh sách tài nguyên đính kèm                                                                                                            |

Giá trị enum:

```text
Recording.status          DRAFT | PUBLISHED
RecordingAudio.type       DIGITAL | VINYLIZED
locale                    vi | en
lyricsRightsStatus        ALLOWED | RESTRICTED | UNKNOWN
verificationStatus        VERIFIED | PENDING | UNVERIFIED
Contribution.type         NEW_RECORDING | INFORMATION | CORRECTION | STORY | REFERENCE
Contribution.status       PENDING | UNDER_REVIEW | APPROVED | REJECTED
```

### Nhập liệu hàng loạt bằng Excel

Thay vì tạo từng record trên trang quản trị, dùng file mẫu kèm theo repo:

```text
Vinyl-Heritage-Import-Template.xlsx
```

File gồm 15 sheet, mỗi sheet tương ứng một model và dùng đúng tên trường của API. Các sheet liên kết với nhau bằng `slug` thay vì ID, nên người điền không cần biết ID trong cơ sở dữ liệu.

Thứ tự điền bắt buộc:

```text
1. Danh mục      01_Artist · 02_Album · 03_Era · 04_Genre · 05_Region · 06_Instrument
2. Bản thu       07_Recording
3. Nội dung      08_Recording_Translation        (mỗi bản thu 2 dòng: vi và en)
4. Đính kèm      09_Recording_Audio · 10_Recording_Instrument · 11_Recording_Reference
5. Nội dung web  12_Footer · 13_About_Us · 14_Contact
```

Sheet `00_HUONG_DAN` mô tả quy tắc điền, quy ước slug, định dạng năm và chú giải màu. Cột có tiêu đề nền cam là bắt buộc, nền xám là tùy chọn; các trường enum đã gắn sẵn dropdown.

---

## Script

| Lệnh                   | Mô tả                                    |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Chạy môi trường phát triển với Turbopack |
| `npm run build`        | Build production                         |
| `npm start`            | Chạy bản build                           |
| `npm run lint`         | Kiểm tra ESLint                          |
| `npm run lint:fix`     | Tự sửa lỗi ESLint                        |
| `npm run format`       | Format toàn bộ mã nguồn bằng Prettier    |
| `npm run format:check` | Kiểm tra format, không ghi đè            |

---

## Ghi chú phát triển

- **Đa ngôn ngữ tự xây dựng.** Không dùng `next-intl`. Từ điển nằm ở `src/i18n/dictionaries.ts` (giao diện chung) và `src/i18n/archive.ts` (kho lưu trữ). Thêm chuỗi mới phải thêm đủ cả `vi` và `en`.
- **Trang trùng lặp.** Một số trang trong `[locale]` chỉ là re-export của bản trong `(main)`, ví dụ `export { default } from '@/app/(main)/faq/page';`. Sửa nội dung thì sửa ở `(main)`.
- **Token lưu ở hai nơi.** Zustand `localStorage` để Axios đọc, và cookie để middleware đọc. Cả hai được ghi cùng lúc trong `useAuthStore`.
- **`verifyJwt` chỉ giải mã payload**, không kiểm tra chữ ký — phân quyền thực sự phải do backend đảm nhiệm.
- **Danh sách route công khai khớp chính xác chuỗi** (`publicRoutes.includes(pathname)`), không phải khớp tiền tố. Một số đường dẫn `/admin/*` hiện nằm trong danh sách này, nên khách chưa đăng nhập không bị middleware chặn — chốt chặn thật nằm ở backend khi gọi API.
- **Thuật ngữ.** "Chuyên đề" (topic), "khóa học" (course) và "product" trong mã nguồn cùng trỏ tới một thực thể; tên package vẫn là `nextjs-code-base` do dự án phát triển trên nền một codebase e-learning.
- **Phần chưa hoàn thiện.** `src/components/3d-viewer/*` chưa được dùng ở đâu, `src/app/(explorer)/profile/page.tsx` và `src/app/admin/(heritage-catalogs)/*` còn là trang rỗng, route handler `/api/admin/courses` chưa xử lý upload file thật.
- **Quy ước mã nguồn.** Chạy `npm run format` trước khi commit; cấu hình Prettier và ESLint đã có sẵn trong repo.

---

© Vinyl Heritage Vietnam
