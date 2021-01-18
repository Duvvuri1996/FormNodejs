// Step 1: Include required modules
var Imap = require('imap'),
    inspect = require('util').inspect; 
    var fs = require('fs'), fileStream; 
const Config = require('../Config/Config');

// Step 2: Declaring new imap object
var imap = new Imap({
  user: Config.mailer.auth.user, // example: aakanksha.jain8@gmail.com
  password: Config.mailer.auth.pass, // Remember, using just password for authentication will only work if you have less secured apps enabled 
  host: 'imap.gmail.com', 
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

// Step 3: Program to receive emails. 
/* This pretty much contains receiving emails, deciding which parts of email to receive,
and what do display on console after execution of program */
 function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

/**
 * imap.once('ready', function() {

openInbox(function(err, box) {
  if (err) throw err;
  imap.search([ 'ALL', ['SINCE', 'June 15, 2018'] ], function(err, results) { 
    console.log('Working')
    if (err) throw err;
    var f = imap.fetch(results, { bodies: '' });
    
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno); 
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        console.log(prefix + 'Body');
        stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect(); */


imap.once('ready', function() {
    openInbox(function(err, box) {
      if (err) throw err;
      var f = imap.seq.fetch('1:3', {
        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        struct: true
      });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          var buffer = '';
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
          });
          stream.once('end', function() {
            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
          });
        });
        msg.once('attributes', function(attrs) {
          console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });
  
  imap.once('error', function(err) {
    console.log(err);
  });
  
  imap.once('end', function() {
    console.log('Connection ended');
  });
  
  imap.connect();