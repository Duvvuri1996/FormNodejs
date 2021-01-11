const express = require('express');
const appConfig = require('../Config/Config');
const controller = require('../Controllers/userController');

module.exports.setRouter = (app) => {
    const baseUrl = `${appConfig.apiVersion}/user`

    app.post(`${baseUrl}/signin`, controller.signin)

}