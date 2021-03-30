const { Op } = require("sequelize");
const {nodelogger}=require('../loaders/logger.js');
const graphql=require('graphql');
const models=require('../models');//u njemu se nalaze svi loadani modeli bitni za resolvere
const {GraphQLObjectType,
        GraphQLInt,
        GraphQLScalarType,
        GraphQLString,
        GraphQLNonNull,
        GraphQLFloat,
        GraphQLSchema,
        GraphQLList,
        GraphQLBoolean,
        Kind}=graphql;//KIND SADRŽI SVE TIPOVE VARIJABLI AKO JE POTREBNO U RESOLVERIMA PROVJERAVAT JELI PRIMLJENA VARIJALBA ISPRAVNOG TIPA
const { GraphQLUpload } = require('graphql-upload');//OVO JE TIP KOJI NAM OMOGUĆAVA RUKOVANJE S FILEOVIMA,SVUGDJE DI KORISTIMO FILEOVE KAO TIP STAVIMO OVAJ TIP

//Definicija našeg vlastitog skalarnog tipa,datum nije defaultni skalarni tip
const Datum = new GraphQLScalarType({
name: 'Datum',
description: 'Format datuma u bazi 1984-10-08 15:05:22+01 pretvaramo u JS date u oba smjera',
serialize(value){//format datuma koji će ići u response,priprema format za slanje klijentu
  let date=new Date(Date.parse(value));
  let date_format=date.getDate().toString()+'.'+(date.getMonth()+1).toString()+'.'+date.getFullYear().toString();
  return date_format;
},
parseValue(value)//i parse value i parseLiteral parsiraju DOLAZNE/INPUT PODATKE NPR U MUTACIJAMA,RAZLIKA: parseValue: parsira podatke dobivene u JSON formatu
{
  return new Date(Date.parse(ast.value))
},   //  parseLiteral: parsira vriiednosti dobivene u AST(stablo,ugnijezdeni) formatu od graphqla-> TAKO IH PRIMAMO U MUTACIJAMA
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
  parseValue(value)//i parse value i parseLiteral parsiraju DOLAZNE/INPUT PODATKE NPR U MUTACIJAMA,RAZLIKA: parseValue: parsira podatke dobivene u JSON formatu
  {
    return new Date(Date.parse(ast.value))
  },   //  parseLiteral: parsira vriiednosti dobivene u AST(stablo,ugnijezdeni) formatu od graphqla
  parseLiteral(ast){
    return new Date(Date.parse(ast.value))
  }
});
const MoguciDogadaji=new GraphQLObjectType({
  name:'MoguciDogadaji',
  fields:()=>({     //!!!!!!Stavljamo u funkciju jer kod asocijacija između elemenata moramo vodit računa o redoslijedu definiranja tipova pa ako oba tipa imaju asocijaciju onda kojin god 
    //redolsijedom definirali objekte bit ce nedefiniran jedan od tih clanova-> zato ih stavimo u funkciju koja će se pozvat i u tom trenutku pozivanja će svi tipovi već bili učitani i definirani
    id:{type: GraphQLInt},
    naziv:{type:new GraphQLNonNull(GraphQLString)},
    tip:{type: new GraphQLNonNull(GraphQLInt)}
  })
})
const Natjecanje=new GraphQLObjectType({
  name:'Natjecanje',
  fields:()=>({
    id:{type:GraphQLInt},
    naziv:{type:new GraphQLNonNull(GraphQLString)},
    sezona:{type:new GraphQLNonNull(GraphQLString)},
  })
})
const Dvorana=new GraphQLObjectType({
  name:'Dvorana',
  fields:()=>({
  id:{type:GraphQLInt},
  dvorana:{type:new GraphQLNonNull(GraphQLString)},
  mjesto:{type:new GraphQLNonNull(GraphQLString)}
  })
})
const SluzbenaOsoba=new GraphQLObjectType({
  name:'SluzbenaOsoba',
  fields:()=>({
    maticni_broj:{type:new GraphQLNonNull(GraphQLString)},
    ime:{type:new GraphQLNonNull(GraphQLString)},
    prezime:{type:new GraphQLNonNull(GraphQLString)},
    datum_rodenja:{type:Datum}
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
    prosjecna_ocjena:{type:GraphQLFloat}
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
      rola:{type:GraphQLInt}
  })
})
const Klub=new GraphQLObjectType({
  name:'Klub',
  fields:()=>({
    id:{type:GraphQLInt},
    naziv:{type:new GraphQLNonNull(GraphQLString)},
    drzava:{type:GraphQLString},
    grad:{type:GraphQLString},
    osnutak:{type:GraphQLString}
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
        try {
          return models.clanovitima.findOne({
            where:{
              rola:1,//dodatnui osigurac iako je maticni broj sam dovoljan
              maticni_broj:parent.maticni_broj//maticni broj koji je sadrzan u retku tablice za statistiku igraca i koji će se vratiti iz resolvera za ispis statistike svih igraca
            }
          })
        } catch (error) {
          nodelogger.error('Greška u dohvaćanju clana tima unutar IgracStatistika objekta '+error);
          throw(error);
        }
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
        try {
          return models.clanovitima.findOne({
            where:{
              maticni_broj:parent.maticni_broj//maticni broj ce doci iz resolvera od ispisa statistike cijelog tima iz niza objekata koji sadrze podatke o statistici golmana medu kojima se nalazi i maticni_broj
            }
          })
        } catch (error) {
          nodelogger.error('Greška u dohvaćanju clana tima unutar GolmanStatistika objekta '+error);
          throw(error);
        }
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
        try {
          return models.clanovitima.findOne({
            where:{
            maticni_broj: parent.maticni_broj
            }
          });
        } catch (error) {
          nodelogger.error('Greška u dohvaćanju clana tima unutar StozerStatistika objekta '+error);
          throw(error);
        }
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
        try {
          return models.igracutakmica.findAll({
            where:{
              broj_utakmice:parent.broj_utakmice,//iz parent objekti koji smo dobili iz resolvera u queryu koji samo prosljeduje primljene parametre
              klub_id:parent.klub_id//bitna i utakmica i klub za koji igra(jer su 2 kluba na toj utakmici)
            }
          })
        } catch (error) {
          nodelogger.error('Greška u dohvaćanju statistike igrača unutar TimStaitstika objekta '+error);
          throw(error);
        }
      }
    },
    golmani:{
      type:new GraphQLList(GolmanStatistika),
      resolve(parent,args){
        try {
          return models.golmanutakmica.findAll({
            where:{
              broj_utakmice:parent.broj_utakmice,
              klub_id:parent.klub_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška u dohvaćanju staitstike golmana unutar TimStatistika objekta '+error);
          throw(error);
        }
      }
    },
    stozer:{
      type:new GraphQLList(StozerStatistika),
      resolve(parent,args){
        try {
          return models.stozerutakmica.findAll({
            where:{
              broj_utakmice:parent.broj_utakmice,
              klub_id:parent.klub_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška u dohvaćanju statistike stožera unutar TimStatistika objekta '+error);
          throw(error);
        }
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
    sudac1_ocjena:{type:GraphQLFloat},
    sudac2_ocjena:{type:GraphQLFloat},
    status:{type:GraphQLInt},
    natjecanje:{//NESTAMO TIP NATJECANJE I NJEGA RESOLVAMO PREKO parent.natjecanje_id-> kod dohvata iz baze graphql će ono ptodobije u bazi usporediti sa shemom ovog tipa pa će pomoću tog ida iz baze resolvati i ove nestane objekte
      type:Natjecanje,//parent dolazi u igru kod nestanja više tipova-> npr ako je resolver unutar domaci_id od utakmice onda će resolver koji ide otrkiti
      //koji je to klub moći pristupiti idu od tog tima u utakmici preko parent.tim_id jer je utakmica parent objekt od ugnijezden tim objekta
      resolve(parent,args){
        try {
          return models.natjecanje.findOne({
            where:{
              id:parent.natjecanje_id
            }
          });
        } catch (error) {
          nodelogger.error('Greška kod dohvaćanja natjecanja unutar Utakmica objekta '+error);
          throw(error);
        }
      }
    },
    lokacija:{//DA BI OVI DIO BIO USPJEŠAN ONO ŠTO SE VRATI IZ RESOLVER MORA ZADOVOLJVATI SHEMU OD TIPA DVORNANA INAČE ĆE BITI GREŠKA
      type:Dvorana,
      resolve(parent,args){
        try {
          return models.mjestodvorana.findOne({
            where:{
              id:parent.mjesto_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvaćanja dvorane unutar Utakmica objekta '+error);
          throw(error);
        }
      }
    },
    nadzornik:{
      type:SluzbenaOsoba,
      resolve(parent,args){//POVEZANOSTI 1:N I VEZE MEĐU ELEMENTIMA DEFINIRAMO NA OVAJ NAČIN, NIKAD U SEQUELIZE NE ODREĐUJEMO ATRIBUTE KOJE DOHVAĆAMO NEGO DOHVAĆAMO SVE DA SU U SKLADU SA SHEMOM A ONDA U QUERY SPECIFICARMO KOJA POLJA ŽELIMO UKLJUČITI
        try {
          return models.sluzbenoosoblje.findOne({
            where:{
              maticni_broj:parent.nadzornik_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvaćanja ndozrnika unutar Utakmica objekta '+error);
          throw(error);
        }
      }
    },
    lijecnik:{
      type:SluzbenaOsoba,
      resolve(parent,args){
        try {
          return models.sluzbenoosoblje.findOne({
            where:{
              maticni_broj:parent.lijecnik_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvaćanja liječnika unutar Utakmica objekta '+error);
          throw(error);
        }
      }
    },
    zapisnicar:{
      type:SluzbenaOsoba,
      resolve(parent,args){
        try {
          return models.sluzbenoosoblje.findOne({
            where:{
              maticni_broj:parent.zapisnicar_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvaćanja zapisničara unutar Utakmica objekta '+error);
          throw(error);
        }
      }
    },
    mjeracvremena:{
      type:SluzbenaOsoba,
      resolve(parent,args){
        try {
          return models.sluzbenoosoblje.findOne({
            where:{
              maticni_broj:parent.mjvremena_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvaćanja mjeraca vremena unutar Utakmica objekta '+error);
          throw(error);
        }
      }
    },
    sudac1:{
      type:Sudac,
      resolve(parent,args){
        try {
          return models.suci.findOne({
            where:{
              maticni_broj:parent.sudac1_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvaćanja sudca1 unutar Utakmica objekta '+error);
          throw(error);
        }
      }
    },
      sudac2:{
        type:Sudac,
        resolve(parent,args){
          try {
            return models.suci.findOne({
              where:{
                maticni_broj:parent.sudac2_id
              }
            })
          } catch (error) {
            nodelogger.error('Greska kod dohvaćanja sudca2 unutar Utakmica objekta '+error);
            throw(error);
          }
        }
      },
      domaci:{
        type:Klub,
        resolve(parent,args){
          try {
            return models.klub.findOne({
              where:{
                id:parent.domaci_id
              }
            })
          } catch (error) {
            nodelogger.error('Greška kod dohvaćanja domaćeg kluba unutar Utakmica objekta '+error);
            throw(error);
          }
        }
      },
      gosti:{
        type:Klub,
        resolve(parent,args){
          try {
            return models.klub.findOne({
              where:{
                id:parent.gosti_id
              }
            })
          } catch (error) {
            nodelogger.error('Greska kod dohvaćanja gostujućeg kluba unutar Utakmica objekta '+error);
            throw(error);
          }
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
        try {
          return models.dogadaj.findOne({
            where:{
              id:parent.dogadaj_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvata događaja unutar DogadajiUtakmice objekta '+error);
          throw(error);
        }
      }
    },
    akter:{
      type:ClanTima,
      resolve(parent,args){
        try {
          return models.clanovitima.findOne({
            where:{
              maticni_broj:parent.maticni_broj
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvata clana tima unutar DogadajiUtakmice objekta '+error);
          throw(error);
        }
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
        try {
          return models.clanovitima.findOne({
            where:{
              maticni_broj:parent.maticni_broj
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvata clana tima unutar GolPozicija objekta '+error);
          throw(error);
        }
      }
    },
    dogadaj:{
      type:MoguciDogadaji,
      resolve(parent,args){
        try {
          return models.dogadaj.findOne({
            where:{
              id:parent.dogadaj_id
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvata događaja unutar GolPOzicija objekta '+error);
          throw(error);
        }
      }
    }
  })
})
const RootQuery=new GraphQLObjectType({
  name:'Svi_queryi_za_entrypoint',
  fields:{//ovde ne triba funkcija jer ih sve ovde definiramo
    //fileds=entry pointovi za sve querye servera
    utakmica:{//DOHVAT PODATAKA VEZANIH ZA UTAKMICU-> za dohvat generalInfo i osoba utakmice isti ovi query samo specificiramo atribute koji nam trebaju
      type:Utakmica,
      args:{broj_utakmice:{type:GraphQLString}},//specificiramo sve argumente querya
      resolve(parent,args){
        try {
          return models.utakmica.findOne({
            where:{
              broj_utakmice:args.broj_utakmice
            }
          }); 
        } catch (error) {
          nodelogger.error('Greška kod dohvata podataka utakmice '+error);
          throw(error);
        }
      }
      //Nije potrebno da resolver bude async i radimo await u njemu jer će graphql sam čekati da dobije neki odgovor uvreturnu koji može usporediti s danom shemom i tipom tog querya
      //Ako oćemo nešto ispisivat unutar resolvera onda su nam bitni promisesi i onda koristimo ili .then ili async await
      /*Notice that while the resolver function needs to be aware of Promises, the GraphQL query does not.
       It simply expects the human field to return something which it can then ask the name of. 
       During execution, GraphQL will wait for Promises, Futures, and Tasks to complete before continuing
        and will do so with optimal concurrency*/
    },
    natjecanja:{//dohvat svih najtecanja kod odabira
      type:new GraphQLList(Natjecanje),
      resolve(parent,args){
        try {
          return models.natjecanje.findAll({});
        } catch (error) {
          nodelogger.error('Greška kod dohvata svih najtecanja '+error);
          throw(error);
        }
      }
    },
    dvorane:{
      type:new GraphQLList(Dvorana),
      resolve(parent,args){
        try {
          return models.mjestodvorana.findAll({});
        } catch (error) {
          nodelogger.error('Greška kod dohvaćanja svih dvorana '+error);
          throw(error);
        }
      }
    },
    nadzornici:{//dohvat svih nadzornika
      type:new GraphQLList(SluzbenaOsoba),
      resolve(parent,args){
        try {
          return models.sluzbenoosoblje.findAll({
            where:{
              rola:1
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvata svih nadzornika '+error);
          throw(error);
        }
      }
    },
    lijecnici:{
      type:new GraphQLList(SluzbenaOsoba),
      resolve(parent,args){
        try {
          return  models.sluzbenoosoblje.findAll({
            where:{
              rola:4
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvata svih liječnika '+error);
          throw(error);
        }
      }
    },
    zapisnicari:{
      type:new GraphQLList(SluzbenaOsoba),
      resolve(parent,args){
        try {
          return  models.sluzbenoosoblje.findAll({
            where:{
              rola:2
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvata svih zapisničara '+error);
          throw(error);
        }
      }
    },
    mjeracivremena:{
      type:new GraphQLList(SluzbenaOsoba),
      resolve(parent,args){
        try {
          return  models.sluzbenoosoblje.findAll({
            where:{
              rola:3
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvata svih mjerača vremena '+error);
          throw(error);
        }
      }
    },
    suci:{
      type:new GraphQLList(Sudac),
      resolve(parent,args){
        try {
          return models.suci.findAll({})
        } catch (error) {
          nodelogger.error('Greška kod dohvata svih sudaca '+error);
          throw(error);
        }
      }
    },
    klubovi:{
      type:new GraphQLList(Klub),
      args:{natjecanje_id:{type:GraphQLInt}},//dohvat SAMO ONIH KLUBOVA IZ ODABRANOG NATJECANJA
      resolve(parent,args){
        try {
          return models.klub.findAll({
            include:{
              model:models.natjecanje,
              as:'kluboviodnatjecanja',
              through: { attributes: [] },
              where:{
                id:args.natjecanje_id
              }
            }
          })
        } catch (error) {
          nodelogger.error('Greška kod dohvata svih klubova odabranog natjecanja '+error);
          throw(error);
        }
      }
    },
    dogadaji:{//dohvat svih mogućih događaja koji se mogu dogoditi
      type:new GraphQLList(MoguciDogadaji),
      resolve(parent,args){
        try {
          return models.dogadaj.findAll({});
        } catch (error) {
          nodelogger.error('Greška kod dohvata svih mogućih događaja '+error);
          throw(error);
        }
      }
    },
    timclanovi:{//vraća sve moguće članove tima od igrača i golmana do stožera
      type:Tim,
      args:{klub_id:{type:GraphQLInt}},
      resolve(parent,args){//OVAJ RESOLVER ĆE VRATITI ID OD KLUBA U OBJECT TYPE TIM U KOJEM MU MOŽEMO PRISTUPATI I KOJI ĆE POMOĆU NJEGA DOBITI SVE POTREBNE CLANOVE TIMA
        return {//NIJE POTREBNO TRY CATCH ERROR HANDLEANJE JER NEMA SINKRONIH OPERAIJA+ KAD SE THROWA ERROR UNUTAR TIM OBJEKTA ON SE NEĆE PROPAGIRATI NAZAD U OVAJ RESOLVER NEGO ĆE IĆI ODMAH NA ERROR HANDLEANJE
          //ODNOSNO PRVI RESOLVERI KAD SE IZVRSE ONI SU GOTOVI I NEMA VIŠE POVRATKA U NJIH, ERROR HANDLEANJE ĆE SE ODRADIT UNUTAR TIM OBJEKTA
          id:args.klub_id
        }
      }
    },
    timstatistika:{//vraća statistike igraca,golmana i stozera za određenu utakmicu od određenog kluba
      type:TimStatistika,
      args:{broj_utakmice:{type:GraphQLString},
            klub_id:{type:GraphQLInt}
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
      args:{broj_utakmice:{type:GraphQLString}},
      resolve(parent,args){
        try {
          return models.dogadajiutakmice.findAll({
            where:{
              broj_utakmice:args.broj_utakmice
            }
          })
        } catch (error) {
          nodelogger.error('Greska kod dohvata događaja utakmice '+error);
          throw(error);
        }
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
        broj_utakmice:{type:GraphQLString},
        kolo:{type:GraphQLInt},
        datum:{type:Datum},
        vrijeme:{type:Vrijeme},
        gledatelji:{type:GraphQLInt},
        natjecanje_id:{type:GraphQLInt},
        dvorana_id:{type:GraphQLInt},
        nadzornik_id:{type:GraphQLString},
        lijecnik_id:{type:GraphQLString},
        zapisnicar_id:{type:GraphQLString},
        mjvremena_id:{type:GraphQLString},
        sudac1_id:{type:GraphQLString},
        sudac2_id:{type:GraphQLString},
        timdomaci_id:{type:GraphQLInt},
        timgosti_id:{type:GraphQLInt}
      },
      resolve(parent,args){
        try {
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
          })
        } catch (error) {
          nodelogger.error('Greška kod spremanja utakmice '+error);
          throw(error);
        }

      }
    },
    spremitimzautakmicu:{//Potrebno je da mutacija barem nešto vrati pa makar to bilo null,ako želimo da vrati null onda definiramo NOVI SCALAR TYPE VOID KOJI JE UVIJEK NULL I NJEGA STAVIMO ZA TYPE
      type:GraphQLBoolean,//VRATIMO TRUE AKO JE USPJEŠNO
      args:{
        broj_utakmice:{type:GraphQLString},//niz maticnih brojava koji su stringovi
        klub_id:{type:GraphQLInt},
        igraci_id:{type:new GraphQLList(GraphQLString)},
        golmani_id:{type:new GraphQLList(GraphQLString)},
        trener_id:{type:GraphQLString},
        sluzpredstavnik_id:{type:GraphQLString},
        tehniko_id:{type:GraphQLString},
        fizio_id:{type:GraphQLString}
      },
      resolve:async (parent,args)=>{//ako nam treba async await sintaksa samo je dodamo na resolve funkciju
        try {
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
          await models.stozerutakmica.create({
            broj_utakmice:args.broj_utakmice,
            klub_id:args.klub_id,
            maticni_broj:args.trener_id
          });
          await models.stozerutakmica.create({
            broj_utakmice:args.broj_utakmice,
            klub_id:args.klub_id,
            maticni_broj:args.sluzpredstavnik_id
          });
          await models.stozerutakmica.create({
            broj_utakmice:args.broj_utakmice,
            klub_id:args.klub_id,
            maticni_broj:args.tehniko_id
          });
          await models.stozerutakmica.create({
            broj_utakmice:args.broj_utakmice,
            klub_id:args.klub_id,
            maticni_broj:args.fizio_id
          });
          return true;
        } catch (error) {
          console.log('Greška kod spremanja tima kluba za utakmicu '+error);
          throw(error);
        }
      }
    },
    spremidogadaj:{
      type:DogadajiUtakmice,//vrati dogadajID ako je uspjesno spremljen
      args:{
        broj_utakmice:{type:GraphQLString},
        vrijeme:{type:GraphQLString},
        klubgrb:{type:GraphQLInt},//domaci ili gostujuci tim
        maticni_broj:{type:GraphQLString},
        dogadaj_id:{type:GraphQLInt},
        domaci:{type:GraphQLInt},
        gosti:{type:GraphQLInt},
      },
      resolve(parent,args){
        try {
          return models.dogadajiutakmice.create({//AKO NE POŠALJEMO NEKI PARSMETAR U MUTACIJI ON ĆE PO DEFAULTU BITI NULL I SEQUELIZE GA NEĆE UOPĆE SPREMATI U QUERYU NEGO ĆE ON ZAUZET DEFAULT VRIJEDNOST
            vrijeme:args.vrijeme,
            tim:args.klubgrb,
            rez_domaci:args.domaci,
            rez_gosti:args.gosti,
            broj_utakmice:args.broj_utakmice,
            dogadaj_id:args.dogadaj_id,
            maticni_broj:args.maticni_broj
          });
        } catch (error) {
          nodelogger.error('Greška kod spremanja događaja '+error);
          throw(error);
        }
      }
    },
    spremigolpoziciju:{
      type:GolPozicija,//vrati id novokreirani ako je dobro sve
      args:{
        pozicija:{type:GraphQLInt},
        gol:{type:GraphQLBoolean},
        broj_utakmice:{type:GraphQLString},
        maticni_broj:{type:GraphQLString},
        dogadaj_id:{type:GraphQLInt}
      },
      resolve(parent,args){
        try {
          return models.pozicijegola.create({
            pozicija:args.pozicija,
            gol:args.gol,
            broj_utakmice:args.broj_utakmice,
            maticni_broj:args.maticni_broj,
            dogadaj_id:args.dogadaj_id
          })
        } catch (error) {
          nodelogger.error('Greška kod spremanja pozicije gola '+error);
          throw(error);
        }
      }
    },
    azurirajstatusutakmice:{
      type:GraphQLInt,//vrati postavljeni status
      args:{
        status:{type:GraphQLInt},
        broj_utakmice:{type:GraphQLString},
      },
      resolve(parent,args){
          return models.utakmica.update({status:args.status},{
            where:{
              broj_utakmice:args.broj_utakmice
            }
          }).then(()=>args.status).catch((error)=>{
            nodelogger.error('Greška kod azuriranja statusa utakmice '+error);
            throw(error);
          })
      }
    },
    zavrsiutakmicu:{//kada ide zavrsiti utakmicu onda korisnik unosi ocjene sudaca i postavlja se i konacni rezultat utakmice i status na kraj
      type:GraphQLString,//vratit broj utakmice koja je zavrsena
      args:{
        broj_utakmice:{type:GraphQLString},
        rez_domaci:{type:GraphQLInt},
        rez_gosti:{type:GraphQLInt},
        sudac1_ocjena:{type:GraphQLFloat},
        sudac2_ocjena:{type:GraphQLFloat}
      },
      resolve(parent,args){
          return models.utakmica.update({
            rezultat_domaci:args.rez_domaci,
            rezultat_gosti:args.rez_gosti,
            sudac1_ocjena:args.sudac1_ocjena,
            sudac2_ocjena:args.sudac2_ocjena,
            status:4
          },{
            where:{
              broj_utakmice:args.broj_utakmice
            }
          }).then(()=>args.broj_utakmice).catch((error) => {
            nodelogger.error('Greška kod zavrsavanja utakmice '+error);
            throw(error);
          })
       
      }
    }

  }
})
module.exports=new GraphQLSchema({//definicija sheme koju stavljamo u express graphql server
  query:RootQuery,
  mutation:Mutation
})