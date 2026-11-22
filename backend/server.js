// .env dosyasındaki ayarları yüklüyoruz.
require("dotenv").config();

// Gerekli kütüphaneleri içeri aktarıyoruz.
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Veritabanı bağlantısını içeri aktarıyoruz.
const db = require("./config/db");

// Giriş sistemi route'larını içeri aktarıyoruz.
const authRoutes = require("./routes/authRoutes");

// Express uygulamamızı oluşturuyoruz.
const app = express();

const PORT = process.env.PORT || 5000;

// JSON formatında gelen istekleri okumamızı sağlıyor.
app.use(express.json());

// Tarayıcıdan gelen cookie'leri okumamızı sağlıyor.
app.use(cookieParser());

// React uygulamasının backend'e cookie ile istek göndermesine izin veriyoruz.
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// Sunucunun çalışıp çalışmadığını kontrol eden test adresi.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend sunucusu çalışıyor."
  });
});

// Kimlik doğrulama adreslerini uygulamaya bağlıyoruz.
app.use("/api/auth", authRoutes);

// Önce MySQL bağlantısını test edip ardından sunucuyu başlatıyoruz.
async function startServer() {
  try {
    const connection = await db.getConnection();

    console.log("MySQL veritabanı bağlantısı başarılı.");

    connection.release();

    app.listen(PORT, () => {
      console.log(
        `Backend sunucusu http://localhost:${PORT} adresinde çalışıyor.`
      );
    });
  } catch (error) {
    console.error("MySQL bağlantı hatası:", error.message);
    process.exit(1);
  }
}

startServer();