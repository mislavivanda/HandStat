//FILE ZA TESTIRANJE QUERYA BEZ DIZANJA EXPRESS SERVERA,SAMO SA POVEZIVANJEM NA BAZU
const {nodelogger}=require('./loaders/logger');
const {sequelize}=require('./models');
const models=require('./models');
async function DatabaseConnection ()
{
    nodelogger.info('Connecting to database....');
    try {
        await sequelize.authenticate();
        nodelogger.info('Connected to database.');
    } catch (error) {
        nodelogger.info('Error in database connection '+error);
        process.exit(1);//jer ce inace nastavit ići dalje nakon sta error handleamo ovaj promise,bi ga zelimo prekinuti
    }
}

async function init()
{
    try {
        await DatabaseConnection();//ne trebamo ga handleat sa try catch jer ce u slucaju greske ona sama terminirat proces
        //async funkcija vraca promise pa je awaitamo
     nodelogger.info('Hello');
     const data=await models.igracutakmica.findAll({
         include:{
             model:models.clanovitima
         },
         order:[
             ['clanovitima','broj_dresa','ASC']
         ]
    });
    nodelogger.info(JSON.stringify(data));
    } catch (error) {
        nodelogger.error('Greska u izvodenju'+error);
    }
}
init();
