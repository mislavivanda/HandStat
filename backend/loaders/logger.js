const winston=require('winston');
const morgan=require('morgan');
winston.loggers.add("winston",{//ovaj winston i morgan su cacheani pa ih mozemo requira u bilo kojen drugom fileu i korsitit ih s ovim postavkama
    level:'debug',//iznad kojeg levela cemo ispisivati poruke-> debug je posljednjilevel
    levels: winston.config.npm.levels,//po defaultu
    format: winston.format.combine(
        winston.format.cli(),//komanda linija
        winston.format.timestamp()
    ),
    transports: [
        new winston.transports.Console({
            level:'debug',//pretposljednji level
            format: winston.format.combine(
                winston.format.cli(),//komanda linija
                winston.format.timestamp()),
         }) 
    ]
});
const logger=winston.loggers.get('winston');
const http=morgan('dev',{   //format ispisa
    stream: {
    write(msg){
        logger.info(msg.substr(0,msg.lastIndexOf('\n')));//trazimo zadnji /n koji je dodan da izbjegnemo prazni red kod stvarnog ispisa-> substr uzme prvi član sve do indeksa zadnje pojave \n -> njega ne uzme i ne dobijemo prazni red
        /* inace bi dobili ovakav ispis
        info: GET / 302 17.303 ms - 68-> ovaj broj oznacava Content-length,broj nakon rute=status
    
        info: GET /login 304 4.429 ms - -
    
        info: GET /ok 304 2.691 ms - -*/
    }
}
})
module.exports={
    httplogger:http,
    nodelogger:logger
}