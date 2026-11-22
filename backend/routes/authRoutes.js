// Express'in yönlendirme sistemini kullanıyoruz.
const express = require("express");

// Giriş fonksiyonumuzu içeri aktarıyoruz.
const { login } = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/login adresine gelen istekleri login fonksiyonuna gönderiyoruz.
router.post("/login", login);

// Route'ları server.js içinde kullanmak için dışarı aktarıyoruz.
module.exports = router;