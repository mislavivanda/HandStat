const { Op } = require("sequelize");
const bcrypt=require('bcrypt');
const {nodelogger}=require('../loaders/logger.js');
const graphql=require('graphql');
const config=require('../config');
const { PubSub, withFilter }=require('graphql-subscriptions');//za rukovanje sa subscriptionsima-> pomoću njega publishamo subscription eventove i definiramo resolvere u subscriptionsima
/*PubSub is a class that exposes a simple publish and subscribe API.-> takav obrazac

It sits between your application's logic and the GraphQL subscriptions engine 
- it receives a publish command from your app logic and pushes it to your GraphQL execution engine.-> sa publishom zapravo pushamo podatke koje mu damo u graphQL 
subscriptions engine (o kojem brine subscribe funkcija koju smo proslijedili subscriptionsserveru)-> dodatno sučelje između pubsub publish podataka i enginea je ASYNCITERABLE KOJU STAVLJAMO U SUBSCRIPTIONS RESOLVERIMA-> ona dobija pubsub.publish podatke ako 
je pretplaćena na publishani događaj i onda ih prosljeđuje subcribe execution engineu koji se brine za transport i ostatak
publish subscribe arhitektura-> publish-> obavijestimo komponente koje slušaju, subscribe-> pretplatimo se na odredene dogadaje
-> subscribe metoda i async iterable prolsjeduju podakte koje prime od .publish metode u graphql subscription engine koji se brine o transportu tih podataka i ostalim stvarima*/
const pubsub=new PubSub();

const {createWriteStream}=require('fs');//kod spremanja fileova
const models=require('../models');//u njemu se nalaze svi loadani modeli bitni za resolvere
const {GraphQLObjectType,//OUTPUT I INPUT MOGU BITI
  //INPUT TIPOVI DEFINIRAJU KAKVOG FORMATA TREBAJU BITI DOBIVENI ARGUMENTI U MUTACIJI,!!!!!NJIH NE STAVLJAMO NA MJESTA KOJA DEFINIRAJU OTPUT TIP QEURYA I MUTACIJA ODNOSNO KAKAV FORMAT VRAĆAJU QUERYI I MUTACIJE
  //NEGO IH SAMO MOŽEMO STAVLJATI ZA DEEFINICIJU TIPOVA ARGUMENATA, OMOGUĆUJU NAM DA U SLUČAJEVIMA DA IMAMO VIŠE QUERYA/MUTACIJA KOJE PRIHVAĆAJU NEKE ISTE PARAMETRE DA TE KRITERIJE DEFINIRAMO U 
  // OVOM 1 INPUT TIPU I DA ONDA NJEGA KORISTIMO ZA DEFINICIJU INPUT SHEME KOJE PARAMETRI THI QUERYA/MUTACIJA MORJAU ZADOVOLJIT
  GraphQLInputObjectType,//koristi se za definiciju input tipova-> definicija tipa input objekta u mutaciji npr,nema resolvera, a obicni objecttype se koristit za definiciju ostalih tipova
        GraphQLInt,
        GraphQLScalarType,
        GraphQLString,
        GraphQLNonNull,
        GraphQLFloat,
        GraphQLSchema,
        GraphQLList,
        GraphQLBoolean,
        Kind}=graphql;//KIND SADRŽI SVE TIPOVE VARIJABLI AKO JE POTREBNO U RESOLVERIMA PROVJERAVAT JELI PRIMLJENA VARIJALBA ISPRAVNOG TIPA
  const { GraphQLUpload } = require('graphql-upload');//OVO JE TIP KOJI NAM OMOGUĆAVA RUKOVANJE S FILEOVIMA,SVUGDJE DI KORISTIMO FILEOVE KAO INPUT TIP STAVIMO OVAJ SCALAR ZA TIP U GRAPHQL SHEMI MUTACIJA/QUERYA
const { Console } = require("console");

