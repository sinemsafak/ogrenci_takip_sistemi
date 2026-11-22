// Şifreleri güvenli şekilde karşılaştırmak için bcrypt kullanıyoruz.
const bcrypt = require("bcrypt");

// JWT oluşturmak için jsonwebtoken kullanıyoruz.
const jwt = require("jsonwebtoken");

// MySQL bağlantımızı içeri aktarıyoruz.
const db = require("../config/db");

// Kullanıcı giriş işlemi.
async function login(req, res) {
  try {
    // Frontend'den gönderilen e-posta ve şifreyi alıyoruz.
    const { email, password } = req.body;
    console.log("Gelen alanlar:", Object.keys(req.body || {}));
    
    // İki alanın da doldurulup doldurulmadığını kontrol ediyoruz.
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

    // SQL sorgusunda ? kullanarak güvenli parametre gönderiyoruz.
    const [users] = await db.execute(
      "SELECT id, username, email, password FROM users WHERE email = ? LIMIT 1",
      [email.trim()]
    );

    // Kullanıcı bulunamazsa genel bir hata döndürüyoruz.
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "E-posta veya şifre hatalı."
      });
    }

    const user = users[0];

    // Girilen şifreyi veritabanındaki bcrypt hash ile karşılaştırıyoruz.
    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "E-posta veya şifre hatalı."
      });
    }

    // JWT içine şifre koymuyoruz, sadece kullanıcı kimliğini ekliyoruz.
    const token = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // JWT'yi JavaScript tarafından okunamayan HttpOnly cookie'ye yazıyoruz.
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/"
    });

    // Şifreyi veya JWT'yi JSON cevabında göndermiyoruz.
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

// Bu fonksiyonu route dosyasında kullanabilmek için dışarı aktarıyoruz.
module.exports = { login };