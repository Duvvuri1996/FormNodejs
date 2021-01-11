const mongoose = require('mongoose');
const shortid = require('shortid');
const nodemailer = require('nodemailer');
const userModel = mongoose.model('User');
const check = require('../lib/check');
const emailCheck = require('../lib/emailValidation');
const logger = require('../lib/logger');
const response = require('../lib/resposne');
const Config = require('../Config/Config');

let signin = (req, res) => {
    console.log("THis is started")
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
        //console.log("this starter")
        return new Promise((resolve, reject) => {
            userModel.findOne({
                email : req.body.email
            }, (err, result) => {
                if(err) {
                    logger.error(err.message, "Error at sendMail() in sigin", 10)
                    let apiResponse = response.generate(true, "Failed to search user", 500, null)
                    reject(apiResponse)
                } else if(check.isEmpty(result)){
                    let newUser = new userModel({
                        userId : shortid.generate(),
                        email : req.body.email,
                        subject : req.body.subject,
                        content : req.body.content
                    })
                    newUser.save((err, userDetails) => {
                        if(err) {
                            logger.error(err.message, "Error at newUser save()", 7)
                            let apiResponse = response.generate(true, "Error at sendMail()", 400, null)
                            reject(apiResponse)
                        } else {
                            let transporter = nodemailer.createTransport({
                              service : 'gmail',
                              secure : false,
                              auth : {
                                  user : Config.mailer.auth.user,
                                  pass : Config.mailer.auth.pass
                              }
                            })
                            let mailOptions = {
                                from : Config.mailer.auth.user,
                                to : userDetails.email,
                                subject : 'Signed-in successfully',
                                html:`<h2>Hi, Welcome! you are now part of this application.</h2>
                                <br>
                                <h4>Subject : ${userDetails.subject}</h4> <br>
                                <h4>Content : ${userDetails.content}</h4>
                                <h3>Stay safe</h3>
                                <br>
                                <h3>Thank you</h3>
                                `
                            }
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
                        }
                    })
                }
                else{
                    let apiResponse = response.generate(true, "User exists", 500, null)
                    reject(apiResponse)
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