const {DatabaseConnection}=require('./sequelize');
const {httplogger,nodelogger}=require('./logger.js');//ubacivat loggere po dependency injectionu pa ako budemo mijenjali novi logir onda ga requiramo u ovoj datoteci i pošaljemo samo drugi u sequelize i express
module.exports={
    load: async function(app){
        try {
           await DatabaseConnection(nodelogger);
            nodelogger.info("Sequelize loaded. Connected to database");
        } catch (error) {
           nodelogger.error(error);
            throw(new Error());//da se greska od loadanja expressa propagira do app.js filea u kojem se nece pokrenuti aplikacija jer ce ici u catch dio
        }
    }
}