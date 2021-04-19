var {graphqlHTTP}=require('express-graphql');//npm paket koji omogućava implmeentaciju graphql arhitekure API-a u zadani express server
// graphqlnpm paket koji omogućava korištenje graphql funkcija i tipova(sheme,mutacije,query,...)
const config=require('../config');
const express=require('express');
const session=require('express-session');
const session_store=require('./session_store');
const schema=require('../graphql/schema');
const { graphqlUploadExpress }=require('graphql-upload');
const {createServer}=require('http');//node.js paket za kreiranje servera, kao parametar prima funkciju koja će odgovoarat na zahtjeve-> u našem slučaju to će biti sami app
const { SubscriptionServer }=require('subscriptions-transport-ws');//kreiranje subscriptions servera koji će slušati zahtjeve od web socket linka na apollo clientu
const { execute, subscribe }=require('graphql');//za kreiranje subscription servera
var cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true };//Always send user credentials (cookies, basic http auth, etc..), even for cross-origin calls.
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
    app.use(session({
      saveUninitialized:false,
      resave:false,
      key:'user_sid',
      secret:config.express_session.secret,
      store: session_store,
      cookie:{
       path: '/',httpOnly: true,domain:'localhost',sameSite:'lax', secure:false, maxAge: 1000*60*60 //1 sat trajanje
       //secure za produkciju samo
      }
    }))
    app.use(express.static('images'));//ime direktorija iz kojeg servamo fileove/slike-> VAŽNOOOO-> KOD REQUESTOVA SA FRONTENDA U URL NE STAVLJAMO /images jer express racuna path relativno u donosu na onaj koji mu stavimo u .static
//graphql http je obicni middleware za postavljanje postavki graphql sheme na serveru i vraća taj objekt-> im pristup req i res objektima
    app.use('/graphql',//na toj ruti ćemo koristiti ove middleware u nastavku
    graphqlUploadExpress({ maxFileSize:config.images. maxImageFileSize}),//middleware za parisranje fileova u multipart byte request bodyima
    graphqlHTTP((req,res)=>({
       schema,
       graphiql:true,
       customFormatErrorFn:(err) => ({ message: err.message, status: (err.status || 500) }),//error handleanje kada throwamo error unutar resolvera
       context:{req,res}/*A value to pass as the context to the graphql() function 
       from GraphQL.js/src/execute.js. If context is not provided, the request object is passed as the context.
       > ONO ŠTO OVJDE STAVIMO CE PREDSTAVLJATI KONTEKST ODNOSNO TO ĆE BITI 3. PARAEMTAR U SVIM GRAPHQL RESOOLVERIMA I NA TAJ NAČIN ĆEMO MOĆ PRISTUPAT CONTEXT VARIJABAMA U SVIM RESOLVERIMA,
       -> NPR TREBA NAM PRISTUP REQ.SESSION OBJEKTU ZA SESSION COOKIESE*/
    })));

    const server=createServer(app);//napravimo server sa postojećim app koji predstavlja middleware funkcije za slusanje zahtjeva
    //na taj server nadogradimo i subscriptions server za subscriptionse kao middleware
    server.listen(config.port,() => {
        new SubscriptionServer(
        {//opcije servera
          execute,//graphql funkcija koja se kontrolira resolvanje i fullfill/rejection od querya i mutacija
          subscribe,//ista stvar kao execute samo za mutacije
          schema: schema,//graphql shema
        },
        {//opcije soketa
          server: server,//existing HTTP server to use-> zato smo i pretovrili gornji app u server-> na njega idu zahtjevi sa http linka
          path: '/subscriptions',//uri  na kojem sluša ovaj server odnosno na kojem je web socket konekcija-> ws://localhost:port/subscriptions-> tu nam treba slat klijent subscriptions zahtjeve a mi njemu odgovore
        });
    });
    
}