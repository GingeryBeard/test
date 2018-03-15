// JavaScript source code
var http = require('http');
var nodemailer = require('nodemailer');

var userName = 'linus@infomagine.se';
var password = 'wasd123wasd';

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
	var q = url.parse(req.url, true).query;
	var txt = q.year + " " + q.month;
	res.write(req.url);
    res.end();
}).listen(8080); 


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userName,
    pass: password
  }
});

var mailOptions = {
  from: 'linus@infomagine.se',
  to: 'linusaugustsson93@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  html: '<a href="https://www.w3schools.com/html/">Visit our HTML tutorial</a>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

