// Backend kimlik doğrulama API adresini tanımlıyoruz.
const API_URL = "http://localhost:5000/api/auth";

// Kullanıcı giriş isteğini backend'e gönderen fonksiyon.
export async function loginUser(email, password) {
  let response;

  try {
    // Fetch API ile backend'e POST isteği gönderiyoruz.
    response = await fetch(`${API_URL}/login`, {
      method: "POST",

      // Gönderdiğimiz verinin JSON olduğunu belirtiyoruz.
      headers: {
        "Content-Type": "application/json"
      },

      // Tarayıcının cookie almasına ve göndermesine izin veriyoruz.
      credentials: "include",

      // E-posta ve şifreyi JSON formatına dönüştürüyoruz.
      body: JSON.stringify({
        email,
        password
      })
    });

  } catch {
    // Backend sunucusuna ulaşılamazsa hata oluşturuyoruz.
    throw new Error(
      "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyiniz."
    );
  }

  // Backend'den gelen JSON cevabını okuyoruz.
  const data = await response.json().catch(() => null);

  // Backend hata döndürdüyse hata mesajını iletiyoruz.
  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message || "Giriş işlemi başarısız oldu."
    );
  }

  // Giriş başarılıysa backend'den gelen bilgileri döndürüyoruz.
  return data;
}