// React'in durum yönetimi özelliğini içeri aktarıyoruz.
import { useState } from "react";

// Giriş sayfasına ait CSS dosyasını içeri aktarıyoruz.
import "./Login.css";

// Giriş sayfası bileşenimizi oluşturuyoruz.
function Login() {
  // Kullanıcının girdiği e-posta adresini tutuyoruz.
  const [email, setEmail] = useState("");

  // Kullanıcının girdiği şifreyi tutuyoruz.
  const [password, setPassword] = useState("");

  // Şifrenin görünür olup olmadığını kontrol ediyoruz.
  const [showPassword, setShowPassword] = useState(false);

  // Hata mesajını tutuyoruz.
  const [error, setError] = useState("");

  // Bilgilendirme mesajını tutuyoruz.
  const [message, setMessage] = useState("");

  // Form gönderildiğinde çalışacak fonksiyon.
  function handleSubmit(event) {
    // Sayfanın otomatik olarak yenilenmesini engelliyoruz.
    event.preventDefault();

    // Önceki mesajları temizliyoruz.
    setError("");
    setMessage("");

    // E-posta ve şifre alanlarının boş olup olmadığını kontrol ediyoruz.
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

    // Backend bağlantısını bir sonraki aşamada gerçekleştireceğiz.
    setMessage("Form doğrulandı. Backend bağlantısı henüz yapılmadı.");
  }

  return (
    <main className="login-page">
      <section className="login-card">

        {/* Giriş ekranının üst başlık alanı */}
        <header className="login-header">

          {/* Mezuniyet kepi simgesi */}
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

        {/* Kullanıcının giriş bilgilerini alacağımız form */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
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
                required
              />

              {/* Şifre gösterme ve gizleme butonu */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                }
              >
                {showPassword ? "Gizle" : "Göster"}
              </button>

            </div>

          </div>

          {/* Hata varsa kullanıcıya gösteriyoruz. */}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* Form doğrulandıysa bilgilendirme mesajı gösteriyoruz. */}
          {message && (
            <div className="info-message" role="status">
              {message}
            </div>
          )}

          {/* Giriş yapma butonu */}
          <button type="submit" className="login-button">
            Giriş Yap
          </button>

        </form>

        {/* Sayfanın alt bilgi alanı */}
        <footer className="login-footer">
          Öğrenci Bilgi Sistemi © {new Date().getFullYear()}
        </footer>

      </section>
    </main>
  );
}

// Login bileşenini diğer dosyalarda kullanabilmek için dışarı aktarıyoruz.
export default Login;