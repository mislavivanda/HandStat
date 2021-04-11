//env varijable su već učitane u globalni process.env objekt preko dotenv poziva u config.js fileu
//OVJDE UČITAVAMO SVE ENV VARIJABLE KOJE KORISTIMO U PROGRAMU I PRISTUPAMO IM PREKO OVOG EXPORTANOG OBJEKTA GDJE ZATREBA A NE DIREKTNO PREKO process.env objekta
module.exports={
    port:process.env.PORT,
    database_url:process.env.DATABASE_URL,
    express_session:{
        secret:process.env.SECRET
    },
    bcrypt:{
        salt_rounds:parseInt(process.env.SALT_ROUNDS)
    }
}