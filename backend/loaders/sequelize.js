const {sequelize}=require('../models');//index.js u moidelsima exporta sequelize unutar db objekta

module.exports={
    DatabaseConnection: async function  (logger)
    {
    console.log('Connecting to database....');
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');
    } catch (error) {
        console.log('Error in database connection '+error);
        process.exit(1);//jer ce inace nastavit ići dalje nakon sta error handleamo ovaj promise,bi ga zelimo prekinuti
    }
    }
}