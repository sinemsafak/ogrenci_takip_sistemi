// React'in durum yönetimi ve yan etki özelliklerini içeri aktarıyoruz.
import { useState, useEffect } from "react";

// Uygulama sayfalarını içeri aktarıyoruz.
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Kimlik doğrulama fonksiyonlarını içeri aktarıyoruz.
import {
  getCurrentUser,
  logoutUser
} from "./services/authService";

// Uygulamanın genel durum ekranlarına ait CSS dosyası.
import "./App.css";

// Ana uygulama bileşenimiz.
function App() {

  // Giriş yapan kullanıcının bilgilerini tutuyoruz.
  const [user, setUser] = useState(null);

  // İlk oturum kontrolünün devam edip etmediğini tutuyoruz.
  const [loading, setLoading] = useState(true);

  // Oturum kontrolünde oluşan hataları tutuyoruz.
  const [error, setError] = useState("");

  // Oturum kontrolünü tekrar çalıştırmak için sayaç kullanıyoruz.
  const [retryCount, setRetryCount] = useState(0);

  // Uygulama açıldığında oturumu kontrol ediyoruz.
  useEffect(() => {

    // Bileşen kaldırılırsa eski isteğin sonucu uygulanmasın.
    let cancelled = false;

    async function checkSession() {

      try {

        // Backend'e mevcut oturumumuzu soruyoruz.
        const currentUser = await getCurrentUser();

        // Bileşen hâlâ aktifse kullanıcı bilgisini güncelliyoruz.
        if (!cancelled) {
          setUser(currentUser);
          setError("");
        }

      } catch (error) {

        // Sunucu bağlantı hatasını kaydediyoruz.
        if (!cancelled) {
          setUser(null);
          setError(error.message);
        }

      } finally {

        // Oturum kontrolünün tamamlandığını belirtiyoruz.
        if (!cancelled) {
          setLoading(false);
        }

      }
    }

    // Oturum kontrolünü başlatıyoruz.
    checkSession();

    // Bileşen kaldırıldığında eski isteğin sonucunu yok sayıyoruz.
    return () => {
      cancelled = true;
    };

  }, [retryCount]);

  // Giriş başarılı olduktan sonra çalışan fonksiyon.
  async function handleLogin() {

    // Cookie'nin backend tarafından doğrulanabildiğini kontrol ediyoruz.
    const currentUser = await getCurrentUser();

    // Geçerli oturum oluşmadıysa hata gösteriyoruz.
    if (!currentUser) {
      throw new Error(
        "Oturum oluşturulamadı. Lütfen tekrar giriş yapınız."
      );
    }

    // Kullanıcı bilgilerini React state içerisinde saklıyoruz.
    setUser(currentUser);
    setError("");
  }

  // Kullanıcı çıkış yaptığında çalışan fonksiyon.
  async function handleLogout() {

    // Backend'e çıkış isteği gönderiyoruz.
    await logoutUser();

    // Backend çıkışı onayladıktan sonra kullanıcı bilgisini temizliyoruz.
    setUser(null);
    setError("");
  }

  // Başarısız oturum kontrolünü tekrar deniyoruz.
  function handleRetry() {

    setError("");
    setLoading(true);

    // Sayaç değişince useEffect tekrar çalışacak.
    setRetryCount((previousCount) => previousCount + 1);
  }

  // Oturum kontrolü devam ediyorsa yükleniyor ekranını gösteriyoruz.
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

  // Sunucu bağlantısında hata varsa hata ekranını gösteriyoruz.
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

  // Kullanıcı oturum açmışsa Dashboard sayfasını gösteriyoruz.
  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Geçerli oturum yoksa giriş ekranını gösteriyoruz.
  return <Login onLogin={handleLogin} />;
}

// Ana uygulama bileşenini dışarı aktarıyoruz.
export default App;