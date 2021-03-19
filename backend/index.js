//FILE ZA TESTIRANJE QUERYA BEZ DIZANJA EXPRESS SERVERA,SAMO SA POVEZIVANJEM NA BAZU
const {nodelogger}=require('./loaders/logger');
const {sequelize}=require('./models');

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
    await DatabaseConnection();//ne trebamo ga handleat sa try catch jer ce u slucaju greske ona sama terminirat proces
    //async funkcija vraca promise pa je awaitamo
    try {
     nodelogger.info('Hello');
    } catch (error) {
        nodelogger.error('Greska u izvodenju'+error);
    }
}
init();
