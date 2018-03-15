// JavaScript source code

"use strict";
 
var http = require("http");
var nodemailer = require('nodemailer');

var userName = 'linus@infomagine.se';
var password = 'Hejsan123';
var emailToSendTo = '';

var thejson = "";
 
class Server
{
    constructor()
    {
        this.port = 8080;
        this.ip = "localhost";
 
        this.start();
    }
 
    start()
    {
        this.server = http.createServer((req, res) =>
        {
            this.processRequest(req, res);
        });
 
        this.server.on("clientError", (err, socket) =>
        {
            socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
        });
        console.log("Server created");
    }
 
    listen()
    {
        this.server.listen(this.port, this.ip);
        console.log("Server listening for connections");
    }
 
    processRequest(req, res)
    {
        // Process the request from the client
        // We are only supporting POST
        if (req.method === "POST")
        {
            // Post data may be sent in chunks so need to build it up
            var body = "";
            req.on("data", (data) =>
            {
                body += data;
                // Prevent large files from benig posted
				/*
                if (body.length > 1024)
                {
                    // Tell Unity that the data sent was too large
                    res.writeHead(413, "Payload Too Large", {"Content-Type": "text/html"});
                    res.end("Error 413");
                }
				*/
            });
            req.on("end", () =>
            {
                // Now that we have all data from the client, we process it
                console.log("Received data: " + body);
                // Split the key / pair values and print them out
                var vars = body.split("&");
                for (var t = 0; t < vars.length; t++)
                {
                    var pair = vars[t].split("=");
                    var key = decodeURIComponent(pair[0]);
                    var val = decodeURIComponent(pair[1]);
                    console.log(key + ":" + val);
					thejson = val;
					/*
					if(pair[0] == "email") {
						emailToSendTo = key;
						console.log(key + "WOW");
					}
					*/
                }
				//console.log(vars);
				//console.log(vars.length);
				var myjson = JSON.parse(thejson);
				//console.log(vars[0]);
				console.log(myjson.orderInformation.email + " WOW");

                // Tell Unity that we received the data OK
				var mailOptions = {
				  from: 'linus@infomagine.se',
				  to: myjson.orderInformation.email,
				  subject: 'Your Order Information',
				  text: "Your part: " + myjson.partsToOrder[0].name + "\nArticle: " + myjson.partsToOrder[0].article + "\nQuantity: " + myjson.partsToOrder[0].quantity
				};
				
				transporter.sendMail(mailOptions, function(error, info) {
				  if (error) {
					console.log(error);
				  } else {
					console.log('Email sent: ' + info.response);
				  }
				});
				
                res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Credentials": "true",
					"Access-Control-Allow-Headers": "Accept, X-Access-Token, X-Application-Name, X-Request-Sent-Time",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Origin": "*"});
                res.end("OK");
            });
        }
        else
        {
            // Tell Unity that the HTTP method was not allowed
            res.writeHead(405, "Method Not Allowed", {"Content-Type": "text/html"});
            res.end("Error 405");
        }
    }
 
}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userName,
    pass: password
  }
});


 
module.exports.Server = Server;

