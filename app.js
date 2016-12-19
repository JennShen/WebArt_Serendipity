// Express server
var express = require("express");
var app = express();

// Serve files in the public folder 
var path = require("path");
var publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Use port 8080 when testing locally, but use the port specified by Heroku
// when deploying
app.set("port", (process.env.PORT || 8080));

// Start the express server and attach the socket connection to it
var server = app.listen(app.get("port"));
var io = require("socket.io")(server);

io.on("connection", function (socket) {

	// This function is called anytime a new client connects. The variable 
	// "socket" is an object that refers to the connection with the new client.
	console.log("Client connected from page: " + socket.handshake.headers.referer);
	// socket.on('setUsername', function(data)

	socket.on("message", function (messageContents) {
		// Relay the message to all other sockets that are connected (i.e. the
		// browser connected to display.html). This message is called 
		// "display message".
		socket.broadcast.emit("display message", messageContents);
	});

	socket.on("disconnect", function() {
		// This is called when the socket is disconnected. You may not need to 
		// use this.
		console.log("Client disconnected from page: " + socket.handshake.headers.referer);
	});

});

