// createed this file in week 4 and added error handling route in week 4
const express = require("express");
const router = new express.Router();
const account = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

router.get("/", utilities.checkLogin, utilities.handleErrors(account.buildAccount));

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
	utilities.handleErrors(account.accountLogin) // This was edited in week 5

	// This was commented out in week 5
	// (req, res) => {
	// 	res.status(200).send("login process");
	// }
);

/* *****************************************
 *  Week 5 Assignment Routes
 * *************************************** */
router.get("/edit/:account_id", utilities.handleErrors(account.buildEditAccount));

router.post(
	"/accountupdate",
	regValidate.updateAccountRules(),
	regValidate.checkEditAccountData,
	utilities.handleErrors(account.editAccountInfo)
);

router.post(
	"/changepassword",
	regValidate.changePasswordRules(),
	regValidate.checkEditAccountData,
	utilities.handleErrors(account.editAccountPassword)
);

router.get("/logout", utilities.handleErrors(account.logoutAccount));

module.exports = router;
