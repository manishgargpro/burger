//connection string:
//mysql://ztw3pj6remtlye6y:gg2uiv9t0rpsz6av@ipobfcpvprjpmdo9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/ppfb056s56g29sx8

var express = require("express");

var methodOverride = require("method-override");

var bodyParser = require("body-parser");

var app = express();
var PORT = process.env.PORT || 3000;

var db = require("./models");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("public"));

require("./routes/api-routes.js")(app);

db.sequelize.sync().then(function () {
	console.log("Database is synced!");
	app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});