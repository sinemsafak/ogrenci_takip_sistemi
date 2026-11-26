// Express yönlendirme sistemini içeri aktarıyoruz.
const express = require("express");

// Kimlik doğrulama fonksiyonlarını içeri aktarıyoruz.
const {
  login,
  me,
  logout
} = require("../controllers/authController");

// JWT kontrol middleware'ini içeri aktarıyoruz.
const authMiddleware = require("../middlewares/authMiddleware");

// Express router oluşturuyoruz.
const router = express.Router();

// Kullanıcı giriş adresi.
// Bu adres için önceden giriş yapılması gerekmez.
router.post("/login", login);

// Kullanıcı oturum kontrol adresi.
// Önce JWT doğrulanır, ardından me fonksiyonu çalışır.
router.get("/me", authMiddleware, me);

// Kullanıcı çıkış adresi.
// Token geçersiz veya süresi dolmuş olsa bile cookie silinebilir.
router.post("/logout", logout);

// Router'ı dışarı aktarıyoruz.
module.exports = router;