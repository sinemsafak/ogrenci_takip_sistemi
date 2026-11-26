// Şifreleri güvenli şekilde karşılaştırmak için bcrypt kullanıyoruz.
const bcrypt = require("bcrypt");

// JWT oluşturmak için jsonwebtoken kullanıyoruz.
const jwt = require("jsonwebtoken");

// MySQL bağlantımızı içeri aktarıyoruz.
const db = require("../config/db");


// ==========================================
// 1. KULLANICI GİRİŞ İŞLEMİ
// ==========================================

async function login(req, res) {
  try {
    // Kullanıcıdan gelen e-posta ve şifreyi alıyoruz.
    const { email, password } = req.body || {};

    // E-posta ve şifre alanlarını kontrol ediyoruz.
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "E-posta ve şifre zorunludur."
      });
    }

    // Kullanıcıyı e-posta adresine göre veritabanında arıyoruz.
    const [users] = await db.execute(
      "SELECT id, username, email, password FROM users WHERE email = ? LIMIT 1",
      [email.trim()]
    );

    // Kullanıcı bulunamadıysa hata döndürüyoruz.
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "E-posta veya şifre hatalı."
      });
    }

    const user = users[0];

    // Girilen şifreyi veritabanındaki hash ile karşılaştırıyoruz.
    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    // Şifre yanlışsa girişe izin vermiyoruz.
    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "E-posta veya şifre hatalı."
      });
    }

    // Kullanıcı kimliğiyle JWT oluşturuyoruz.
    const token = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN || "1h"
      }
    );

    // JWT'yi HttpOnly cookie içerisinde saklıyoruz.
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/"
    });

    // Kullanıcının güvenli bilgilerini döndürüyoruz.
    return res.status(200).json({
      success: true,
      message: "Giriş başarılı.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Giriş hatası:", error.message);

    return res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu."
    });
  }
}


// ==========================================
// 2. OTURUM VE KULLANICI BİLGİLERİ
// ==========================================

async function me(req, res) {
  try {
    // Middleware tarafından doğrulanan kullanıcı kimliğini alıyoruz.
    const userId = req.user.id;

    // Kullanıcının güncel bilgilerini veritabanından alıyoruz.
    // Güvenlik nedeniyle password alanını sorgulamıyoruz.
    const [users] = await db.execute(
      "SELECT id, username, email FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    // Kullanıcı artık veritabanında bulunmuyorsa erişimi engelliyoruz.
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı oturumu geçersiz."
      });
    }

    // Giriş yapmış kullanıcının bilgilerini döndürüyoruz.
    return res.status(200).json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error("Oturum kontrol hatası:", error.message);

    return res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu."
    });
  }
}


// ==========================================
// 3. KULLANICI ÇIKIŞ İŞLEMİ
// ==========================================

function logout(req, res) {
  // Giriş sırasında oluşturulan token cookie'sini siliyoruz.
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/"
  });

  // Çıkış işleminin başarılı olduğunu bildiriyoruz.
  return res.status(200).json({
    success: true,
    message: "Çıkış başarılı."
  });
}


// ==========================================
// FONKSİYONLARI DIŞARI AKTARMA
// ==========================================

module.exports = {
  login,
  me,
  logout
};