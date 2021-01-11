const response = require('../lib/resposne');

let errorHandler = (err, req, res, next) => {
    let apiResponse = response.generate(true, 'Error occured at application level', 500, null)
    res.send(apiResponse)
}

let notFoundHandler = (req,res,next) => {
    let apiResponse = response.generate(true, 'Route not found in the application', 404, null)
    res.status(404).send(apiResponse)
}

module.exports = {
    errorHandler : errorHandler,
    notFoundHandler : notFoundHandler
}