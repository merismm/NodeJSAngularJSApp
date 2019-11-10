var express = require("express");
var passport = require("passport");
var coockieParser = require("cookie-parser");
var session = require("express-session");
var dotenv = require('dotenv');

var app = express();

dotenv.load();

app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/data',  express.static(__dirname + '/data'));
app.use(express.static(__dirname + '/public'));
app.use('/public',express.static(__dirname + '/public'));

require("./config/passport")(passport); 

app.use(session({
    secret : "This is a secret"
}));

app.use(coockieParser());
app.use(passport.initialize());
app.use(passport.session());


var bodyParser = require("body-parser");
app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({
    extended :true
}));

require("./routes/main.js")(app);
require("./routes/auth.js")(app,passport);


app.listen(3000,function () {
    console.log("Server started");
});