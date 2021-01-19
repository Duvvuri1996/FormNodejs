const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const appConfig = require('./app/Config/Config');
const logger = require('./app/lib/logger');
const routeLogger = require('./app/Middleware/requestLogger');
const errorhandle = require('./app/Middleware/errorHandler');
const imap = require('./app/lib/imap');
//const pop = require('./app/lib/pop');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(routeLogger.logIp);
app.use(errorhandle.errorHandler)

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    next();
})

const modelsPath = './app/Models';
const routesPath = './app/routes';

fs.readdirSync(modelsPath).forEach(function(file) {
    if(~file.indexOf('.js')) require(modelsPath+'/'+file)
})

fs.readdirSync(routesPath).forEach(function(file) {
    if(~file.indexOf('.js')){
        let route = require(routesPath+'/'+file)
        route.setRouter(app)
    }
})

app.use(errorhandle.notFoundHandler)
/**
 * Create Http Server
 */
const server = http.createServer(app);
server.listen(appConfig.port);
server.on('error', onError)
server.on('listening', onListening)

function onError(error){
    if(error.syscall !== 'listen'){
        logger.error(error.code, "Error at onError() while creating the server", 10)
        process.exit(1)
        throw error
    } 
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ' permission denied', 'serverOnErrorHandler', 10)
            /**
             * The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code
             * 0 for Succes and 1 for failure
             */
            process.exit(1)
            break;
            //EADDRINUSE - the port number which listen() tries to bind the server to which is already in use.
        case 'EADDRINUSE':
            logger.error(error.code + ' port already in use', 'serverOnErrorHandler', 10)
            process.exit(1)
            break;
        default:
            logger.error(error.code + ' :unknown error occured', 'serverOnErrorHandler', 10)
            throw error;
    }
    
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe' + addr :
        'pipe' + appConfig.port;
    logger.info('server listening on port' + addr.port, 'at onListening()', 10)
    
    /**let db = mongoose.connect(appConfig.db.uri, {
       * useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })*/
}

/** mongoose.connection.on('error', function (err) {
 *   logger.error(err, 'error at mongoose.connection.error()', 10)
}) //end mongoose connection on error

mongoose.connection.on('open', function(err) {
    if(err){
    logger.error(err.message, "error at mongoose.connection.on open()", 10)
} else {
    logger.info("Successfully connected to the mongo database", "at mongoose.connection.on open()", 10)
}
}) //end mongoose connection on open
*/
module.exports = app;