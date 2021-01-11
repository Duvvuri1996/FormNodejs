const logger  =require('pino')()

//To formatt the errors or information in a specified formatt into our system

let captureError = (errorMessage, errorOrigin, errorLevel) => {
    let currentTime = Date.now();
    let formattedError = {
        timeStamp : currentTime,
        error : errorMessage,
        origin : errorOrigin,
        level : errorLevel
    }
    logger.error(formattedError)
    return formattedError
}

let captureInfo = (infoMessage, infoOrigin, infoLevel) => {
    let currentTime = Date.now();
    let formattedInfo = {
        timeStamp : currentTime,
        info : infoMessage,
        origin : infoOrigin,
        level : infoLevel
    }
    logger.info(formattedInfo)
    return formattedInfo
}

/**
 * To export functionalities to use in the other modules
 */

module.exports = {
    error : captureError,
    info : captureInfo
}