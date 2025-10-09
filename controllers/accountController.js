/* 
This was created and build in week 4
*/

const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

// Tis was added in week 5
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
	let nav = await utilities.getNav();
	res.render("account/login", {
		title: "Login",
		nav,
		errors: null,
	});
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
	let nav = await utilities.getNav();
	res.render("account/register", {
		title: "Register",
		nav,
		errors: null,
	});
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
	let nav = await utilities.getNav();
	const { account_firstname, account_lastname, account_email, account_password } =
		req.body;
	// Hash the password before storing
	let hashedPassword;
	try {
		// regular password and cost (salt is generated automatically)
		hashedPassword = await bcrypt.hashSync(account_password, 10);
	} catch (error) {
		req.flash("notice", "Sorry, there was an error processing the registration.");
		res.status(500).render("account/register", {
			title: "Registration",
			nav,
			errors: null,
		});
	}

	const regResult = await accountModel.registerAccount(
		account_firstname,
		account_lastname,
		account_email,
		hashedPassword
	);

	if (regResult) {
		req.flash(
			"notice",
			`Congratulations, you\'re registered ${account_firstname}. Please log in.`
		);
		res.status(201).render("account/login", {
			title: "Login",
			nav,
		});
	} else {
		req.flash("notice", "Sorry, the registration failed.");
		res.status(501).render("account/register", {
			title: "Registration",
			nav,
		});
	}
}

/* ****************************************
 *  Week 5 - Build JWT
 * *************************************** */
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
	let nav = await utilities.getNav();
	const { account_email, account_password } = req.body;
	const accountData = await accountModel.getAccountByEmail(account_email);
	if (!accountData) {
		req.flash("notice", "Please check your credentials and try again.");
		res.status(400).render("account/login", {
			title: "Login",
			nav,
			errors: null,
			account_email,
		});
		return;
	}
	try {
		if (await bcrypt.compare(account_password, accountData.account_password)) {
			delete accountData.account_password;
			const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: 3600 * 1000,
			});
			if (process.env.NODE_ENV === "development") {
				res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
			} else {
				res.cookie("jwt", accessToken, {
					httpOnly: true,
					secure: true,
					maxAge: 3600 * 1000,
				});
			}
			return res.redirect("/account/");
		} else {
			req.flash("message notice", "Please check your credentials and try again.");
			res.status(400).render("account/login", {
				title: "Login",
				nav,
				errors: null,
				account_email,
			});
		}
	} catch (error) {
		throw new Error("Access Forbidden");
	}
}

// acount controller for default account view
async function buildAccount(req, res, next) {
	let nav = await utilities.getNav();
	req.flash("notice", `Login Successful`);
	res.render("account/account", {
		title: "Account Management",
		nav,
		errors: null,
	});
}

/* ****************************************
 *  Week 5 Asssignment
 * *************************************** */

// controller function to build the edit account view
async function buildEditAccount(req, res, next) {
	let nav = await utilities.getNav();
	let account = res.locals.accountData;
	const account_id = parseInt(req.params.account_id);
	res.render("account/editaccount", {
		title: "Edit Account Information",
		nav,
		errors: null,
		account_firstname: account.account_firstname,
		account_lastname: account.account_lastname,
		account_email: account.account_email,
		account_id: account_id,
	});
}

async function editAccountInfo(req, res) {
	let nav = await utilities.getNav();
	const { account_firstname, account_lastname, account_email, account_id } =
		req.body;

	// pass (fname, lname, email) to model UPDATE statement
	const regResult = await accountModel.updateAccountInfo(
		account_firstname,
		account_lastname,
		account_email,
		account_id
	);
	if (regResult) {
		// flash message that the update was successful
		res.clearCookie("jwt");
		const accountData = await accountModel.getAccountById(account_id);
		// use .env secret key to sign, expires in one hour
		const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: 3600 * 1000,
		});
		// can only be passed through http requests, maximum age is 1 hour
		res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

		req.flash("success", "Account information updated succesfully.");
		res.status(201).render("account/account", {
			title: "Edit Account Information",
			nav,
			errors: null,
			account_firstname,
			account_lastname,
			account_email,
		});
	} else {
		req.flash("error", "Sorry, the update failed.");
		// render account edit view again
		res.status(501).render("account/editaccount", {
			title: "Edit Account Information",
			nav,
			errors: null,
			account_firstname: account_firstname,
			account_lastname: account_lastname,
			account_email: account_email,
		});
	}
}

async function editAccountPassword(req, res) {
	let nav = await utilities.getNav();
	const { account_password, account_id } = req.body;

	// Hash the password before storing
	let hashedPassword;
	try {
		// regular password and cost (salt is generated automatically)
		hashedPassword = await bcrypt.hashSync(account_password, 10);
	} catch (error) {
		req.flash("notice", "Sorry, an error occured.");
		res.status(500).render("account/editaccount", {
			title: "Registration",
			nav,
			errors: null,
		});
	}
	// pass (hashpass, account_id) to model UPDATE statement
	const regResult = await accountModel.changePassword(hashedPassword, account_id);
	// account account = res.locals.accountData
	if (regResult) {
		const account = await accountModel.getAccountById(account_id);
		req.flash("success", "Password was changed succesfully");
		res.status(201).render("account/account", {
			title: "Edit Account Information",
			nav,
			errors: null,
			account_firstname: account.account_firstname,
		});
	} else {
		const account = await accountModel.getAccountById(account_id);
		req.flash("error", "Sorry, the update failed.");
		res.status(501).render("account/editaccount", {
			title: "Edit Account Information",
			nav,
			errors: null,
		});
	}
}

async function logoutAccount(req, res, next) {
	res.clearCookie("jwt");
	res.redirect("/");
	return;
}

module.exports = {
	buildLogin,
	buildRegister,
	registerAccount,
	accountLogin,
	buildAccount,
	buildEditAccount,
	editAccountInfo,
	editAccountPassword,
	logoutAccount,
};