//Definicija našeg vlastitog skalarnog tipa,datum nije defaultni skalarni tip
const Datum = new GraphQLScalarType({
name: 'Datum',
description: 'Format datuma u bazi 1984-10-08 15:05:22+01 pretvaramo u JS date u oba smjera',
serialize(value){//format datuma koji će ići u response,priprema format za slanje klijentu
  let date=new Date(Date.parse(value));
  let date_format=date.getDate().toString()+'.'+(date.getMonth()+1).toString()+'.'+date.getFullYear().toString();
  return date_format;
},
parseValue(value)//i parse value i parseLiteral parsiraju DOLAZNE/INPUT PODATKE NPR U MUTACIJAMA,RAZLIKA: parseValue: parsira argumente mutacije koji su hard kodirano poslani, parseLiteral-> parsira argumente koji su poslani preko query/mutation varijabli
{
  return new Date(Date.parse(value))
}, 
//parseValue->Apollo Server calls this method when the scalar is provided by a client as a GraphQL variable for an argument
//parseLiteral->(When a scalar is provided as a hard-coded argument in the operation string, parseLiteral is called instead.)
//pimjer:
// mutation{
//spremiutakmicu(broj_utakmice:"13268955")}-> poziva se parseLiteral
//mutation($broj_utakmice:String!){
//spremiutakmicu(broj_utakmice:$broj_utakmice)-> poziva se parseValue

parseLiteral(ast){
  return new Date(Date.parse(ast.value))//potrbno parsirati string u date objekt jer će inače javit grešku
}
});
const Vrijeme=new GraphQLScalarType({
  name: 'Vrijeme',
  description: 'Unos vremena utakmice, u bazi spremljen kao datum',
  serialize(value){//format datuma koji će ići u response,priprema format za slanje klijentu
    let date=new Date(Date.parse(value));
    let date_format=date.getHours().toString()+':'+date.getMinutes().toString();
    return date_format;
  },
  parseValue(value)
  {
    return new Date(Date.parse(value))
  }, 
  parseLiteral(ast){
    return new Date(Date.parse(ast.value))
  }
});
const MoguciDogadaji=new GraphQLObjectType({
  name:'MoguciDogadaji',
  fields:()=>({     //!!!!!!Stavljamo u funkciju jer kod asocijacija između elemenata moramo vodit računa o redoslijedu definiranja tipova pa ako oba tipa imaju asocijaciju onda kojin god 
    //redoslijedom definirali objekte bit ce nedefiniran jedan od tih clanova-> zato ih stavimo u funkciju koja će se pozvat i u tom trenutku pozivanja će svi tipovi već bili učitani i definirani
    id:{type: GraphQLInt},
    naziv:{type:GraphQLString},
    tip:{type: GraphQLInt}
  })
})
const Natjecanje=new GraphQLObjectType({
  name:'Natjecanje',
  fields:()=>({
    id:{type:GraphQLInt},
    naziv:{type:GraphQLString},
    sezona:{type:GraphQLString},
  })
})
const Dvorana=new GraphQLObjectType({
  name:'Dvorana',
  fields:()=>({
  id:{type:GraphQLInt},
  dvorana:{type:GraphQLString},
  mjesto:{type:GraphQLString}
  })
})
const SluzbenaOsoba=new GraphQLObjectType({
  name:'SluzbenaOsoba',
  fields:()=>({
    maticni_broj:{type:GraphQLString},
    ime:{type:GraphQLString},
    prezime:{type:GraphQLString},
    datum_rodenja:{type:Datum},
    rola:{type:GraphQLInt},
    image_path:{type:GraphQLString}
  })

})
const Sudac=new GraphQLObjectType({
  name:'Sudac',
  fields:()=>({
    maticni_broj:{type:new GraphQLNonNull(GraphQLString)},
    ime:{type:new GraphQLNonNull(GraphQLString)},
    prezime:{type:new GraphQLNonNull(GraphQLString)},
    nacionalnost:{type:GraphQLString},
    mjesto:{type:new GraphQLNonNull(GraphQLString)},
    datum_rodenja:{type:Datum},
    broj_utakmica:{type:new GraphQLNonNull(GraphQLString)},
    prosjecna_ocjena:{type:GraphQLFloat},
    image_path:{type:GraphQLString}
  })
})
const ClanTima=new GraphQLObjectType({
  name:'ClanTima',
  fields:()=>({
      maticni_broj:{type:new GraphQLNonNull(GraphQLString)},
      ime:{type:new GraphQLNonNull(GraphQLString)},
      prezime:{type:new GraphQLNonNull(GraphQLString)},
      broj_dresa:{type:GraphQLInt},
      nacionalnost:{type:GraphQLString},
      datum_rodenja:{type:Datum},
      visina:{type:GraphQLInt},
      tezina:{type:GraphQLInt},
      rola:{type:GraphQLInt},
      image_path:{type:GraphQLString}
  })
})
const Klub=new GraphQLObjectType({
  name:'Klub',
  fields:()=>({
    id:{type:GraphQLInt},
    naziv:{type:new GraphQLNonNull(GraphQLString)},
    drzava:{type:GraphQLString},
    grad:{type:GraphQLString},
    osnutak:{type:GraphQLString},
    image_path:{type:GraphQLString}
  })
})
const Tim=new GraphQLObjectType({//svi clanovi tima određenim id-om
  name:'Svi_clanovi_tima',
  fields:()=>({
    igraci:{
      type:new GraphQLList(ClanTima),
      resolve(parent,args){
        return models.clanovitima.findAll({//!!!!!!!!GRAPQL RESOLVER MORA RETURNAT PROMISE NA KOJI ĆE SAM RESOLVER ČEKAT-> NIJE DOVOLJNO SAMO RETURNAT U .then NEGO JE POTREBNO I RETURNAT I PROMISE
          include:{
            model:models.klubclanovi,
            where:{
              klub_id:parent.id,
              do:null
            }
          },
          where:{
            rola:1
          }
        }).then((data)=>{
          let format=[];
          let temp={};
          for(let igrac of data)
          {
            temp={
              maticni_broj:igrac.maticni_broj,
              ime:igrac.ime,
              prezime:igrac.prezime,
              broj_dresa:igrac.broj_dresa
            };
            format.push(temp);
          }
          return format;
        }).catch((error) => {
          nodelogger.error('Greška u dohvaćanju igrača unutar Tim objekta '+error);
          throw(error);
      })
    }
  },
    golmani:{
      type:new GraphQLList(ClanTima),
      resolve(parent,args){
        return models.clanovitima.findAll({
          include:{
            model:models.klubclanovi,
            where:{
              klub_id:parent.id,
              do:null
            }
          },
          where:{
            rola:2
          }
        }).then((data)=>{
          let format=[];
          for(let golman of data)
          {
            let temp={
              maticni_broj:golman.maticni_broj,
              ime:golman.ime,
              prezime:golman.prezime,
              broj_dresa:golman.broj_dresa
            };
            format.push(temp);
          }
          return format;
        }).catch((error) => {
          nodelogger.error('Greška u dohvaćanju golmana unutar Tim objekta '+error);
          throw(error);
      })
    }
  },
    treneri:{
      type:new GraphQLList(ClanTima),
      resolve(parent,args){
        return models.clanovitima.findAll({
          include:{
            model:models.klubclanovi,
            where:{
              klub_id:parent.id,
              do:null
            }
          },
          where:{
            rola:3
          }
        }).then((data)=>{
          let format=[];
          for(let trener of data)
          {
            let temp={
              maticni_broj:trener.maticni_broj,
              ime:trener.ime,
              prezime:trener.prezime
            };
            format.push(temp);
          }
          return format;
        }).catch((error) => {
          nodelogger.error('Greška u dohvaćanju trenera unutar Tim objekta '+error);
          throw(error);
      })
    }
  },
    sluzbenipredstavnici:{
      type:new GraphQLList(ClanTima),
      resolve(parent,args){
        return models.clanovitima.findAll({
          include:{
            model:models.klubclanovi,
            where:{
              klub_id:parent.id,
              do:null
            }
          },
          where:{
            rola:4
          }
        }).then((data)=>{
          let format=[];
          for(let sluzbeni of data)
          {
            let temp={
              maticni_broj:sluzbeni.maticni_broj,
              ime:sluzbeni.ime,
              prezime:sluzbeni.prezime
            };
            format.push(temp);
          }
          return format;
        }).catch((error) => {
          nodelogger.error('Greška u dohvaćanju sluzbenih predstavnika unutar Tim objekta '+error);
          throw(error);
      })
    }
  },
    tehniko:{
      type:new GraphQLList(ClanTima),
      resolve(parent,args){
        return models.clanovitima.findAll({
          include:{
            model:models.klubclanovi,
            where:{
              klub_id:parent.id,
              do:null
            }
          },
          where:{
            rola:5
          }
        }).then((data)=>{
          let format=[];
          for(let tehniko of data)
          {
            let temp={
              maticni_broj:tehniko.maticni_broj,
              ime:tehniko.ime,
              prezime:tehniko.prezime
            };
            format.push(temp);
          }
          console.log('Format tehniko'+JSON.stringify(format));
          return format;
        }).catch((error) => {
          nodelogger.error('Greška u dohvaćanju tehnika unutar Tim objekta '+error);
          throw(error);
      })
    }
  },
    fizio:{
      type:new GraphQLList(ClanTima),
      resolve(parent,args){
        return models.clanovitima.findAll({
          include:{
            model:models.klubclanovi,
            where:{
              klub_id:parent.id,
              do:null
            }
          },
          where:{
            rola:6
          }
        }).then((data)=>{
          let format=[];
          for(let fizio of data)
          {
            let temp={
              maticni_broj:fizio.maticni_broj,
              ime:fizio.ime,
              prezime:fizio.prezime
            };
            format.push(temp);
          }
          return format;
        }).catch((error) => {
          nodelogger.error('Greška u dohvaćanju fiziotarapeuta unutar Tim objekta '+error);
          throw(error);
        });
      }
    }
  })
})
const IgracStatistika=new GraphQLObjectType({
  name:'StatistikaIgraca',
  fields:()=>({
    golovi:{type:GraphQLInt},
    pokusaji:{type:GraphQLInt},
    sedmerac_golovi:{type:GraphQLInt},
    sedmerac_pokusaji:{type:GraphQLInt},
    iskljucenja:{type:GraphQLInt},
    zuti:{type:GraphQLInt},
    crveni:{type:GraphQLInt},
    plavi:{type:GraphQLInt},
    tehnicke:{type:GraphQLInt},
    asistencije:{type:GraphQLInt},
    igrac:{//igrac cija je to statistika
      type:ClanTima,
      resolve(parent,args){
          return models.clanovitima.findOne({
            where:{
              rola:1,//dodatnui osigurac iako je maticni broj sam dovoljan
              maticni_broj:parent.maticni_broj//maticni broj koji je sadrzan u retku tablice za statistiku igraca i koji će se vratiti iz resolvera za ispis statistike svih igraca
            }
          }).catch((error)=>{
          nodelogger.error('Greška u dohvaćanju clana tima unutar IgracStatistika objekta '+error);
          throw(error);
        })
      }
    }
  })
});
const GolmanStatistika=new GraphQLObjectType({
  name:'StatistikaGolmana',
  fields:()=>({
    obrane_ukupno:{type:GraphQLInt},
    primljeni_ukupno:{type:GraphQLInt},
    sedmerac_obrane:{type:GraphQLInt},
    sedmerac_primljeni:{type:GraphQLInt},
    iskljucenja:{type:GraphQLInt},
    zuti:{type:GraphQLInt},
    crveni:{type:GraphQLInt},
    plavi:{type:GraphQLInt},
    golovi:{type:GraphQLInt},
    pokusaji:{type:GraphQLInt},
    golman:{
      type:ClanTima,
      resolve(parent,args){
          return models.clanovitima.findOne({
            where:{
              maticni_broj:parent.maticni_broj//maticni broj ce doci iz resolvera od ispisa statistike cijelog tima iz niza objekata koji sadrze podatke o statistici golmana medu kojima se nalazi i maticni_broj
            }
          }).catch((error)=>{
          nodelogger.error('Greška u dohvaćanju clana tima unutar GolmanStatistika objekta '+error);
          throw(error);
        })
    }
  }
  })
})
const StozerStatistika=new GraphQLObjectType({
  name:'StatistikaClanaStozera',
  fields:()=>({
    zuti:{type:GraphQLInt},
    crveni:{type:GraphQLInt},
    plavi:{type:GraphQLInt},
    clan:{
      type:ClanTima,
      resolve(parent,args){
          return models.clanovitima.findOne({
            where:{
            maticni_broj: parent.maticni_broj
            }
          }).catch((error)=>{
          nodelogger.error('Greška u dohvaćanju clana tima unutar StozerStatistika objekta '+error);
          throw(error);
        })
      }
    }
  })
})
const TimStatistika=new GraphQLObjectType({
  name:'Statistika_tima',
  fields:()=>({
    igraci:{
      type:new GraphQLList(IgracStatistika),
      resolve(parent,args){
          return models.igracutakmica.findAll({
            where:{
              broj_utakmice:parent.broj_utakmice,//iz parent objekti koji smo dobili iz resolvera u queryu koji samo prosljeduje primljene parametre
              klub_id:parent.klub_id//bitna i utakmica i klub za koji igra(jer su 2 kluba na toj utakmici)
            }
          }).catch((error)=>{
          nodelogger.error('Greška u dohvaćanju statistike igrača unutar TimStaitstika objekta '+error);
          throw(error);
        })
      }
    },
    golmani:{
      type:new GraphQLList(GolmanStatistika),
      resolve(parent,args){
          return models.golmanutakmica.findAll({
            where:{
              broj_utakmice:parent.broj_utakmice,
              klub_id:parent.klub_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška u dohvaćanju staitstike golmana unutar TimStatistika objekta '+error);
          throw(error);
        })
      }
    },
    stozer:{
      type:new GraphQLList(StozerStatistika),
      resolve(parent,args){
          return models.stozerutakmica.findAll({
            where:{
              broj_utakmice:parent.broj_utakmice,
              klub_id:parent.klub_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška u dohvaćanju statistike stožera unutar TimStatistika objekta '+error);
          throw(error);
        })
      }
    }
  })
})
const Utakmica=new GraphQLObjectType({
  name:'Utakmica',
  fields:()=>({
    broj_utakmice:{type:GraphQLString},
    kolo:{type:GraphQLInt},
    datum:{type:Datum},
    vrijeme:{type:Vrijeme},
    gledatelji:{type:GraphQLInt},
    rezultat_domaci:{type:GraphQLInt},
    rezultat_gosti:{type:GraphQLInt},
    minuta:{type:GraphQLInt},
    sudac1_ocjena:{type:GraphQLFloat},
    sudac2_ocjena:{type:GraphQLFloat},
    status:{type:GraphQLInt},
    natjecanje:{//NESTAMO TIP NATJECANJE I NJEGA RESOLVAMO PREKO parent.natjecanje_id-> kod dohvata iz baze graphql će ono ptodobije u bazi usporediti sa shemom ovog tipa pa će pomoću tog ida iz baze resolvati i ove nestane objekte
      type:Natjecanje,//parent dolazi u igru kod nestanja više tipova-> npr ako je resolver unutar domaci_id od utakmice onda će resolver koji ide otrkiti
      //koji je to klub moći pristupiti idu od tog tima u utakmici preko parent.tim_id jer je utakmica parent objekt od ugnijezden tim objekta
      resolve(parent,args){
          return models.natjecanje.findOne({
            where:{
              id:parent.natjecanje_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvaćanja natjecanja unutar Utakmica objekta '+error);
          throw(error);
        });
      }
    },
    lokacija:{//DA BI OVI DIO BIO USPJEŠAN ONO ŠTO SE VRATI IZ RESOLVER MORA ZADOVOLJVATI SHEMU OD TIPA DVORNANA INAČE ĆE BITI GREŠKA
      type:Dvorana,
      resolve(parent,args){
          return models.mjestodvorana.findOne({
            where:{
              id:parent.mjesto_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvaćanja dvorane unutar Utakmica objekta '+error);
          throw(error);
        })
      }
    },
    nadzornik:{
      type:SluzbenaOsoba,
      resolve(parent,args){//POVEZANOSTI 1:N I VEZE MEĐU ELEMENTIMA DEFINIRAMO NA OVAJ NAČIN, NIKAD U SEQUELIZE NE ODREĐUJEMO ATRIBUTE KOJE DOHVAĆAMO NEGO DOHVAĆAMO SVE DA SU U SKLADU SA SHEMOM A ONDA U QUERY SPECIFICARMO KOJA POLJA ŽELIMO UKLJUČITI
          return models.sluzbenoosoblje.findOne({
            where:{
              maticni_broj:parent.nadzornik_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvaćanja ndozrnika unutar Utakmica objekta '+error);
          throw(error);
        })
      }
    },
    lijecnik:{
      type:SluzbenaOsoba,
      resolve(parent,args){
          return models.sluzbenoosoblje.findOne({
            where:{
              maticni_broj:parent.lijecnik_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvaćanja liječnika unutar Utakmica objekta '+error);
          throw(error);
        })
      }
    },
    zapisnicar:{
      type:SluzbenaOsoba,
      resolve(parent,args){
          return models.sluzbenoosoblje.findOne({
            where:{
              maticni_broj:parent.zapisnicar_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvaćanja zapisničara unutar Utakmica objekta '+error);
          throw(error);
        });
      }
    },
    mjeracvremena:{
      type:SluzbenaOsoba,
      resolve(parent,args){
          return models.sluzbenoosoblje.findOne({
            where:{
              maticni_broj:parent.mjvremena_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvaćanja mjeraca vremena unutar Utakmica objekta '+error);
          throw(error);
        })
      }
    },
    sudac1:{
      type:Sudac,
      resolve(parent,args){
          return models.suci.findOne({
            where:{
              maticni_broj:parent.sudac1_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvaćanja sudca1 unutar Utakmica objekta '+error);
          throw(error);
        })
      }
    },
      sudac2:{
        type:Sudac,
        resolve(parent,args){
            return models.suci.findOne({
              where:{
                maticni_broj:parent.sudac2_id
              }
            }).catch((error)=>{
            nodelogger.error('Greska kod dohvaćanja sudca2 unutar Utakmica objekta '+error);
            throw(error);
          })
        }
      },
      domaci:{
        type:Klub,
        resolve(parent,args){
            return models.klub.findOne({
              where:{
                id:parent.domaci_id
              }
            }).catch((error)=>{
            nodelogger.error('Greška kod dohvaćanja domaćeg kluba unutar Utakmica objekta '+error);
            throw(error);
          })
        }
      },
      gosti:{
        type:Klub,
        resolve(parent,args){
            return models.klub.findOne({
              where:{
                id:parent.gosti_id
              }
            }).catch((error)=>{
            nodelogger.error('Greska kod dohvaćanja gostujućeg kluba unutar Utakmica objekta '+error);
            throw(error);
          })
        }
      }
  })
})
const DogadajiUtakmice=new GraphQLObjectType({
  name:'DogadajiUtakmice',
  fields:()=>({
    id:{type:GraphQLInt},
    vrijeme:{type:GraphQLString},
    tim:{type:GraphQLInt},
    rez_domaci:{type:GraphQLInt},
    rez_gosti:{type:GraphQLInt},
    dogadaj:{
      type:MoguciDogadaji,
      resolve(parent,args){
          return models.dogadaj.findOne({
            where:{
              id:parent.dogadaj_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvata događaja unutar DogadajiUtakmice objekta '+error);
          throw(error);
        })
      }
    },
    akter:{
      type:ClanTima,
      resolve(parent,args){
          return models.clanovitima.findOne({
            where:{
              maticni_broj:parent.maticni_broj
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvata clana tima unutar DogadajiUtakmice objekta '+error);
          throw(error);
        })
      }
    }
  })
})
const GolPozicija=new GraphQLObjectType({
  name:'PozicijaGola',
  fields:()=>({
    id:{type:GraphQLInt},
    pozicija:{type:GraphQLInt},
    gol:{type:GraphQLBoolean},
    akter:{
      type:ClanTima,
      resolve(parent,args){
          return models.clanovitima.findOne({
            where:{
              maticni_broj:parent.maticni_broj
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvata clana tima unutar GolPozicija objekta '+error);
          throw(error);
        })
      }
    },
    dogadaj:{
      type:MoguciDogadaji,
      resolve(parent,args){
          return models.dogadaj.findOne({
            where:{
              id:parent.dogadaj_id
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvata događaja unutar GolPozicija objekta '+error);
          throw(error);
        })
      }
    }
  })
})
process.setMaxListeners(50);
const NOVA_UTAKMICA="NOVA_UTAKMICA";
const PROMJENA_STATUSA="PROMJENA_STATUSA";//kada se status utakmice mijenja-> kada bude 5-> zavrsi utakmicu
const PROMJENA_VREMENA="PROMJENA_VREMENA";
const PROMJENA_REZULTATA="PROMJENA_REZULTATA";
//ZA POJEDINU UTAKMICU PROMJENA->KADA UĐEMO U LIVE STATISTIKA STRANICU OD UTAKMICE
const PROMJENA_REZULTATA_UTAKMICE="PROMJENA_REZULTATA_UTAKMICE";
const PROMJENA_STATUSA_UTAKMICE="PROMJENA_STATUSA_UTAKMICE";
const PROMJENA_VREMENA_UTAKMICE="PROMJENA_VREMENA_UTAKMICE";
const NOVI_DOGADAJ_UTAKMICE="NOVI_DOGADAJ_UTAKMICE";
const BRISI_DOGADAJ_UTAKMICE="BRISI_DOGADAJ_UTAKMICE";
const PROMJENA_STATISTIKE_IGRACA="PROMJENA_STATISTIKE_IGRACA";
const PROMJENA_STATISTIKE_GOLMANA="PROMJENA_STATISTIKE_GOLMANA";
const PROMJENA_STATISTIKE_STOZERA="PROMJENA_STATISTIKE_STOZERA";
const RootSubscriptions=new GraphQLObjectType({
  name:'Svi_subscriptionsi',
  fields:{
    novautakmica:{
      type:Utakmica,
      subscribe:(parent,args)=> pubsub.asyncIterator(NOVA_UTAKMICA)
      },
      promjenastatusa:{//saljemo broj_utakmice i status samo-> to je dovoljno za render
        type:Utakmica,
        subscribe:(parent,args)=>pubsub.asyncIterator(PROMJENA_STATUSA)
      },
      promjenavremena:{//kod promjene minute azuriramo frontend-> saljemo broj utakmice i minutut
        type:Utakmica,
        subscribe:(parent,args)=>pubsub.asyncIterator(PROMJENA_VREMENA)
      },
      promjenarezultata:{//vracamo broj utakmice i gosti i domaci rezultat
        type:Utakmica,
        subscribe:(parent,args)=>pubsub.asyncIterator(PROMJENA_REZULTATA)
      },
      //ZA RAZLIKU OD PRVA 4 SUBSCRIPTIONSA OVI OSTALI SU VEZANI ZA SPECIFIČNU UTAKMICU-> NE PUSHAMO PODATKE NAKON SVAKE PROMJENE STATISTIKE/REZULTATA NEGO JEDINO AKO JE KORISNIK UŠA U TU UTAKMICU
      //2 OPCIJE:
      //1) IMAT EVENTOVE TIPA PROMJENA_REZULTATA_UTAKMICE_${BROJUTAKMICE} I ONDA TRIGERAT ASYNCITERATOR NA TEKST PROMJENA_REZULTATA_UTAKMICE_${ARGS.BROJ_UTAKMICE}
      //2) KORISTITI WITH FILTER U SUBSCRIBE METODI(KO DOLJE) ZA VIDIT JE LI TREBA SLAT ZADANE PODATKE KORISNIKU(AKO JE UŠA U TAJ PAGE ZA LIVE STATISITIKU UTAKMICE ONDA DA) ILI NE
      rezultatutakmice:{
        type:Utakmica,
        args:{broj_utakmice:{type:new GraphQLNonNull(GraphQLString)}},
        /*The withFilter function takes two parameters:

        The first parameter is exactly the function you would use for subscribe if you weren't applying a filter.
        The second parameter is a filter function that returns true if a subscription update should be sent to a particular client, and false otherwise (Promise<boolean> is also allowed). This function takes two parameters of its own:
        payload is the payload of the event that was published.
        variables is an object containing all arguments the client provided when initiating their subscription. */
        subscribe:withFilter(()=>pubsub.asyncIterator(PROMJENA_REZULTATA_UTAKMICE),
        (payload,variables)=>{
         return (payload.rezultatutakmice.broj_utakmice==variables.broj_utakmice)
        })
      },
      statusutakmice:{
        type:Utakmica,
        args:{broj_utakmice:{type:new GraphQLNonNull(GraphQLString)}},
        subscribe:withFilter(()=>pubsub.asyncIterator(PROMJENA_STATUSA_UTAKMICE),
        (payload,variables)=>{
          return (payload.statusutakmice.broj_utakmice==variables.broj_utakmice)
         })
      },
      minutautakmice:{
        type:Utakmica,
        args:{broj_utakmice:{type:new GraphQLNonNull(GraphQLString)}},
        subscribe:withFilter(()=>pubsub.asyncIterator(PROMJENA_VREMENA_UTAKMICE),
        (payload,variables)=>{
          return (payload.minutautakmice.broj_utakmice==variables.broj_utakmice)
         })
      },
      novidogadajutakmice:{
        type:DogadajiUtakmice,
        args:{broj_utakmice:{type:new GraphQLNonNull(GraphQLString)}},
        subscribe:withFilter(()=>pubsub.asyncIterator(NOVI_DOGADAJ_UTAKMICE),
        (payload,variables)=>{
          return (payload.novidogadajutakmice.broj_utakmice==variables.broj_utakmice)
         })
      },
      brisidogadajutakmice:{
        type:DogadajiUtakmice,
        args:{broj_utakmice:{type:new GraphQLNonNull(GraphQLString)}},
        subscribe:withFilter(()=>pubsub.asyncIterator(BRISI_DOGADAJ_UTAKMICE),
        (payload,variables)=>{
          return (payload.brisidogadajutakmice.broj_utakmice==variables.broj_utakmice)
         })
      },
      statistikaigrac:{
        type:IgracStatistika,
        args:{
          broj_utakmice:{type:new GraphQLNonNull(GraphQLString)},
          klub_id:{type:new GraphQLNonNull(GraphQLInt)}
        },
        subscribe:withFilter(()=>pubsub.asyncIterator(PROMJENA_STATISTIKE_IGRACA),
        (payload,variables)=>{
          if(payload.statistikaigrac.broj_utakmice==variables.broj_utakmice&&payload.statistikaigrac.klub_id==variables.klub_id)
          {
            return true;
          }
          else return false;
         })
      },
      statistikagolman:{
        type:GolmanStatistika,
        args:{
          broj_utakmice:{type:new GraphQLNonNull(GraphQLString)},
          klub_id:{type:new GraphQLNonNull(GraphQLInt)}
        },
        subscribe:withFilter(()=>pubsub.asyncIterator(PROMJENA_STATISTIKE_GOLMANA),
        (payload,variables)=>{
          nodelogger.error('Usa san u staitstika golman filčter'+JSON.stringify(payload));
          if(payload.statistikagolman.broj_utakmice==variables.broj_utakmice&&payload.statistikagolman.klub_id==variables.klub_id)
          {
            nodelogger.info('True usa tu golman');
            return true;
          }
          else{
            console.log('Fale ne vracaj nista golman');
             return false;
          }
         })
      },
      statistikastozer:{
        type:StozerStatistika,
        args:{
          broj_utakmice:{type:new GraphQLNonNull(GraphQLString)},
          klub_id:{type:new GraphQLNonNull(GraphQLInt)}
        },
        subscribe:withFilter(()=>pubsub.asyncIterator(PROMJENA_STATISTIKE_STOZERA),
        (payload,variables)=>{
          if(payload.statistikastozer.broj_utakmice==variables.broj_utakmice&&payload.statistikastozer.klub_id==variables.klub_id)
          {
            return true;
          }
          else return false;
         })
      }

    }
})

const RootQuery=new GraphQLObjectType({
  name:'Svi_queryi_za_entrypoint',
  fields:{//ovde ne triba funkcija jer ih sve ovde definiramo
    //fileds=entry pointovi za sve querye servera
    utakmica:{//DOHVAT PODATAKA VEZANIH ZA UTAKMICU-> za dohvat generalInfo i osoba utakmice isti ovi query samo specificiramo atribute koji nam trebaju
      type:Utakmica,
      args:{broj_utakmice:{type:new GraphQLNonNull(GraphQLString)}},//specificiramo sve argumente querya
      resolve(parent,args){//NIJE POTREBNA AUTORIZACIJA JER JE TO ZA GENERALNOG KORISNIKA
          return models.utakmica.findOne({
            where:{
              broj_utakmice:args.broj_utakmice
            }
          }).catch((error)=>{
          nodelogger.error('Greška kod dohvata podataka utakmice '+error);
          throw(error);
        })
      }
      //Nije potrebno da resolver bude async i radimo await u njemu jer će graphql sam čekati da dobije neki odgovor uvreturnu koji može usporediti s danom shemom i tipom tog querya
      //Ako oćemo nešto ispisivat unutar resolvera onda su nam bitni promisesi i onda koristimo ili .then ili async await
      /*Notice that while the resolver function needs to be aware of Promises, the GraphQL query does not.
       It simply expects the human field to return something which it can then ask the name of. 
       During execution, GraphQL will wait for Promises, Futures, and Tasks to complete before continuing
        and will do so with optimal concurrency*/
    },
    natjecanja:{//dohvat svih najtecanja kod vođenja utakmice-> SAMO ADMIN AUTORIZIRAN
      type:new GraphQLList(Natjecanje),
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.natjecanje.findAll({}).catch((error)=> {
            nodelogger.error('Greška kod dohvata svih najtecanja '+error);
            throw(error);
          })
        }
        else {
          nodelogger.error('Greska u autorizaciji kod dohvata svih natjecanja');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    dvorane:{
      type:new GraphQLList(Dvorana),
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.mjestodvorana.findAll({}).catch((error)=>{
            nodelogger.error('Greška kod dohvaćanja svih dvorana '+error);
            throw(error);
          })
        }
        else {
          nodelogger.error('Greska u autorizaciji kod dohvata svih dvorana');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    nadzornici:{//dohvat svih nadzornika
      type:new GraphQLList(SluzbenaOsoba),
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.sluzbenoosoblje.findAll({
              where:{
                rola:1
              }
            }).catch((error)=>{
            nodelogger.error('Greška kod dohvata svih nadzornika '+error);
            throw(error);
          })
        }
        else {
          nodelogger.error('Greska u autorizaciji kod dohvata svih nadzornika');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    lijecnici:{
      type:new GraphQLList(SluzbenaOsoba),
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return  models.sluzbenoosoblje.findAll({
              where:{
                rola:4
              }
            }).catch((error)=>{
            nodelogger.error('Greška kod dohvata svih liječnika '+error);
            throw(error);
          })
        }
        else {
          nodelogger.error('Greska u autorizaciji kod dohvata svih lijecnika');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    zapisnicari:{
      type:new GraphQLList(SluzbenaOsoba),
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.sluzbenoosoblje.findAll({
              where:{
                rola:2
              }
            }).catch((error)=>{
            nodelogger.error('Greška kod dohvata svih zapisničara '+error);
            throw(error);
          })
        }
        else {
          nodelogger.error('Greska u autorizaciji kod dohvata svih zapisnicara');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    mjeracivremena:{
      type:new GraphQLList(SluzbenaOsoba),
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.sluzbenoosoblje.findAll({
              where:{
                rola:3
              }
            }).catch((error)=>{
            nodelogger.error('Greška kod dohvata svih mjerača vremena '+error);
            throw(error);
          })
      }
      else {
        nodelogger.error('Greska u autorizaciji kod dohvata svih mjerača vremena');
        throw(new Error('Niste autorizirani za zadanu operaciju'));
      }
      }
    },
    suci:{
      type:new GraphQLList(Sudac),
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.suci.findAll({}).catch((error)=>{
            nodelogger.error('Greška kod dohvata svih sudaca '+error);
            throw(error);
          })
        }
        else {
          nodelogger.error('Greska u autorizaciji kod dohvata svih sudaca');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    klubovi:{
      type:new GraphQLList(Klub),
      args:{natjecanje_id:{type:new GraphQLNonNull(GraphQLInt)}},//dohvat SAMO ONIH KLUBOVA IZ ODABRANOG NATJECANJA-> KOD VOĐENJA UTAKMICE-> OMOGUĆENO SAMO ADMINU
      resolve:async(parent,args,context)=>{
        if(context.req.session.user_id)
        {
            return models.klub.findAll({
              include:{
                model:models.natjecanje,
                as:'kluboviodnatjecanja',
                through: { attributes: [] },
                where:{
                  id:args.natjecanje_id
                }
              }
            }).catch((error)=>{
            nodelogger.error('Greška kod dohvata svih klubova odabranog natjecanja '+error);
            throw(error);
          })
        }
        else {
          nodelogger.error('Greska u autorizaciji kod dohvata klubova iz natjecanja');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    dogadaji:{//dohvat svih mogućih događaja koji se mogu dogoditi
      type:new GraphQLList(MoguciDogadaji),
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.dogadaj.findAll({}).catch((error)=>{
            nodelogger.error('Greška kod dohvata svih mogućih događaja '+error);
            throw(error);
          })
      }
      else {
        nodelogger.error('Greska u autorizaciji kod dohvata svih mogućih događaja');
        throw(new Error('Niste autorizirani za zadanu operaciju'));
      }
      }
    },
    timclanovi:{//vraća sve moguće članove tima od igrača i golmana do stožera kod vođenja utakmice-> AUTORIZIRANO SAMO ZA ADMINE
      type:Tim,
      args:{klub_id:{type:new GraphQLNonNull(GraphQLInt)}},
      resolve(parent,args,context){//OVAJ RESOLVER ĆE VRATITI ID OD KLUBA U OBJECT TYPE TIM U KOJEM MU MOŽEMO PRISTUPATI I KOJI ĆE POMOĆU NJEGA DOBITI SVE POTREBNE CLANOVE TIMA
        if(context.req.session.user_id)
        {
          return {//NIJE POTREBNO TRY CATCH ERROR HANDLEANJE JER NEMA SINKRONIH OPERAIJA+ KAD SE THROWA ERROR UNUTAR TIM OBJEKTA ON SE NEĆE PROPAGIRATI NAZAD U OVAJ RESOLVER NEGO ĆE IĆI ODMAH NA ERROR HANDLEANJE
            //ODNOSNO PRVI RESOLVERI KAD SE IZVRSE ONI SU GOTOVI I NEMA VIŠE POVRATKA U NJIH, ERROR HANDLEANJE ĆE SE ODRADIT UNUTAR TIM OBJEKTA
            id:args.klub_id
          }
        }
        else {
          nodelogger.error('Greška u autorizaciji kod dohvata clanova tima');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    timstatistika:{//vraća statistike igraca,golmana i stozera za određenu utakmicu od određenog kluba
      type:TimStatistika,
      args:{broj_utakmice:{type: new GraphQLNonNull(GraphQLString)},
            klub_id:{type:new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent,args){//samo vratimo argumente u resolveru koje ćemo koristiti u TimStatistika object typeu za resolvanje
          return {
            broj_utakmice:args.broj_utakmice,
            klub_id:args.klub_id
          }
      }
    },
    dogadajiutakmice:{//vraća sve događaje utakmice za pojedinu utakmicu
      type:new GraphQLList(DogadajiUtakmice),
      args:{broj_utakmice:{type:new GraphQLNonNull(GraphQLString)}},
      resolve(parent,args){
          return models.dogadajiutakmice.findAll({
            where:{
              broj_utakmice:args.broj_utakmice
            }
          }).catch((error)=>{
          nodelogger.error('Greska kod dohvata događaja utakmice '+error);
          throw(error);
        })
      }
    },
    checklogin:{
      type:GraphQLBoolean,
      resolve(parent,args,context){
        if(context.req.session.user_id)//ako je logiran-> ima session cookie jer mu jw postavljen user_id pa je i spremljen u bazu-> propusti ga
        {
          return true;
        }
        else return false;//nije logiran
      }
    },
    rezultatiuzivo:{
      type:new GraphQLList(Utakmica),
      resolve(parent,args){
        return models.utakmica.findAll({
          where:{
            [Op.and]: [//dohvati one kojima je status [2,4]-> jos se igraju
              { 
                status:{
                [Op.gt]:1
                }
              },
               {
                status:{
                [Op.lt]: 5
               }
              }
            ],
          }
        }).catch((error)=>{
          nodelogger.error('Greška kod dohvata live rezultata '+error);
          throw(error);
        })
      }
    },
    rezultatutakmice:{
      type:Utakmica,
      args:{broj_utakmice:{type:new GraphQLNonNull(GraphQLString)}},
      resolve(parent,args){
        return models.utakmica.findOne({
          where:{
            broj_utakmice:args.broj_utakmice
          }
        }).catch((error)=>{
          nodelogger.error('Greška kod dohvaćanja rezultata,statusa i minute utakmice '+error);
          throw(error);
        })
      }
    }
  }
})
//Kod pisanja u graphiql moramo poceti sa prefiskom mutation zatim u zagrade stavimo argumente i u tijelu specificiramo KOJA POLJA OD NOVO STVORENOG OBJEKTA ŽELIMO DA NAM VRATI GRAPHQL SERVER
//!!!!!ako želimo vratiti polja dodanog objekta-> potrebno returnat promise KAO I INAČE U RESOLVERU INAČE ĆE BITI null vraćen za dane filedove
//KAKO MUTACIJE MOGU VRAĆATI ATRIBUTE STVOFRENOG OBJEKTA-> I U KOD NJIH JE POTREBNO SPECIFICRATI POVRATNI TIP
const Mutation=new GraphQLObjectType({//mutacije-> mijenjanje ili unošenje novih sadržaja u bazu
  name:'Mutacije',
  fields:{
    //vrati niz od 2 kluba s njihovim id i nazivom + slikama ako je uspješno bilo
    dodajutakmicu:{
      type:new GraphQLList(Klub),
      args:{
        broj_utakmice:{type:new GraphQLNonNull(GraphQLString)},
        kolo:{type:new GraphQLNonNull(GraphQLInt)},
        datum:{type:new GraphQLNonNull(Datum)},
        vrijeme:{type:new GraphQLNonNull(Vrijeme)},
        gledatelji:{type:new GraphQLNonNull(GraphQLInt)},
        natjecanje_id:{type:new GraphQLNonNull(GraphQLInt)},
        dvorana_id:{type:new GraphQLNonNull(GraphQLInt)},
        nadzornik_id:{type:new GraphQLNonNull(GraphQLString)},
        lijecnik_id:{type:GraphQLString},
        zapisnicar_id:{type:new GraphQLNonNull(GraphQLString)},
        mjvremena_id:{type:GraphQLString},
        sudac1_id:{type:new GraphQLNonNull(GraphQLString)},
        sudac2_id:{type:GraphQLString},
        timdomaci_id:{type:new GraphQLNonNull(GraphQLInt)},
        timgosti_id:{type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.utakmica.create({
              broj_utakmice:args.broj_utakmice,
              kolo:args.kolo,
              datum:args.datum,
              vrijeme:args.vrijeme,
              gledatelji:args.gledatelji,
              natjecanje_id:args.natjecanje_id,
              mjesto_id:args.dvorana_id,
              nadzornik_id:args.nadzornik_id,
              lijecnik_id:args.lijecnik_id,
              zapisnicar_id:args.zapisnicar_id,
              mjvremena_id:args.mjvremena_id,
              sudac1_id:args.sudac1_id,
              sudac2_id:args.sudac2_id,
              domaci_id:args.timdomaci_id,
              gosti_id:args.timgosti_id
            }).then((data)=>{
                const klub_ids=[data.domaci_id,data.gosti_id];//niz 2 ida od klubova
                return models.klub.findAll({//vracamo promise
                  attributes:['id','naziv'],
                  where:{
                    id:{
                      [Op.in]:klub_ids
                    }
                  }
                })
            }).then((data)=>{
              return data;
            }).catch((error)=>{
              nodelogger.error('Greška kod spremanja utakmice '+error);
              throw(error);
            })
        }
        else {
          nodelogger.error('Greška u autorizaciji kod spremanja utakmice');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
        }
    },
    spremitimzautakmicu:{//Potrebno je da mutacija barem nešto vrati pa makar to bilo null,ako želimo da vrati null onda definiramo NOVI SCALAR TYPE VOID KOJI JE UVIJEK NULL I NJEGA STAVIMO ZA TYPE
      type:GraphQLBoolean,//VRATIMO TRUE AKO JE USPJEŠNO
      args:{
        broj_utakmice:{type:new GraphQLNonNull(GraphQLString)},
        klub_id:{type:new GraphQLNonNull(GraphQLInt)},
        igraci_id:{type:new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))},//niz maticnih brojava koji su stringovi, ekvivalentno uvjetu [String!]!
        golmani_id:{type:new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))},
        trener_id:{type:new GraphQLNonNull(GraphQLString)},
        sluzpredstavnik_id:{type:GraphQLString},
        tehniko_id:{type:GraphQLString},
        fizio_id:{type:GraphQLString}
      },
      resolve:async (parent,args,context)=>{//ako nam treba async await sintaksa samo je dodamo na resolve funkciju
        try {
          if(context.req.session.user_id)
          {
            for(let i=0;i<args.igraci_id.length;i++)
            {
              await models.igracutakmica.create({//CREATE PO DEFAULTU SAM VRAĆA OBJEKT U KOJEM SE NALAZI NOVO KREIRANI/UNESENI REDAK TABLICE
                broj_utakmice:args.broj_utakmice,
                klub_id:args.klub_id,
                maticni_broj:args.igraci_id[i]
              });
            }
            for(let i=0;i<args.golmani_id.length;i++)
            {
              await models.golmanutakmica.create({
                broj_utakmice:args.broj_utakmice,
                klub_id:args.klub_id,
                maticni_broj:args.golmani_id[i]
              })
            }
            await models.stozerutakmica.create({//trener mora bit odabran nije null sig
              broj_utakmice:args.broj_utakmice,
              klub_id:args.klub_id,
              maticni_broj:args.trener_id
            });
            if(args.sluzpredstavnik_id)//mogu biti null svi osim trenera
            {
              await models.stozerutakmica.create({
                broj_utakmice:args.broj_utakmice,
                klub_id:args.klub_id,
                maticni_broj:args.sluzpredstavnik_id
              });
            }
            if(args.tehniko_id)
            {
              await models.stozerutakmica.create({
                broj_utakmice:args.broj_utakmice,
                klub_id:args.klub_id,
                maticni_broj:args.tehniko_id
              });
            }
            if(args.fizio_id)
            {
              await models.stozerutakmica.create({
                broj_utakmice:args.broj_utakmice,
                klub_id:args.klub_id,
                maticni_broj:args.fizio_id
              });
            }
            return true;
          }
          else throw(new Error('Niste autorizirani za zadanu operaciju'));
        } catch (error) {
          nodelogger.error('Greška kod spremanja tima kluba za utakmicu '+error);
          throw(error);
        }
      }
    },
    spremidogadaj:{
      type:DogadajiUtakmice,//vrati dogadajID ako je uspjesno spremljen
      args:{
        broj_utakmice:{type:new GraphQLNonNull(GraphQLString)},
        vrijeme:{type:new GraphQLNonNull(GraphQLString)},
        klubgrb:{type:new GraphQLNonNull(GraphQLInt)},//domaci ili gostujuci tim
        maticni_broj:{type:GraphQLString},
        dogadaj_id:{type:new GraphQLNonNull(GraphQLInt)},
        domaci:{type:GraphQLInt},
        gosti:{type:GraphQLInt},
      },
      resolve: async(parent,args,context)=>{
        try {
          if(context.req.session.user_id)
          {
            //1) Spremi događaja u bazu
            //2) Update statistike određenog polja utakmice od zadanog igraca
            //3) Pushaj nove podatke u subscription zadani
             const spremljenidogadaj = await models.dogadajiutakmice.create({//AKO NE POŠALJEMO NEKI PARAMETAR U MUTACIJI ON ĆE PO DEFAULTU BITI NULL I SEQUELIZE GA NEĆE UOPĆE SPREMATI U QUERYU NEGO ĆE ON ZAUZET DEFAULT VRIJEDNOST
                vrijeme:args.vrijeme,
                tim:args.klubgrb,
                rez_domaci:args.domaci,
                rez_gosti:args.gosti,
                broj_utakmice:args.broj_utakmice,
                dogadaj_id:args.dogadaj_id,
                maticni_broj:args.maticni_broj
              });
              pubsub.publish(NOVI_DOGADAJ_UTAKMICE,{
                novidogadajutakmice:{
                  broj_utakmice:args.broj_utakmice,
                  id:spremljenidogadaj.id,
                  vrijeme:args.vrijeme,
                  tim:args.klubgrb,
                  rez_domaci:args.domaci,
                  rez_gosti:args.gosti,
                  broj_utakmice:args.broj_utakmice,
                  dogadaj_id:args.dogadaj_id,
                  maticni_broj:args.maticni_broj
                }
              });
              if(!(args.dogadaj_id===15||args.dogadaj_id===16))//ako su timeout dogadaji onda je nepotrebno sve ovo doli,radimo samo subscription za novi dogadaj
              {
                const clan=await models.clanovitima.findOne({
                  where:{
                    maticni_broj:args.maticni_broj
                  }
                });
                
                const dogadaj=await models.dogadaj.findOne({
                  where:{
                    id:args.dogadaj_id
                  }
                });
                if(dogadaj.tip===1&&clan.rola===1)//promjena rezultata od strane igraca
                {
                  //za događaje s promjenom rezultata updateamo i rezultat utakmice-> ako je timdomaci onda uvećamo domaći rezultat
                  if(args.klubgrb===1)//uvećali smo domaci rezultat-> smanjimo domaće
                  {
                    await models.utakmica.increment('rezultat_domaci',{where:{broj_utakmice:args.broj_utakmice}});
                  }
                  else await models.utakmica.increment('rezultat_gosti',{where:{broj_utakmice:args.broj_utakmice}});
                  pubsub.publish(PROMJENA_REZULTATA,{//mijenja se rezultat kod live praćenja-> već imamo koji je novi rezultat
                    promjenarezultata:{
                      broj_utakmice:args.broj_utakmice,
                      rezultat_domaci:args.domaci,
                      rezultat_gosti:args.gosti
                    }
                  })
                  pubsub.publish(PROMJENA_REZULTATA_UTAKMICE,{
                    rezultatutakmice:{
                      broj_utakmice:args.broj_utakmice,
                      rezultat_domaci:args.domaci,
                      rezultat_gosti:args.gosti
                    }
                  })
                  if(args.dogadaj_id===5)//gol sedmerac-> increment i gol i sedmerac pogodak stupce
                  {
                    await models.igracutakmica.increment(['golovi','pokusaji','sedmerac_golovi','sedmerac_pokusaji'],{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                  }
                  else {
                    //gol-> increment samo gol
                    await models.igracutakmica.increment(['golovi','pokusaji'],{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                  }
                }
                else if(dogadaj.tip===1&&clan.rola===2)//pogodak od golmana-> ima samo 1 rubriku za to
                {
                    //za događaje s promjenom rezultata updateamo i rezultat utakmice
                    if(args.klubgrb===1)//uvećali smo domaci rezultat-> smanjimo domaće
                    {
                      await models.utakmica.increment('rezultat_domaci',{where:{broj_utakmice:args.broj_utakmice}});
                    }
                    else await models.utakmica.increment('rezultat_gosti',{where:{broj_utakmice:args.broj_utakmice}});
                    pubsub.publish(PROMJENA_REZULTATA,{//mijenja se rezultat kod live praćenja-> već imamo koji je novi rezultat
                      promjenarezultata:{
                        broj_utakmice:args.broj_utakmice,
                        rezultat_domaci:args.domaci,
                        rezultat_gosti:args.gosti
                      }
                    })
                    pubsub.publish(PROMJENA_REZULTATA_UTAKMICE,{
                      rezultatutakmice:{
                        broj_utakmice:args.broj_utakmice,
                        rezultat_domaci:args.domaci,
                        rezultat_gosti:args.gosti
                      }
                    })
                  await models.golmanutakmica.increment(['golovi','pokusaji'],{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===2)//obrana-> samo za golmane
                {
                  await models.golmanutakmica.increment('obrane_ukupno',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===3&&clan.rola===1)//promasaj igraca
                {
                  await models.igracutakmica.increment('pokusaji',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if((args.dogadaj_id===3||args.dogadaj_id===7)&&clan.rola===2)//promasaj sedmerca ili obicni promasaj od golmana-> nema odvojene rubrike
                {
                  await models.golmanutakmica.increment('pokusaji',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===4)//primljen pogodak-> samo golman
                {
                  await models.golmanutakmica.increment('primljeni_ukupno',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===6)//obrana sedmerca-> samo golman
                {
                  await models.golmanutakmica.increment('sedmerac_obrane',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===7&&clan.rola===1)//sedmerac promasaj od strane igraca
                {
                  await models.igracutakmica.increment(['pokusaji','sedmerac_pokusaji'],{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===8)//sedmerac primljen-> samo za golmana
                {
                  await models.golmanutakmica.increment('sedmerac_primljeni',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===9&&clan.rola===1)//iskljucenje igraca
                {
                  await models.igracutakmica.increment('iskljucenja',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===9&&clan.rola===2)//iskljucenje golmana
                {
                  await models.golmanutakmica.increment('iskljucenja',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===10)//asistencija-> samo za igraca
                {
                  await models.igracutakmica.increment('asistencije',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===11)//tehnicka greska-> samo za igraca
                {
                  await models.igracutakmica.increment('tehnicke',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===12&&clan.rola===1)//zuti karton igrac
                {
                  await models.igracutakmica.increment('zuti',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===12&&clan.rola===2)
                {
                  await models.golmanutakmica.increment('zuti',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===12&&clan.rola===3)//zuti karton stozer
                {
                  await models.stozerutakmica.increment('zuti',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===13&&clan.rola===1)//zuti karton igrac
                {
                  await models.igracutakmica.increment('crveni',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===13&&clan.rola===2)
                {
                  await models.golmanutakmica.increment('crveni',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===13&&clan.rola===3)//zuti karton stozer
                {
                  await models.stozerutakmica.increment('crveni',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===14&&clan.rola===1)//zuti karton igrac
                {
                  await models.igracutakmica.increment('plavi',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===14&&clan.rola===2)
                {
                  await models.golmanutakmica.increment('plavi',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                else if(args.dogadaj_id===14&&clan.rola===3)//zuti karton stozer
                {
                  await models.stozerutakmica.increment('plavi',{where:{broj_utakmice:args.broj_utakmice,maticni_broj:args.maticni_broj}});
                }
                //pozovi subscription statistike ovisno o roli
                if(clan.rola===1)
                {
                  const igrac_statistika=await models.igracutakmica.findOne({
                    where:{
                      broj_utakmice:args.broj_utakmice,
                      maticni_broj:args.maticni_broj
                    }
                  })
                  pubsub.publish(PROMJENA_STATISTIKE_IGRACA,{
                    statistikaigrac:igrac_statistika
                  })
                }
                else if(clan.rola===2)
                {
                  nodelogger.error('Rola=2 usao u golman statistika');
                  const golman_statistika=await models.golmanutakmica.findOne({
                    where:{
                      broj_utakmice:args.broj_utakmice,
                      maticni_broj:args.maticni_broj
                    }
                  })
                  nodelogger.error('Publish promjena golman statistike');
                  pubsub.publish(PROMJENA_STATISTIKE_GOLMANA,{
                    statistikagolman:golman_statistika
                  })
                  nodelogger.error('Publishan golman');
                }
                else {
                  const stozer_statistika=await models.stozerutakmica.findOne({
                    where:{
                      broj_utakmice:args.broj_utakmice,
                      maticni_broj:args.maticni_broj
                    }
                  })
                  pubsub.publish(PROMJENA_STATISTIKE_STOZERA,{
                    statistikastozer:stozer_statistika
                  })
                }
              }
              //za timeout domac i gosti samo pushat dogadaje u subscriptionsima a za ostale i redak statistike+ za tip1 pushat i subscriptions rezultate
              return spremljenidogadaj;//uvijek vrati spremljeni dogadaj
            }
          else{
            nodelogger.error('Greška u autorizaciji kod spremanja događaja utakmice');
            throw(new Error('Niste autorizirani za zadanu operaciju'));
          }
        } catch (error) {
          nodelogger.error('Greška prilikom spremanja događaja '+error);
          throw(error);
        }
      }
    },
    spremigolpoziciju:{
      type:GolPozicija,//vrati id novokreirani ako je dobro sve
      args:{
        pozicija:{type:new GraphQLNonNull(GraphQLInt)},
        gol:{type:new GraphQLNonNull(GraphQLBoolean)},
        broj_utakmice:{type:new GraphQLNonNull(GraphQLString)},
        maticni_broj:{type: new GraphQLNonNull(GraphQLString)},
        dogadaj_id:{type:new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.pozicijegola.create({
              pozicija:args.pozicija,
              gol:args.gol,
              broj_utakmice:args.broj_utakmice,
              maticni_broj:args.maticni_broj,
              dogadaj_id:args.dogadaj_id
            }).catch((error)=> {
            nodelogger.error('Greška kod spremanja pozicije gola '+error);
            throw(error);
          })
        }
        else {
          nodelogger.error('Greška u autorizaciji kod spremanja pozicije gola');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    azurirajstatusutakmice:{
      type:GraphQLInt,//vrati postavljeni status
      args:{
        status:{type:new GraphQLNonNull(GraphQLInt)},
        broj_utakmice:{type:new GraphQLNonNull(GraphQLString)},
      },
      resolve:async(parent,args,context)=>{
        try {
          if(context.req.session.user_id)
          {
             await models.utakmica.update({status:args.status},{
                where:{
                  broj_utakmice:args.broj_utakmice
                }
              })
                if(args.status===2)//pocela utakmica-> dohvati podatke i dodaj je u nove live utakmice na frontendu
                {
                  const data=await models.utakmica.findOne({
                    where:{
                      broj_utakmice:args.broj_utakmice
                    }
                  })
                  pubsub.publish(NOVA_UTAKMICA,{//nakon spremanja utakmice saljemo u subscription koji će dodat tu utakmicu među live rezultate
                    //!!!!!VAŽNOOOOO-> FORMAT OVOG OBJEKTA U PUBSUBU MORA ODGOVARATI FORMATU KAKO ĆE IZGLEDATI STRUKTURA PODATAKA U SUBSCRIPTIONU->
                    /*struktura podataka je uvijek(kao i kod querya i mutacija)
                    NAZIV_SUBSCRIPTIONA{
                      fiield1
                      field2
                      filed3
                      ....
                    } 
                    to je potrebno kako bi resolveri u povratnom tipu od mutacije mogli resolvati fieldove odnosno u ovom sklučaju da se mogu resolvati fieldoci od utakmice sa podacima koje im vratimo u async iteratoru od pubsuba
                    vjv je ista stvar kod querya i mutacija u resolverima samo što tamo vraćamo samo objekt sa propertisima bez imena mutacije i querya jer ga bice resolver tamop automatski pošalje
                    OVDE NEMAMO RESOLVE FUNKCIJU NEGO SUBSCRIBU FUNKCIJU*/ 
                      novautakmica:data
                    });
                }
                else {
                  pubsub.publish(PROMJENA_STATUSA,{
                    promjenastatusa:{
                      broj_utakmice:args.broj_utakmice,
                      status:args.status
                    }
                  });
                  pubsub.publish(PROMJENA_STATUSA_UTAKMICE,{
                    statusutakmice:{
                      broj_utakmice:args.broj_utakmice,
                      status:args.status
                    }
                  })
                }
                return args.status;
              }
              else {
                nodelogger.error('Greška u autorizaciji kod ažuriranja statusa utakmice');
                throw(new Error('Niste autorizirani za zadanu operaciju'));
              }
        } catch (error) {
          nodelogger.error('Greška kod azuriranja statusa utakmice '+error);
          throw(error);
        }
      
      }
    },
    azurirajvrijeme:{
      type:GraphQLBoolean,
      args:{
        minuta:{type: new GraphQLNonNull(GraphQLInt)},
        broj_utakmice:{type:new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
          return models.utakmica.update({minuta:args.minuta},{
            where:{
              broj_utakmice:args.broj_utakmice
            }
          }).then(()=>{
            pubsub.publish(PROMJENA_VREMENA,{
              promjenavremena:{
                broj_utakmica:args.broj_utakmice,
                minuta:args.minuta
              }
            });
            pubsub.publish(PROMJENA_VREMENA_UTAKMICE,{
              minutautakmice:{
                broj_utakmica:args.broj_utakmice,
                minuta:args.minuta
              }
            })
            return true
          }).catch((error)=>{
            nodelogger.error('Greška kod azuriranja vremena utakmice '+error);
            throw(error);
          })
        }
        else {
          nodelogger.error('Greška u autorizaciji kod ažuriranja vremena utakmice');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    },
    zavrsiutakmicu:{//kada ide zavrsiti utakmicu onda korisnik unosi ocjene sudaca i postavlja se i konacni rezultat utakmice i status na kraj
      type:GraphQLString,//vratit broj utakmice koja je zavrsena
      args:{
        broj_utakmice:{type:new GraphQLNonNull(GraphQLString)},
        sudac1_ocjena:{type:new GraphQLNonNull(GraphQLFloat)},
        sudac2_ocjena:{type:GraphQLFloat}
      },
      resolve(parent,args,context){
        if(context.req.session.user_id)
        {
            return models.utakmica.update({
              sudac1_ocjena:args.sudac1_ocjena,
              sudac2_ocjena:args.sudac2_ocjena,
            },{
              where:{
                broj_utakmice:args.broj_utakmice
              }
            }).then((data)=>{
              context.res.clearCookie('user_sid',{//BRISANJE COOKIEJA U BROWSERU
                path: '/',
                httpOnly: true,
                domain:'localhost',
                sameSite:'lax',
                secure:false
            });
            context.req.session.destroy();//IZBRISE SESIJU IZ MEMORY STOREA
            pubsub.publish(PROMJENA_STATUSA,{
              promjenastatusa:{
                broj_utakmice:args.broj_utakmice,
                status:6//makni rezultat s prikaza
              }
            });
            pubsub.publish(PROMJENA_STATUSA_UTAKMICE,{
              statusutakmice:{
                broj_utakmice:args.broj_utakmice,
                status:6
              }
            })
            return args.broj_utakmice;
            }).catch((error) => {
              nodelogger.error('Greška kod zavrsavanja utakmice '+error);
              throw(error);
            })
        }
        else {
          nodelogger.error('Greška u autorizaciji kod zavrsavanja utakmice');
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
       
      }
    },
    login:{//kod logiranja provjera unesenih usernamea i passworda
      type:SluzbenaOsoba,//vrati podatke osobe koja se logirala, npr za ispisat poruku dobrodoslice mozda
      args:{
        username:{type:new GraphQLNonNull(GraphQLString)},
        password:{type:new GraphQLNonNull(GraphQLString)}
      },
      resolve: async(parent,args,context)=>{//u contextu nam se nalazi req objekt kojem pristupamo
        try {
       const user= await models.korisnici.findOne({
          include:{
            model:models.sluzbenoosoblje
          },
          where:{
            username:args.username
          }
        });
        if(!user)//ako nema korisnika s tim usernameom
        {
          throw(new Error('Nije pronađen korisnik sa zadanim korisničkim imenom'));//ovo će napravit graphql error s ovim messageom
        }
        else
        {//postoji korisnik s tim username-> provjerit password
          if(await bcrypt.compare(args.password,user.password))
          {//dobar username i password-> propustimo ga dalje
            context.req.session.user_id=user.maticni_broj;//radimo sesiju
            return {//ovo će vratiti podatke o korisniku koji se logirao
              maticni_broj:user.sluzbenoosoblje.maticni_broj,
              ime:user.sluzbenoosoblje.ime,
              prezime:user.sluzbenoosoblje.prezime
            };
          }
          else throw(new Error('Netočna lozinka'));//ovo će napravit graphql error s ovim messageom
        }   
      } catch (error) {
          nodelogger.error('Greska prilikom logiranja'+error);
          throw(error);
      }
      }
    },
    izbrisidogadaj:{
      type:DogadajiUtakmice,//vratimo id izbrisanog dogadaja+tip izbrisanog dogadaja da znamo je li treba promijenit rezultat na frontnedu
      args:{
        dogadaj_id:{type:new GraphQLNonNull(GraphQLInt)}
      },
      resolve:async(parent,args,context)=>{
        try {
          if(context.req.session.user_id)
          {
            //1) dohvatit podatke o dogadaju kojeg brisemo da znamo koju statistiku treba dekrementirat
            const spremljenidogadaj=await models.dogadajiutakmice.findOne({
              where:{
                id:args.dogadaj_id
              }
            });
            await models.dogadajiutakmice.destroy({
              where:{
                id:args.dogadaj_id
              }
            });
            pubsub.publish(BRISI_DOGADAJ_UTAKMICE,{
              brisidogadajutakmice:{
                broj_utakmice:spremljenidogadaj.broj_utakmice,
                id:args.dogadaj_id
              }
            });
            if(!(spremljenidogadaj.dogadaj_id===15||spremljenidogadaj.dogadaj_id===16))//za timeout ne treba nikakvu statistiku mijenjat
            {
              const clan=await models.clanovitima.findOne({
                where:{
                  maticni_broj:spremljenidogadaj.maticni_broj
                }
              });
              
              const dogadaj=await models.dogadaj.findOne({
                where:{
                  id:spremljenidogadaj.dogadaj_id
                }
              });
              if(dogadaj.tip===1&&clan.rola===1)//promjena rezultata od strane igraca
              {
                //za događaje s promjenom rezultata updateamo i rezultat utakmice
                if(spremljenidogadaj.tim===1)//uvećali smo domaci rezultat-> smanjimo domaće
                {
                  //sequelize increment/decrement metode vraćaju 3D matricu u kojoj se nalazi uvećani model
                  const utakmica=await models.utakmica.decrement('rezultat_domaci',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice}});
                  pubsub.publish(PROMJENA_REZULTATA,{//mijenja se rezultat kod live praćenja
                    promjenarezultata:{
                      broj_utakmice:spremljenidogadaj.broj_utakmice,
                      rezultat_domaci:utakmica[0][0][0].rezultat_domaci,
                      rezultat_gosti:utakmica[0][0][0].rezultat_gosti
                    }
                  })
                  pubsub.publish(PROMJENA_REZULTATA_UTAKMICE,{
                    rezultatutakmice:{
                      broj_utakmice:spremljenidogadaj.broj_utakmice,
                      rezultat_domaci:utakmica[0][0][0].rezultat_domaci,
                      rezultat_gosti:utakmica[0][0][0].rezultat_gosti
                    }
                  })
                }
                else{ 
                  const utakmica=await models.utakmica.decrement('rezultat_gosti',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice}});
                  pubsub.publish(PROMJENA_REZULTATA,{//mijenja se rezultat kod live praćenja
                    promjenarezultata:{
                      broj_utakmice:spremljenidogadaj.broj_utakmice,
                      rezultat_domaci:utakmica[0][0][0].rezultat_domaci,
                      rezultat_gosti:utakmica[0][0][0].rezultat_gosti
                    }
                  })
                  pubsub.publish(PROMJENA_REZULTATA_UTAKMICE,{
                    rezultatutakmice:{
                      broj_utakmice:spremljenidogadaj.broj_utakmice,
                      rezultat_domaci:utakmica[0][0][0].rezultat_domaci,
                      rezultat_gosti:utakmica[0][0][0].rezultat_gosti
                    }
                  })
                }
                if(spremljenidogadaj.dogadaj_id===5)//gol sedmerac-> increment i gol i sedmerac pogodak stupce
                {
                  await models.igracutakmica.decrement(['golovi','pokusaji','sedmerac_golovi','sedmerac_pokusaji'],{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
                }
                else {
                  //gol-> increment samo gol
                  await models.igracutakmica.decrement(['golovi','pokusaji'],{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
                }
              }
              else if(dogadaj.tip===1&&clan.rola===2)//pogodak od golmana-> ima samo 1 rubriku za to
              {
                  //za događaje s promjenom rezultata updateamo i rezultat utakmice
                  if(spremljenidogadaj.tim===1)//uvećali smo domaci rezultat-> smanjimo domaće
                  {
                    const utakmica=await models.utakmica.decrement('rezultat_domaci',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice}});
                    pubsub.publish(PROMJENA_REZULTATA,{//mijenja se rezultat kod live praćenja
                      promjenarezultata:{
                        promjenarezultata:{
                          broj_utakmice:spremljenidogadaj.broj_utakmice,
                          rezultat_domaci:utakmica[0][0][0].rezultat_domaci,
                          rezultat_gosti:utakmica[0][0][0].rezultat_gosti
                        }
                      }
                    })
                    pubsub.publish(PROMJENA_REZULTATA_UTAKMICE,{
                      rezultatutakmice:{
                        broj_utakmice:spremljenidogadaj.broj_utakmice,
                        rezultat_domaci:utakmica[0][0][0].rezultat_domaci,
                        rezultat_gosti:utakmica[0][0][0].rezultat_gosti
                      }
                    })
                  }
                  else{
                    const utakmica=await models.utakmica.decrement('rezultat_gosti',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice}});
                    pubsub.publish(PROMJENA_REZULTATA,{//mijenja se rezultat kod live praćenja
                      promjenarezultata:{
                        promjenarezultata:{
                          broj_utakmice:spremljenidogadaj.broj_utakmice,
                          rezultat_domaci:utakmica[0][0][0].rezultat_domaci,
                          rezultat_gosti:utakmica[0][0][0].rezultat_gosti
                        }
                      }
                    })
                    pubsub.publish(PROMJENA_REZULTATA_UTAKMICE,{
                      rezultatutakmice:{
                        broj_utakmice:spremljenidogadaj.broj_utakmice,
                        rezultat_domaci:utakmica[0][0][0].rezultat_domaci,
                        rezultat_gosti:utakmica[0][0][0].rezultat_gosti
                      }
                    })
                  }
                await models.golmanutakmica.decrement(['golovi','pokusaji'],{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===2)//obrana-> samo za golmane
              {
                await models.golmanutakmica.decrement('obrane_ukupno',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===3&&clan.rola===1)//promasaj igraca
              {
                await models.igracutakmica.decrement('pokusaji',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if((spremljenidogadaj.dogadaj_id===3||spremljenidogadaj.dogadaj_id===7)&&clan.rola===2)//promasaj sedmerca ili obicni promasaj od golmana-> nema odvojene rubrike
              {
                await models.golmanutakmica.decrement('pokusaji',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===4)//primljen pogodak-> samo golman
              {
                await models.golmanutakmica.decrement('primljeni_ukupno',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===6)//obrana sedmerca-> samo golman
              {
                await models.golmanutakmica.decrement('sedmerac_obrane',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===7&&clan.rola===1)//sedmerac promasaj od strane igraca
              {
                await models.igracutakmica.decrement(['pokusaji','sedmerac_pokusaji'],{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===8)//sedmerad primljen-> samo za golmana
              {
                await models.golmanutakmica.decrement('sedmerac_primljeni',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===9&&clan.rola===1)//iskljucenje igraca
              {
                await models.igracutakmica.decrement('iskljucenja',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===9&&clan.rola===2)//iskljucenje golmana
              {
                await models.golmanutakmica.decrement('iskljucenja',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===10)//asistencija-> samo za igraca
              {
                await models.igracutakmica.decrement('asistencije',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===11)//tehnicka greska-> samo za igraca
              {
                await models.igracutakmica.decrement('tehnicke',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===12&&clan.rola===1)//zuti karton igrac
              {
                await models.igracutakmica.decrement('zuti',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===12&&clan.rola===2)
              {
                await models.golmanutakmica.decrement('zuti',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===12&&clan.rola===3)//zuti karton stozer
              {
                await models.stozerutakmica.decrement('zuti',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===13&&clan.rola===1)//zuti karton igrac
              {
                await models.igracutakmica.decrement('crveni',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===13&&clan.rola===2)
              {
                await models.golmanutakmica.decrement('crveni',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===13&&clan.rola===3)//zuti karton stozer
              {
                await models.stozerutakmica.decrement('crveni',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===14&&clan.rola===1)//zuti karton igrac
              {
                await models.igracutakmica.decrement('plavi',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===14&&clan.rola===2)
              {
                await models.golmanutakmica.decrement('plavi',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              else if(spremljenidogadaj.dogadaj_id===14&&clan.rola===3)//zuti karton stozer
              {
                await models.stozerutakmica.decrement('plavi',{where:{broj_utakmice:spremljenidogadaj.broj_utakmice,maticni_broj:spremljenidogadaj.maticni_broj}});
              }
              //promjenit statistiku ovisno o roli
              if(clan.rola===1)
              {
                const igrac_statistika=await models.igracutakmica.findOne({
                  where:{
                    broj_utakmice:spremljenidogadaj.broj_utakmice,
                    maticni_broj:spremljenidogadaj.maticni_broj
                  }
                })
                pubsub.publish(PROMJENA_STATISTIKE_IGRACA,{
                  statistikaigrac:igrac_statistika
                })
              }
              else if(clan.rola===2)
              {
                const golman_statistika=await models.golmanutakmica.findOne({
                  where:{
                    broj_utakmice:spremljenidogadaj.broj_utakmice,
                    maticni_broj:spremljenidogadaj.maticni_broj
                  }
                })
                pubsub.publish(PROMJENA_STATISTIKE_GOLMANA,{
                  statistikagolman:golman_statistika
                })
              }
              else {
                const stozer_statistika=await models.stozerutakmica.findOne({
                  where:{
                    broj_utakmice:spremljenidogadaj.broj_utakmice,
                    maticni_broj:spremljenidogadaj.maticni_broj
                  }
                })
                pubsub.publish(PROMJENA_STATISTIKE_STOZERA,{
                  statistikastozer:stozer_statistika
                })
              }
            }
            //obavijestit statistiku,promjenu rezultata i dogadaje u subscriptionsima
            return {//vracamp id izbrisanog dogadaj, dogadaj_id iz kojeg cemo u resokverima moc queryat tip dogadaja i tim da znamo koji rezultat treba umanjit
              id:args.dogadaj_id,
              dogadaj_id:spremljenidogadaj.dogadaj_id,
              tim:spremljenidogadaj.tim
            }
          }
          else throw(new Error('Niste autorizirani za zadanu operaciju'));
        } catch (error) {
          nodelogger.error('Greska kod brisanja dogadaja '+error);
          throw(error);
        }
      }
    },
    spremisliku:{
      type:GraphQLString,//vrati filename od spremljenog filea-> slike u ovom slučaju
      args:{
        file:{type:new GraphQLNonNull(GraphQLUpload)}
      },
      resolve:async (parent,args,context)=>{
        if(context.req.session.user_id)//SAMO ADMINI MOGU UPLOADAT SLIKE KLUBOVA
        {
          try {
            const {filename, mimetype, createReadStream}=await args.file;//primljeni file u multipart bodyu od requesta se predstavlja prekp promisea koji će nakon što ga middleware obradi resolvati sa objektom koji ima propertiese na lijevoj strani jednakosti
            const stream=createReadStream();//dobivamo ovu funkciju nakon što se gornji promise resolva i pomoćui nje kreiramo Readable stream-> ista funkcija se nalazi i u node.js file system(fs) modulu
            //READABLE STREAM?-> STREAM IZ KOJEG ČITAMO ODREĐENE PODATKE(npr kao i stdout)->U OVOM SLUČAJU JE READABLE JER U NJEGA ČITAMO FILE IZ REQUEST BODYA
            //nakon što pročitamo file mi ga želimo ZAPISATI-> UMJESTO READABLE STREAMA POTREBAN NAM JE WRITEABLE STREAM KOJI ĆE ZAPISATI ONO ŠTO JE READABLE PROČITAO
            //-> RJEŠENJE-> PIPEAMO READABLE STREAM U WRITABLE STREAM-> NA TAJ NAČIN PREUMJSERAVAMO PROČITANE PODATKE U WRITEBALE STREAM KOJI ĆE IH ZAPISATI
            //Piping is a mechanism where we provide the output of one stream as the input to another stream
            stream.pipe(createWriteStream(config.images.question_images_storage)).on('finish',()=>{//poziva se nakon što se zatvroi stream
              nodelogger.info('File uspješno upisan');
            }).on('error',(error)=>{
              throw(error);
            })
            //SPREMI U BAZU PODATKE O PATHU DO SLIKE
            return filename;//vrati ime spremljenog filea
          } catch (error) {
            nodelogger.error('Greška prilikom spremanja slike '+error);
            throw(error);
          }
        }
        else {
          nodelogger.error('Greška u autorizaciji prilikom spremanja slike '+error);
          throw(new Error('Niste autorizirani za zadanu operaciju'));
        }
      }
    }

  }
})
module.exports=new GraphQLSchema({//definicija sheme koju stavljamo u express graphql server
  query:RootQuery,
  mutation:Mutation,
  subscription:RootSubscriptions
})

//PITANJE???-> OVDE LOADAMO SAMO QUERYE I MUTACIJE A NIGDI NE LOADAMO GORNJE NAVEDENE OBJEKTNE TIPOVE SHEME I SKALARANE TIPOVE, KAKO GRAPHQL ZNA ZA NJIH??
/*GRAPHQL SHEMA SE MOŽE PREZNWTIRAT NA 3 NAČINA:
1)The GraphQL Schema Definition Language, or SDL,NPR;
type Author {
  id: Int!
  firstName: String
  lastName: String
  posts: [Post]
}type Post {
  id: Int!
  title: String
  author: Author
  votes: Int
}type Query {
  posts: [Post]
  author(id: Int!): Author
}-> OVO LOADAMO U GRAHPQL SERVER I TAKO ON ZNA ZA TIPOVE

2)The GraphQL introspection query result-> POMOĆU NJEGA SAZNAJEMO KAKO NAM IZGLEDA SHEMA I TIPOVI NA SRVERU TAKO 
ŠTO ŠALJEMO POSEBNE INTROSPECTION QUERYE S FILEDSIMA KOJI NAS ZNAIMAJU

3)GraphQL.js GraphQLSchema object-> ovde KORIPTENI
Last but not least, we have the objects that the JavaScript reference implementation of GraphQL uses to store information about the schema
. It’s a great intermediate representation, so it’s often the medium used to communicate between different JavaScript tools.
-> VEZAN UZ JAVASCRIPT JEZIK, PREDSTAVLJA TIPOVE SHEME KAO OBJEKTE I PREKO NJIH KOMUNICIRA I TRAŽI RESOLVERE I ZADANE TIPOVE U QUERYIMA I MUTACIJAMA
This representation of the schema makes it the easiest to manipulate the objects directly, and write functions that generate types for you,
 but it’s not as convenient as the SDL for writing schemas by hand.*/