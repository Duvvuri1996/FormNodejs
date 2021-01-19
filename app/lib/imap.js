var Imap = require('imap'),
    inspect = require('util').inspect; 
    var fs = require('fs'), fileStream;
const Config = require('../Config/Config');

// Step 2: Declaring new imap object
var imap = new Imap({
  user: Config.mailer.auth.user,
  password: Config.mailer.auth.pass,
  host: 'pop.gmail.com', 
  port: 995,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

// Step 3: Program to receive emails. 
 function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

/**
 * imap.once('ready', function() {

openInbox(function(err, box) {
  if (err) throw err;
  imap.search([ 'ALL', ['SINCE', 'January 01, 2021'] ], function(err, results) { 
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

//Fetch the 'date', 'from', 'to', 'subject' message headers and the message structure of the first 3 messages in the Inbox

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
         //console.log(stream+'  stream')
          var buffer = '';
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
            //console.log(chunk + ' is chunk')
          });
          stream.once('end', function() {
              //console.log(Imap.parseHeader(buffer)+ ' parser')
              //console.log(inspect(Imap.parseHeader(buffer))+' is inspect')
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