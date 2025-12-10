# Forum Diskusi — Fullstack Project (MERN + Express + Sequelize)

Proyek ini adalah aplikasi **Forum Diskusi** yang memungkinkan pengguna melakukan login, membuat pertanyaan, memberikan jawaban, serta mengelola akun. Aplikasi dibangun menggunakan **Node.js + Express** untuk backend dan **React + Redux Toolkit** untuk frontend.

---

## 🚀 Cara Menjalankan Project (Setelah Clone dari GitHub)

### 1. Clone Repository
```bash
git clone https://github.com/bryant-sulthan05/ujian_prak_pweb.git
```

Masuk ke folder project:
```bash
cd nama-repo
```

---

## ⚙️ Menjalankan Backend

Masuk ke folder backend:
```bash
cd backend
```

### 2. Install Dependencies Backend
```bash
npm install express cors express-session mysql2 sequelize connect-session-sequelize dotenv express-fileupload argon2 nodemailer
npm install --save-dev nodemon
```

---

### 3. Buat File `.env`
Contoh isi file:
```
APP_PORT=5000
SESS_SECRET=rahasia_session
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=nama_database
```

---

### 4. Jalankan Backend
```bash
npm run dev
```
atau:
```bash
nodemon index.js
```

---

## 💻 Menjalankan Frontend

Masuk ke folder frontend:
```bash
cd ../frontend
```

### 5. Install Dependencies Frontend
```bash
npm install
```

### 6. Jalankan Frontend
```bash
npm start
```

---

## 🔗 Koneksi Frontend ↔ Backend
Frontend membutuhkan backend aktif di:
```
http://localhost:5000
```

---

## 📁 Struktur Project
```
project/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── .env
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── README.md
```

---

## 🧩 Teknologi yang Digunakan
**Backend:** Node.js, Express, Sequelize, MySQL, Express-Session, Argon2, Nodemailer  
**Frontend:** React, Redux Toolkit, Axios, Material UI, Styled Components

---

## 🎉 Selesai!
Project siap dijalankan secara lokal setelah mengikuti langkah-langkah di atas.
