// .env dosyasındaki ayarları yükler 
require("dotenv").config();

//express pakeitini projeye dahil etmek için 
const express = require("express");

//cookie bilgilerini okuyabilmek için 
const cookieParser = require("cookie-parser");

//farklı portlarda çalışan frontendin backende erişebilemsi için 
const cors = require("cors");

//mysql bağlanstısını içeriye aktarmak için 
const db = require("./config/db");

//express uyuglamasını oluşturmak için 
const app = express();

// .env içerisindeki port numarasını almak için 
const PORT = process.env.PORT || 5000;

//json formatında olan istekleri okuyabilmesi için 
app.use(express.json());

//gelen cookie bilgilerini okuması için 
app.use(cookieParser());

//frontend ile backend arasındaki iletişime izin vermek için 
app.use(cors({
    //react geliştirme sunucusunun adresi
    origin:"http://localhost:5173",

    //cookie gönderilmesine izin vermek için 
    credentials:true
}));

//bakend kontrol endpointi 
app.get("/api/health", (req, res) => {
    // sunucunun çalıştığını bildiren yanıt 
    res.status(200).json({
        success:true,
        message:"backend sunucusu çalışıyor"
    });
});

//mysql bağlansıtısını kontrol etmek için 
async function startServer(){
    try {
        // MySQL bağlantı havuzundan bir bağlantı alır
        const connection = await db.getConnection();

        console.log("mysql bağlantısı başarılı");

        // Bağlantıyı havuza geri bırakır
        connection.release();

        // Backend sunucusunu başlatır
        app.listen(PORT, () => {
            console.log(`backend sunucusu http://localhost:${PORT} adresinde çalışıyor.`);
        });

    } catch (error) {
        console.error("mysql bağlantısı başarısız:", error.message);

        process.exit(1);
    }
}
console.log("DB HOST:", process.env.DB_HOST);
console.log("DB USER:", process.env.DB_USER);
console.log("DB NAME:", process.env.DB_NAME);
console.log("DB PASSWORD LENGTH:", process.env.DB_PASSWORD?.length);
//sunucuyu başlatır 
startServer();
