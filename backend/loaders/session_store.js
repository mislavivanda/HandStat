const session=require('express-session');
const config=require('../config');
var PostgreSqlStore = require('connect-pg-simple')(session);
let session_store=new PostgreSqlStore({
    conString:config.database_url,
    tableName : 'user_session',
    prunesessionInterval:60//svako 60 sekundi brise sesije koje se expireale
  });

module.exports=session_store;