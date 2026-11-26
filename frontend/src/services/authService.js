// Backend kimlik doğrulama API adresi.
const API_URL = "http://localhost:5000/api/auth";

// Bütün kimlik doğrulama isteklerinde kullanacağımız ortak fonksiyon.
async function authRequest(endpoint, options = {}) {
  let response;

  try {
    // Backend'e HTTP isteği gönderiyoruz.
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,

      // Tarayıcının cookie göndermesine ve almasına izin veriyoruz.
      credentials: "include",

      // Oturum bilgilerinin önbellekten okunmasını engelliyoruz.
      cache: "no-store"
    });

  } catch {
    // Backend sunucusuna ulaşılamadığında hata oluşturuyoruz.
    throw new Error(
      "Sunucuya bağlanılamadı. Lütfen tekrar deneyiniz."
    );
  }

  // Backend'den gelen JSON cevabını okuyoruz.
  const data = await response.json().catch(() => null);

  // HTTP isteği başarısız olduysa hata oluşturuyoruz.
  if (!response.ok || !data?.success) {
    const error = new Error(
      data?.message || "İşlem başarısız oldu."
    );

    // HTTP durum kodunu hata nesnesine ekliyoruz.
    error.status = response.status;

    throw error;
  }

  return data;
}

// Kullanıcı giriş fonksiyonu.
export async function loginUser(email, password) {
  return authRequest("/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      email,
      password
    })
  });
}

// Kullanıcının mevcut oturumunu kontrol eden fonksiyon.
export async function getCurrentUser() {
  try {
    const data = await authRequest("/me", {
      method: "GET"
    });

    // Backend'den gelen kullanıcı bilgilerini döndürüyoruz.
    return data.user;

  } catch (error) {

    // 401 hatası kullanıcının geçerli oturumu olmadığını gösterir.
    if (error.status === 401) {
      return null;
    }

    // Diğer hataları uygulamaya iletiyoruz.
    throw error;
  }
}

// Kullanıcının oturumunu kapatan fonksiyon.
export async function logoutUser() {
  return authRequest("/logout", {
    method: "POST"
  });
}