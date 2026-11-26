// React'in durum yönetimi özelliğini içeri aktarıyoruz.
import { useState } from "react";

// Dashboard sayfasının CSS dosyasını içeri aktarıyoruz.
import "./Dashboard.css";

// Kullanıcı paneli bileşenimizi oluşturuyoruz.
function Dashboard({ user, onLogout }) {

  // Çıkış işleminin devam edip etmediğini tutuyoruz.
  const [loading, setLoading] = useState(false);

  // Hata mesajını tutuyoruz.
  const [error, setError] = useState("");

  // Çıkış butonuna basıldığında çalışacak fonksiyon.
  async function handleLogout() {

    // Devam eden bir çıkış işlemi varsa tekrar başlatmıyoruz.
    if (loading) {
      return;
    }

    // Önceki hata mesajını temizliyoruz.
    setError("");

    // Çıkış işleminin başladığını belirtiyoruz.
    setLoading(true);

    try {

      // App.jsx içerisinden gelen çıkış fonksiyonunu çalıştırıyoruz.
      await onLogout();

    } catch (error) {

      // Çıkış işlemi başarısızsa hata mesajını gösteriyoruz.
      setError(error.message);

    } finally {

      // Yükleniyor durumunu kapatıyoruz.
      setLoading(false);

    }
  }

  return (
    <div className="dashboard-page">

      {/* Sayfanın üst menüsü */}
      <header className="dashboard-header">

        <div className="dashboard-brand">

          {/* Mezuniyet kepi simgesi */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 10l10-5 10 5-10 5-10-5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
            <path d="M22 10v6" />
          </svg>

          <span>Öğrenci Bilgi Sistemi</span>

        </div>

        {/* Çıkış yapma butonu */}
        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
        </button>

      </header>

      {/* Kullanıcı panelinin ana içeriği */}
      <main className="dashboard-content">

        {/* Karşılama alanı */}
        <section className="dashboard-welcome">

          <h1>Hoş geldiniz, {user.username}!</h1>

          <p>
            Öğrenci Bilgi Sistemi kullanıcı paneline hoş geldiniz.
          </p>

        </section>

        {/* Hata mesajı alanı */}
        {error && (
          <div className="dashboard-error" role="alert">
            {error}
          </div>
        )}

        {/* Kullanıcı bilgilerinin gösterildiği kart */}
        <section className="profile-card">

          <div className="profile-header">

            {/* Kullanıcı simgesi */}
            <div className="profile-icon" aria-hidden="true">

              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>

            </div>

            <h2>Kullanıcı Bilgileri</h2>

          </div>

          {/* Kullanıcı bilgileri backend'den gelmektedir. */}
          <div className="profile-details">

            <div className="profile-item">
              <span>Kullanıcı ID</span>
              <strong>{user.id}</strong>
            </div>

            <div className="profile-item">
              <span>Kullanıcı adı</span>
              <strong>{user.username}</strong>
            </div>

            <div className="profile-item">
              <span>E-posta adresi</span>
              <strong>{user.email}</strong>
            </div>

          </div>

          {/* Son oturum kontrolünün başarılı olduğunu gösteriyoruz. */}
          <div className="session-status">

            <span className="status-dot"></span>

            Son oturum kontrolü başarılı

          </div>

        </section>

      </main>

      {/* Sayfanın alt bilgi alanı */}
      <footer className="dashboard-footer">
        Öğrenci Bilgi Sistemi © {new Date().getFullYear()}
      </footer>

    </div>
  );
}

// Dashboard bileşenini dışarı aktarıyoruz.
export default Dashboard;