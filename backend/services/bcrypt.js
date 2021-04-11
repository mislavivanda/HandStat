const bcrypt=require('bcrypt');
const config=require('../config');
const {nodelogger}=require('../loaders/logger');
module.exports=async function(password)
{
    try {
        const rounds=config.bcrypt.saltRounds;
        let buff1=Buffer.alloc(16);//sol je veličine 128 bitova=16 bajtova
        let buff2=Buffer.alloc(24);//hash fingerprint je veličine 192 bita-> 24 bajta
        buff1= await bcrypt.genSalt(rounds);//vraća promise koji resolva sa vrijednosti od soli
        nodelogger.info(buff1);
        buff2=await bcrypt.hash(password,buff1);
        nodelogger.info(buff2);
        return buff2;
    } catch (error) {
        nodelogger.error('Error in hashing password '+error);
        throw(error);
    }
}