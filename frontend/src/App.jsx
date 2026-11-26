// React özelliklerini içeri aktarıyoruz.
import { useState, useEffect } from "react";

// Uygulama sayfalarını içeri aktarıyoruz.
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Kimlik doğrulama fonksiyonlarını içeri aktarıyoruz.
import {
  getCurrentUser,
  logoutUser
} from "./services/authService";

// Genel durum ekranlarının CSS dosyası.
import "./App.css";

function App() {

  // Giriş yapan kullanıcının bilgileri.
  const [user, setUser] = useState(null);

  // İlk oturum kontrolünün yüklenme durumu.
  const [loading, setLoading] = useState(true);

  // Bağlantı hatası mesajı.
  const [error, setError] = useState("");

  // Oturum kontrolünü tekrar başlatmak için sayaç.
  const [retryCount, setRetryCount] = useState(0);

  // Oturumun sona erdiğini belirten mesaj.
  const [sessionMessage, setSessionMessage] = useState("");

  // Kullanıcının giriş yapıp yapmadığını belirliyoruz.
  const isAuthenticated = Boolean(user);

  // Uygulama ilk açıldığında oturumu kontrol ediyoruz.
  useEffect(() => {

    let cancelled = false;

    async function checkSession() {
      try {

        const currentUser = await getCurrentUser();

        if (!cancelled) {
          setUser(currentUser);
          setError("");
        }

      } catch (error) {

        if (!cancelled) {
          setUser(null);
          setError(error.message);
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };

  }, [retryCount]);

  // Kullanıcı giriş yaptıktan sonra düzenli oturum kontrolü.
  useEffect(() => {

    // Giriş yapılmamışsa kontrol başlatmıyoruz.
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;
    let checking = false;

    async function validateSession() {

      // Aynı anda birden fazla kontrol yapılmasını engelliyoruz.
      if (cancelled || checking) {
        return;
      }

      checking = true;

      try {

        // Backend üzerinden JWT oturumunu kontrol ediyoruz.
        const currentUser = await getCurrentUser();

        if (cancelled) {
          return;
        }

        // Oturum geçersizse giriş ekranına dönüyoruz.
        if (!currentUser) {

          setUser(null);

          setSessionMessage(
            "Oturumunuz sona erdi. Lütfen tekrar giriş yapınız."
          );

        } else {

          // Kullanıcı bilgilerini güncelliyoruz.
          setUser(currentUser);

        }

      } catch (error) {

        // Bağlantı hatasında oturumun geçersiz olduğunu varsaymıyoruz.
        if (!cancelled) {
          setUser(null);
          setError(error.message);
        }

      } finally {

        checking = false;

      }
    }

    // Her 30 saniyede bir oturum kontrolü yapıyoruz.
    const intervalId = setInterval(validateSession, 30000);

    // Kullanıcı sekmeye geri döndüğünde de oturumu kontrol ediyoruz.
    function handleVisibilityChange() {

      if (document.visibilityState === "visible") {
        validateSession();
      }

    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    // Oturum kapandığında zamanlayıcıyı temizliyoruz.
    return () => {

      cancelled = true;

      clearInterval(intervalId);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

    };

  }, [isAuthenticated]);

  // Başarılı giriş sonrasında oturumu doğruluyoruz.
  async function handleLogin() {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error(
        "Oturum oluşturulamadı. Lütfen tekrar giriş yapınız."
      );
    }

    setUser(currentUser);
    setError("");
    setSessionMessage("");

  }

  // Kullanıcının çıkış yapmasını sağlıyoruz.
  async function handleLogout() {

    await logoutUser();

    setUser(null);
    setError("");
    setSessionMessage("");

  }

  // Bağlantı hatasında tekrar deneme fonksiyonu.
  function handleRetry() {

    setError("");
    setLoading(true);

    setRetryCount((previousCount) => previousCount + 1);

  }

  // Oturum kontrolü sırasında gösterilecek ekran.
  if (loading) {
    return (
      <main className="app-status-page">
        <section className="app-status-card" role="status">

          <div className="loading-spinner"></div>

          <h2>Oturum kontrol ediliyor...</h2>

          <p>Lütfen bekleyiniz.</p>

        </section>
      </main>
    );
  }

  // Bağlantı hatası ekranı.
  if (error) {
    return (
      <main className="app-status-page">
        <section className="app-status-card">

          <h2>Bağlantı Hatası</h2>

          <p role="alert">{error}</p>

          <button
            type="button"
            className="retry-button"
            onClick={handleRetry}
          >
            Tekrar Dene
          </button>

        </section>
      </main>
    );
  }

  // Geçerli oturum varsa kullanıcı panelini gösteriyoruz.
  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Geçerli oturum yoksa giriş ekranını gösteriyoruz.
  return (
    <>
      {sessionMessage && (
        <div className="session-message" role="alert">
          {sessionMessage}
        </div>
      )}

      <Login onLogin={handleLogin} />
    </>
  );
}

export default App;