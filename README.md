# Öğrenci Bilgi Sistemi

React, Node.js, Express ve MySQL teknolojileri kullanılarak geliştirilen, JWT ve HttpOnly Cookie tabanlı kimlik doğrulama sistemine sahip bir öğrenci bilgi sistemi uygulamasıdır.

## Projenin Amacı

Bu projenin amacı, modern web teknolojilerini kullanarak frontend, backend ve veritabanı katmanlarından oluşan bir full-stack uygulama geliştirmektir.

Projenin ilk sürümü kullanıcı girişi, kimlik doğrulama, oturum yönetimi ve korumalı kullanıcı paneli özelliklerine odaklanmaktadır.

## Özellikler

- Kullanıcı giriş ekranı
- E-posta ve şifre doğrulama
- Bcrypt ile şifre hashleme
- JWT tabanlı kimlik doğrulama
- HttpOnly Cookie ile oturum yönetimi
- Korumalı kullanıcı paneli
- Sayfa yenilendiğinde oturum kontrolü
- Otomatik oturum süre aşımı kontrolü
- Kullanıcı çıkış işlemleri
- Sunucu bağlantı hatalarının yönetimi
- Mobil uyumlu arayüz

## Kullanılan Teknolojiler

| Katman | Teknolojiler |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Veritabanı | MySQL |
| Kimlik doğrulama | JSON Web Token (JWT) |
| Şifre güvenliği | Bcrypt |
| Oturum yönetimi | HttpOnly Cookie |
| API iletişimi | Fetch API |
| Versiyon kontrolü | Git ve GitHub |

## Proje Mimarisi

Uygulama üç temel katmandan oluşmaktadır:

1. Frontend: Kullanıcı arayüzü ve oturum durumunun yönetimi.
2. Backend: REST API, kimlik doğrulama ve iş mantığı.
3. Veritabanı: Kullanıcı bilgilerinin saklanması.

Frontend ve backend arasındaki iletişim HTTP istekleri ve JSON veri formatı üzerinden gerçekleştirilmektedir.

## Proje Klasör Yapısı

```
ogrenci_takip_sistemi/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── scripts/
│   │   └── createTestUser.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── database.sql
├── .gitignore
└── README.md
```

## Kurulum

### 1. Gereksinimler

- Node.js (Vite ile uyumlu güncel sürüm)
- npm
- MySQL Server
- Git
- Visual Studio Code (isteğe bağlı)

### 2. Veritabanı kurulumu

MySQL Workbench üzerinden `database.sql` dosyasını çalıştırın.

Bu işlem `ogrenci_bilgi_sistemi` veritabanını ve `users` tablosunu oluşturacaktır.

### 3. Backend kurulumu

```
cd backend
npm ci
```

`.env.example` dosyasından `.env` dosyası oluşturun.

Ortam değişkenlerini kendi MySQL bağlantı bilgilerinize göre düzenleyin:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ogrenci_bilgi_sistemi
DB_PORT=3306
JWT_SECRET=
JWT_EXPIRES_IN=1h
COOKIE_SECURE=false
```

Güvenli bir JWT anahtarı oluşturmak için:

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Oluşturulan anahtarı `JWT_SECRET` değişkenine ekleyin.

### 4. Test kullanıcısı oluşturma

Windows PowerShell üzerinde backend klasöründeyken:

```
$securePassword = Read-Host "Test sifresi" -AsSecureString
$env:TEST_USER_PASSWORD = [System.Net.NetworkCredential]::new("", $securePassword).Password
node scripts/createTestUser.js
Remove-Item Env:TEST_USER_PASSWORD
Remove-Variable securePassword
```

Test kullanıcısının e-posta adresi:

`test@example.com`

Şifre, kullanıcı oluşturulurken belirlenir ve veritabanında hashlenmiş olarak saklanır.

### 5. Backend sunucusunu çalıştırma

```
npm start
```

Backend adresi: http://localhost:5000

### 6. Frontend kurulumu

Ana proje klasöründen yeni bir terminal açın.

```
cd frontend
npm ci
npm run dev -- --port 5173 --strictPort
```

Frontend adresi: http://localhost:5173

Uygulamanın çalışması için MySQL, backend ve frontend sunucuları açık olmalıdır.

## API Dokümantasyonu

| HTTP Metodu | Endpoint | Açıklama | Oturum gerekli |
|---|---|---|---|
| GET | /api/health | Sunucu durum kontrolü | Hayır |
| POST | /api/auth/login | Kullanıcı girişi | Hayır |
| GET | /api/auth/me | Kullanıcı oturum kontrolü | Evet |
| POST | /api/auth/logout | Kullanıcı çıkışı | Hayır |

### Kullanıcı girişi

`POST /api/auth/login`

İstek gövdesi:

```
{
  "email": "test@example.com",
  "password": "TEST_SIFRENIZ"
}
```

Başarılı girişte sunucu JWT oluşturur ve HttpOnly Cookie olarak tarayıcıya gönderir.

### Oturum kontrolü

`GET /api/auth/me`

Geçerli oturum bulunduğunda kullanıcı ID, kullanıcı adı ve e-posta bilgileri döndürülür.

Geçersiz veya eksik oturum durumunda HTTP 401 cevabı döndürülür.

### Kullanıcı çıkışı

`POST /api/auth/logout`

Tarayıcıdaki kimlik doğrulama cookie'sini temizler.

## Veritabanı Yapısı

### users tablosu

| Alan | Veri tipi | Açıklama |
|---|---|---|
| id | INT | Birincil anahtar, otomatik artan |
| username | VARCHAR(50) | Kullanıcı adı |
| email | VARCHAR(255) | Benzersiz e-posta adresi |
| password | VARCHAR(255) | Hashlenmiş kullanıcı şifresi |

## Güvenlik

- Kullanıcı şifreleri açık metin olarak saklanmaz.
- Şifreler Bcrypt ile hashlenir.
- JWT, HttpOnly Cookie içerisinde saklanır.
- JWT, Local Storage veya Session Storage içerisinde saklanmaz.
- SQL sorgularında parametreli sorgu yöntemi kullanılır.
- Korumalı API istekleri JWT middleware ile doğrulanır.
- Gizli ortam değişkenleri GitHub deposuna gönderilmez.
- JWT geçerlilik süresi varsayılan olarak bir saattir.
- Kullanıcı oturumu belirli aralıklarla kontrol edilir.

## Kod Kontrolü ve Derleme

Frontend klasöründe:

```
npm run lint
npm run build
```

Bağımlılıkların güvenlik kontrolü için frontend ve backend klasörlerinde:

```
npm audit
```

## Mevcut Sürümün Sınırları

Bu sürüm eğitim ve yerel geliştirme amaçlıdır.

Üretim ortamında HTTPS, Secure Cookie, giriş denemesi sınırlandırması, ek CSRF koruması ve gerektiğinde sunucu taraflı JWT iptal mekanizması uygulanmalıdır.

Mevcut çıkış işlemi tarayıcıdaki cookie'yi siler; daha önce kopyalanmış bir JWT'yi sunucu tarafında iptal etmez.

## Gelecekte Eklenebilecek Özellikler

- Öğrenci kayıt ve yönetim sistemi
- Yönetici paneli
- Rol tabanlı yetkilendirme
- Öğretmen paneli
- Ders yönetimi
- Not yönetimi
- Devamsızlık takibi
- Şifre değiştirme ve sıfırlama
- Gelişmiş güvenlik önlemleri

## Sürüm

v1.0.0 — Temel kimlik doğrulama ve kullanıcı oturum yönetimi.