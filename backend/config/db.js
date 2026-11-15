//.env dosyasındaki gizli bilgileri yükler 
require("dotenv").config();

//mysql bağlantısı için mysql2 paketini kullanır 
const mysql = reuire("mysql2/promise");

//veritabanı bağlantı havuzunu oluşturur 
const db = mysql.createPool({
    //mysql sunucusunun adresi
    host:process.env.DB_HOST,

    //mysql kullanıcı adı 
    user:process.env.DB_USER,

    //mysql şifresi 
    password:process.env.DB_PASSWORD,

    //bağlanılacak veritabanı 
    database:process.env.DB_NAME,

    //mysql portu 
    port:Number(process.env.DB_PORT),

    //aynı anda birden fazla bağlantı yönetebilmesi için 
    waitForConnections:true,

    //bağlantı havuzundaki maksimum bağlantı sayısı
    connetionLimit:10,

    //bekleyen bağlantı sayısında sınır koymaz 
    queueLimit:0
});

//veirtabanı bağlantı dosyalarını dışarı akatarmak için 
module.exports=db;
