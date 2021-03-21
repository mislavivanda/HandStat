//env varijable su već učitane u globalni process.env objekt preko dotenv poziva u config.js fileu
//OVJDE UČITAVAMO SVE ENV VARIJABLE KOJE KORISTIMO U PROGRAMU I PRISTUPAMO IM PREKO OVOG EXPORTANOG OBJEKTA GDJE ZATREBA A NE DIREKTNO PREKO process.env objekta
module.exports={
    port:process.env.PORT
}