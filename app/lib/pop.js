var pop = require('poplib');
const Config = require('../Config/Config');

var host = 'pop.gmail.com';

var port = 995;
var username = Config.mailer.auth.user;
var password = Config.mailer.auth.pass;

var client = new pop(port, host, {
    tlserrs : false,
    enabletls : true,
    insecure: true,
    debug : false
})



client.on('connect', ()=> {
    console.log("Connection successful")
    console.log(Config.mailer.auth.pass)
    client.login(username, password)
})
client.on('error', (err) => {
    if(err.errno === 111){
        console.log('Unable to connect to the server')
    } else {
        console.log("server error occured")
        console.log(err)
    }
})

client.on('invalid-state', (cmd)=> {
    console.log('Invalid state '+ cmd)
})

client.on('locked', (cmd) => {
    console.log('Current command not yet finished, but tried calling another command')
})

client.on('login', (status, rawdata) => {
    console.log(rawdata)
    if(status){
        console.log("LOGIN successful")
        client.list();
    } else {
        console.log("LOGIN failed")
        client.quit()
    }
})

client.on('list', (status, msgcount, msgnumber, rawdata) => {
    if(status === false){
        console.log("LIST failed")
        client.quit()
    } else {
        console.log("List count is "+msgcount+ ' elemnt(S)')
        if(msgcount > 0){
            client.retr(1)
        } else {
            client.quit()
        }
    }
})

client.on('retr', (status, msgnumber, data, rawdata) => {
    if(status === true){
        client.dele(msgnumber)
        client.quit()
    } else {
        client.quit()
    }
    
})

client.on('dele', (status, msgnum, data, rawdata) => {
    if(status === true) {
        console.log("Deleted successfully "+ msgnumber)
        client.quit();
    } else {
        console.log("Failed to delete the message "+ msgnumber)
        client.quit();
    }
})

client.on('quit', (status, rawdata) => {
    if(status === true){
        console.log("Quit successfully")
    } else {
        console.log("Quit failed")
    }
})

