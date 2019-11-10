var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/softhouse-db");
module.exports.User = require("./user");
