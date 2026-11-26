// Uygulamaya ait CSS dosyasını içeri aktarıyoruz.
import "./App.css";

// Uygulamamızın ana React bileşeni.
function App() {
  return (
    <main className="app-container">
      <div className="welcome-card">
        <h1>Öğrenci Bilgi Sistemi</h1>

        <p>
          Öğrenci Bilgi Sistemi uygulamasına hoş geldiniz.
        </p>

        <span className="status">
          Frontend başarıyla çalışıyor.
        </span>
      </div>
    </main>
  );
}

// App bileşenini diğer dosyalarda kullanabilmek için dışarı aktarıyoruz.
export default App;