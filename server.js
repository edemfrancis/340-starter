/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
const session = require("express-session");
const pool = require("./database/");
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");

// Week 3 - Inventory Route was added
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");
const accountRoute = require("./routes/accountRoute");
/// added in week 4
const bodyParser = require("body-parser");

/* ***********************
 * View and Templates
 *************************/

/* ***********************
 * Middleware
 * ************************/
app.use(
	session({
		store: new (require("connect-pg-simple")(session))({
			createTableIfMissing: true,
			pool,
		}),
		secret: process.env.SESSION_SECRET, // this was added in week 4
		resave: true,
		saveUninitialized: true,
		name: "sessionId",
	})
); // session code was added in week 4

// Express Messages Middleware // this was added in week 4
app.use(require("connect-flash")());
app.use(function (req, res, next) {
	res.locals.messages = require("express-messages")(req, res);
	next();
}); // this was added in week 4

app.use(bodyParser.json()); // for parsing application/json added in week 4
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root
/* ***********************
 * Routes
 *************************/
app.use(static);
// Index Route, the home page
app.get("/", utilities.handleErrors(baseController.buildHome));
// Week 3 - Inventory Route was added
app.use("/inv", inventoryRoute);
// File Not Found Route - must be last route in list
// app.use(async (req, res, next) => {
// 	next({ status: 404, message: "Sorry, we appear to have lost that page." });
// });
app.use("/account", accountRoute);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
	console.log(`app listening on ${host}:${port}`);
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
// This was added in week 3
app.use(async (err, req, res, next) => {
	let nav = await utilities.getNav();
	console.error(`Error at: "${req.originalUrl}": ${err.message}`);
	if (err.status == 404) {
		message = err.message;
	} else {
		message = "Oh no! There was a crash. Maybe try a different route?";
	}
	res.render("errors/error", {
		title: err.status || "Server Error",
		message,
		nav,
	});
});

// how to generate a random session secret
// require('crypto').randomBytes(64).toString('hex');
