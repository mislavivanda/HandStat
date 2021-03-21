const {DatabaseConnection}=require('./sequelize');
const {httplogger,nodelogger}=require('./logger.js');//ubacivat loggere po dependency injectionu pa ako budemo mijenjali novi logir onda ga requiramo u ovoj datoteci i pošaljemo samo drugi u sequelize i express
const express=require('./express');
module.exports={
    load: async function(app){
        try {
           await DatabaseConnection(nodelogger);//povezivanje na bazu
            nodelogger.info("Sequelize loaded. Connected to database");
        } catch (error) {
           nodelogger.error('Error in connecting to database: '+error);
            throw(new Error());//da se greska od loadanja expressa propagira do app.js filea u kojem se nece pokrenuti aplikacija jer ce ici u catch dio
        }
        try {
            express(app,httplogger);//ucitavanje svih dependenciesa u express server
            nodelogger.info('Express loaded');
        } catch (error) {
            nodelogger.error('Error in loading express '+error);
            throw(new Error());
        }
    }
}