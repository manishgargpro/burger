// url: https://morning-plateau-56935.herokuapp.com/

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