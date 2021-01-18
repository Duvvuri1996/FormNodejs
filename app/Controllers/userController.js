const mongoose = require('mongoose');
const shortid = require('shortid');
const nodemailer = require('nodemailer');
const userModel = mongoose.model('User');
const check = require('../lib/check');
const emailCheck = require('../lib/emailValidation');
const logger = require('../lib/logger');
const response = require('../lib/resposne');
const Config = require('../Config/Config');
const SMTPTransport = require('nodemailer/lib/smtp-transport');
const Imap = require('imap'),inspect = require('util').inspect;
var fs = require('fs'), fileStream;

let signin = (req, res) => {
    let validateEmail = () => {
        return new Promise((resolve, reject) => {
            if(req.body.email) {
                if(!emailCheck.email(req.body.email)){
                    let apiResponse = response.generate(true, "Email did not meet the requirement",400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                    
                }
            } else {
                let apiResponse = response.generate(true, "Email parameter is missing", 404, null)
                reject(apiResponse)
            }
        })
    }

    let sendMail = () => {
        return new Promise((resolve, reject) => {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port : 587,
                service : 'gmail',
                secure : false,
                auth : {
                    user : Config.mailer.auth.user,
                    pass : Config.mailer.auth.pass
                }
              })
              let mailOptions = {
                  from : Config.mailer.auth.user,
                  to : req.body.email,
                  subject : 'Signed-in successfully',
                  html:`<h2>Hi, Welcome! you are now part of this application.</h2>
                  <br>
                  <h4>Subject : ${req.body.subject}</h4> <br>
                  <h4>Content : ${req.body.content}</h4>
                  <h3>Stay safe</h3>
                  <br>
                  <h3>Thank you</h3>
                  `
              }
              console.log(Config.mailer.auth.pass)
              console.log(mailOptions)
              transporter.sendMail(mailOptions, (err, info) => {
                  if(err){
                      console.log(err)
                      let apiResponse = response.generate(true, "Error at sendMail()", 500, null)
                      reject(apiResponse)
                  } else {
                      resolve(info)
                  }
              })
        })
    }
     validateEmail(req, res)
     .then(sendMail)
     .then((resolve) => {
         let apiResponse = response.generate(false, "Mail sent successfully to the registered mail id", 200, resolve)
         res.send(apiResponse)
     })
     .catch((err) => {
         console.log(err)
         res.send(err)
     })
}

module.exports = {
    signin : signin
}