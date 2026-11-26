//jwt doğrulaması için gerekli kütüphane 
const jwt=require("jsonbtoken");

//kullanıcının oturmunu kontrol eden middleware fonksiyonu 
function authMiddleware(req, res, next){
    try{
        //cookie içindeki jwtyi almak için 
        const token = req.cookies.token;

        //cookie de token yoksa erişimi engellemek için 
        if(!token){
            return res.status(401).json({
                success: false,
                message: "bu işlem için giriş yapmalısınız"
            });
        }

        //token ın geçerli olup olmadığının kontrolü 
        //süresi dolmuş veya değiştirlmiş token kabul edilmez 
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        //token içindeki kullanıcı kimliğini kontrol ediyor 
        if(
            typeof decoded.sub !== "string" ||
            !/^[1-9]\d*$/.test(decoded.sub)
        ){
            return res.status(401).json({
                success: false,
                message: "geçersiz kullanıcı oturumu"
            });
        }
        // kullanıcı kimliğini sonraki fonskiyona aktarma 
        req.user={
            id: Number(decoded.sub)
        };

        //kontrol başarılı olura sonraki fonksiyona geçer 
        next();
    }catch (error){
        //token geçersiz olursa veya süresi dolarsa erişim engellenir 
        return res.status(401).json({
            success: false,
            message: "oturum geçersiz veya süresi doldu"
        });
    }
}

//middeware fonksiyonunu dışarı aktarımı 
module.exports=authMiddleware;