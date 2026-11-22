// Şifreyi hash'lemek için bcrypt kullanıyoruz.
const bcrypt = require("bcrypt");

// Veritabanı bağlantısını içeri aktarıyoruz.
const db = require("../config/db");

async function createTestUser() {
  try {
    // Test şifresini terminalden alıyoruz; kodun içine yazmıyoruz.
    const password = process.env.TEST_USER_PASSWORD;

    if (!password || password.length < 8) {
      console.error("Test şifresi en az 8 karakter olmalıdır.");
      process.exitCode = 1;
      return;
    }

    const username = "testuser";
    const email = "test@example.com";

    // Aynı e-posta ile kullanıcı varsa tekrar eklemiyoruz.
    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("Test kullanıcısı zaten mevcut.");
      return;
    }

    // Şifreyi bcrypt ile hash'liyoruz.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Veritabanına düz şifre yerine hash kaydediyoruz.
    await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    console.log("Test kullanıcısı başarıyla oluşturuldu.");
    console.log("E-posta: test@example.com");
  } catch (error) {
    console.error("Test kullanıcısı oluşturulamadı:", error.message);
    process.exitCode = 1;
  } finally {
    // İşlem bitince veritabanı bağlantı havuzunu kapatıyoruz.
    await db.end();
  }
}

createTestUser();