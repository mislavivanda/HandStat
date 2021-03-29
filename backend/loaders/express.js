var {graphqlHTTP}=require('express-graphql');//npm paket koji omogućava implmeentaciju graphql arhitekure API-a u zadani express server
// graphqlnpm paket koji omogućava korištenje graphql funkcija i tipova(sheme,mutacije,query,...)
const schema=require('../graphql/schema');
var cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:3000'
}
module.exports=(app,httplogger)=>{//U OVOJ FUNKCIJI LOADAMO SVE ŠTO JE POTREBNO ZA NAŠ EXPRESS SERVER
    app.use(httplogger);
    app.use(cors(corsOptions));
    //konstrukcija graphql sheme-> koje tipove querya,mutacija i subscriptionsa ćemo imati na glavnom /graphql endpointu i koje tipove će vraćati
   
    //KAKO ENDPOINT APLIKACIJE U GRAPHQL SERVERU NIJE ODREDEN S HTTP METODOM I URI-EM(JER SVI IMAJU ISTI URI ENDPOINT /GRAPHQL)
    //ONDA EXPRESS GRAPHQL ZA SVE ZAHTIJEVE KORISTI HTTP POST REQUEST JER JE ON MANJE RESTRIKTIVNA OD GET REQUESTA(NPR KOD SLANJA PODATAKA MOŽE SE DOGIDITI 
    //DA JE U GET REQ URI PREDUG) IAKO SAM GRAPHQL SERVER PRIHVAĆA I GET I POST ZAHTIJEVE

    //GRAPHQL SERVER PARSIRA POZIVE QUERYA,MUTACIJA U JSON OBJEKTE S PARAMETRIMA-> NA TAJ NAČIN GRAPHQL SERVER ZNA ŠTO TREBA RADITI I KAKO VRATIT RESPONSE:
    //ZA REQUESTOVE: {"query":{"hello"},"variables":}
    //ZA RESPONSE: {"data":{"hello":"Hello world!"}}}-> NA OVAJ NAČIN ĆE NPR APPOLO LIBRARY LAKO MOĆ ODRŽAVATI CACHE I GLEDAT KOJI SU SE DJELOVI PROMIJENILI A KOJI NE
    //stavimo maksimalnu velicinu slike=1MB
    app.use('/graphql',graphqlHTTP({
       schema,
       graphiql:true,
       customFormatErrorFn:(err) => ({ message: err.message, status: (err.status || 500) })//error handleanje kada throwamo error unutar resolvera
    }));
    
}