var {graphqlHTTP}=require('express-graphql');//npm paket koji omogućava implmeentaciju graphql arhitekure API-a u zadani express server
var {buildSchema}=require('graphql');//npm paket koji omogućava korištenje graphql funkcija i tipova(sheme,mutacije,query,...)
module.exports=(app,httplogger)=>{//U OVOJ FUNKCIJI LOADAMO SVE ŠTO JE POTREBNO ZA NAŠ EXPRESS SERVER
    app.use(httplogger);
    //konstrukcija graphql sheme-> koje tipove querya,mutacija i subscriptionsa ćemo imati na glavnom /graphql endpointu i koje tipove će vraćati
    var schema = buildSchema(`
        type Query {
                hello: String
        }
    `);
    //u rootu se nalaze resolver funkcije za svaki endpoint u shemi
    var root = {
        hello: () => {
          return 'Hello world!';
        },
      };
    //KAKO ENDPOINT APLIKACIJE U GRAPHQL SERVERU NIJE ODREDEN S HTTP METODOM I URI-EM(JER SVI IMAJU ISTI URI ENDPOINT /GRAPHQL)
    //ONDA EXPRESS GRAPHQL ZA SVE ZAHTIJEVE KORISTI HTTP POST REQUEST JER JE ON MANJE RESTRIKTIVNA OD GET REQUESTA(NPR KOD SLANJA PODATAKA MOŽE SE DOGIDITI 
    //DA JE U GET REQ URI PREDUG) IAKO SAM GRAPHQL SERVER PRIHVAĆA I GET I POST ZAHTIJEVE

    //GRAPHQL SERVER PARSIRA POZIVE QUERYA,MUTACIJA U JSON OBJEKTE S PARAMETRIMA-> NA TAJ NAČIN GRAPHQL SERVER ZNA ŠTO TREBA RADITI I KAKO VRATIT RESPONSE:
    //ZA REQUESTOVE: {"query":{"hello"},"variables":}
    //ZA RESPONSE: {"data":{"hello":"Hello world!"}}}-> NA OVAJ NAČIN ĆE NPR APPOLO LIBRARY LAKO MOĆ ODRŽAVATI CACHE I GLEDAT KOJI SU SE DJELOVI PROMIJENILI A KOJI NE
    app.use('/graphql', graphqlHTTP({
        schema: schema,//definirana shema
        rootValue: root,//resolveri
        graphiql: true,//koristenje graphiql client sucelja za testiranje API-a
    }));
    app.use((err, req, res, next) => {//midleware error handler-> ima 4 argumenta-> bit ce zadnja u midleware stacku i pozivom nexta u slucaju errora ce greska sigurno doci do nje i biti handleana i dobit cemo resposne
        res.status(err.status || 500);//STATUS ZA SVE GRESKE NA STRANIC SERVERA CE BITI 500-> PRESUMJERIMO SVE GRESKE NA OVAJ ERROR HANDLER MIDDLEWARE POZIVOM next(error)
        res.json({
          error: {
            message: err.message,
          },
        });
      });
}