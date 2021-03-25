const {sequelize}=require('../models');//index.js u moidelsima exporta sequelize unutar db objekta
const {nodelogger}=require('./logger.js');
module.exports={
    DatabaseConnection: async function  (logger)
    {
    nodelogger.info('Connecting to database....');
    try {
        await sequelize.authenticate();
        nodelogger.info('Connected to database.');
    } catch (error) {
        nodelogger.error('Error in database connection '+error);
        process.exit(1);//jer ce inace nastavit ići dalje nakon sta error handleamo ovaj promise,bi ga zelimo prekinuti
    }
    }
}