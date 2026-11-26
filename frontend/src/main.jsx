// React'in geliştirme kontrollerini içeri aktarıyoruz.
import { StrictMode } from "react";

// React uygulamasını HTML içerisine yerleştirmek için kullanıyoruz.
import { createRoot } from "react-dom/client";

// Genel CSS dosyamızı içeri aktarıyoruz.
import "./index.css";

// Ana uygulama bileşenimizi içeri aktarıyoruz.
import App from "./App.jsx";

// React uygulamasını index.html içerisindeki root alanına yerleştiriyoruz.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);