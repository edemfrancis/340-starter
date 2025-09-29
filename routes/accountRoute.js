// createed this file in week 4 and added error handling route in week 4
const express = require("express");
const router = new express.Router();
const account = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(account.buildLogin));
router.get("/register", utilities.handleErrors(account.buildRegister));

// Process the registration data
router.post(
	"/register",
	regValidate.registationRules(),
	regValidate.checkRegData,
	utilities.handleErrors(account.registerAccount)
);

// Process the login attempt
router.post(
	"/login",
	regValidate.loginRules(),
	regValidate.checkLoginData,
	(req, res) => {
		res.status(200).send("login process");
	}
);

module.exports = router;
