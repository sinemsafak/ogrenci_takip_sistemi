// React'in durum yönetimi özelliğini içeri aktarıyoruz.
import { useState } from "react";

// Backend giriş fonksiyonunu içeri aktarıyoruz.
import { loginUser } from "../services/authService";

// Giriş sayfasının CSS dosyasını içeri aktarıyoruz.
import "./Login.css";

// App.jsx içerisinden onLogin fonksiyonunu alıyoruz.
function Login({ onLogin }) {

  // Kullanıcının e-posta adresini tutuyoruz.
  const [email, setEmail] = useState("");

  // Kullanıcının şifresini tutuyoruz.
  const [password, setPassword] = useState("");

  // Şifre gösterme durumunu tutuyoruz.
  const [showPassword, setShowPassword] = useState(false);

  // Hata mesajını tutuyoruz.
  const [error, setError] = useState("");

  // Giriş işleminin devam edip etmediğini tutuyoruz.
  const [loading, setLoading] = useState(false);

  // Form gönderildiğinde çalışan fonksiyon.
  async function handleSubmit(event) {

    // Sayfanın yenilenmesini engelliyoruz.
    event.preventDefault();

    // Devam eden bir giriş isteği varsa tekrar göndermiyoruz.
    if (loading) {
      return;
    }

    // Önceki hata mesajını temizliyoruz.
    setError("");

    // Boş alan kontrolü yapıyoruz.
    if (!email.trim() || !password) {
      setError("Lütfen bütün alanları doldurunuz.");
      return;
    }

    // E-posta adresinin biçimini kontrol ediyoruz.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }

    // Yükleniyor durumunu başlatıyoruz.
    setLoading(true);

    try {

      // Backend'e giriş isteği gönderiyoruz.
      await loginUser(email.trim(), password);

      // Şifre alanını temizliyoruz.
      setPassword("");

      // Şifre gösterme durumunu kapatıyoruz.
      setShowPassword(false);

      // App.jsx üzerinden oturumu doğruluyoruz.
      await onLogin();

    } catch (error) {

      // Hata mesajını kullanıcıya gösteriyoruz.
      setError(error.message);

    } finally {

      // Yükleniyor durumunu kapatıyoruz.
      setLoading(false);

    }
  }

  return (
    <main className="login-page">

      <section className="login-card">

        {/* Giriş ekranının başlık alanı */}
        <header className="login-header">

          <div className="login-logo" aria-hidden="true">

            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 10l10-5 10 5-10 5-10-5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
              <path d="M22 10v6" />
            </svg>

          </div>

          <h1>Öğrenci Bilgi Sistemi</h1>

          <p>Devam etmek için hesabınıza giriş yapın.</p>

        </header>

        {/* Kullanıcı giriş formu */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
          aria-busy={loading}
        >

          {/* E-posta alanı */}
          <div className="form-group">

            <label htmlFor="email">
              E-posta adresi
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@universite.edu.tr"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              required
            />

          </div>

          {/* Şifre alanı */}
          <div className="form-group">

            <label htmlFor="password">
              Şifre
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Şifrenizi giriniz"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                required
              />

              {/* Şifre gösterme ve gizleme butonu */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={
                  showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                }
              >
                {showPassword ? "Gizle" : "Göster"}
              </button>

            </div>

          </div>

          {/* Hata mesajı alanı */}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* Giriş yapma butonu */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

        </form>

        {/* Alt bilgi alanı */}
        <footer className="login-footer">
          Öğrenci Bilgi Sistemi © {new Date().getFullYear()}
        </footer>

      </section>

    </main>
  );
}

// Login bileşenini dışarı aktarıyoruz.
export default Login;