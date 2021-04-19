var express=require('express');
const loaders=require('./loaders');//ucitamo sve loadere-> trebamo im poslat app
const {nodelogger}=require('./loaders/logger');
const config=require('./config');
var app=express();

async function start()
{
    try {
        await loaders.load(app);//poziv load funkcije iz index.js filea u loadersima koji će loadati sve u express server i povezati se na bazu
        nodelogger.info('Server listening on port '+config.port);
    } catch (error) {
        nodelogger.error('Error in starting application server'+error);
    }
}

start();