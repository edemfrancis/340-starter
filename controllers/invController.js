// week - 3 invcontroller was Createdconst invModel = require("../models/invModel");
const utilities = require("../utilities/");
const invModel = require("../models/invModel");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
// this was added in week 3
invCont.buildByClassificationId = async function (req, res, next) {
	const classification_id = req.params.classificationId;
	const data = await invModel.getInventoryByClassificationId(classification_id);
	const grid = await utilities.buildClassificationGrid(data);
	let nav = await utilities.getNav();
	const className = data[0].classification_name;
	res.render("./inventory/classification", {
		title: className + " vehicles",
		nav,
		grid,
	});
};

// week - 3 Assignment was Created
invCont.buildByDetail = async function (req, res, next) {
	try {
		const get_details_by_class_id = req.params.classification_id;
		const data = await invModel.getInventoryByInvId(get_details_by_class_id);
		const detalView = await utilities.buildSpecificViewById(data);
		let nav = await utilities.getNav();
		const year = data[0].inv_year;
		const inv_make = data[0].inv_make;
		const inv_model = data[0].inv_model;

		res.render("./inventory/classification-view", {
			title: year + " " + inv_make + " " + inv_model,
			nav,
			detalView,
		});
	} catch (typeError) {
		// this will report back error message to the user
		return "Error! Vehicle not available";
	}
};

// Error message for testing the error route
// week - 3 Assignment was Created
invCont.BuildBrokenPage = async function (req, res, next) {
	let nav = await utilities.getNav();
	res.render("./inventory/broken", {
		title: "Oops, error",
		errors: null,
		nav,
	});
};

// ACTIVTIY WEEK 4
/* *********************************************
  ********************************************
  WEEK 4 Assignment 
  ******************************************** */

/* ***************************
 *  Build management View
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
	let nav = await utilities.getNav();
	res.render("./inventory/management", {
		title: "inventory Management",
		nav,
		errors: null,
	});
};

/* ***************************
 *  Build View to add classification
 * ************************** */
invCont.buildAddclass = async function (req, res, next) {
	let nav = await utilities.getNav();
	res.render("./inventory/add-classView", {
		title: "Add Classification",
		errors: null,
		nav,
	});
};

invCont.addVehicleIntoInventory = async function (req, res, next) {
	const classSelect = await utilities.buildClassificationList();
	let nav = await utilities.getNav();
	res.render("./inventory/add-vehicle", {
		title: "Add to Vehicle",
		nav,
		errors: null,
		classSelect,
	});
};

/* ****************************************
 *  Process vehicle info
 * *************************************** */
invCont.addVehicle = async function (req, res, next) {
	let nav = await utilities.getNav();
	let classSelect = await utilities.buildClassificationList();
	const {
		classification_id,
		inv_make,
		inv_model,
		inv_year,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_miles,
		inv_color,
	} = req.body;

	const regResult = await invModel.addVehicle(
		classification_id,
		inv_make,
		inv_model,
		inv_year,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_miles,
		inv_color
	);

	if (regResult) {
		req.flash("success", "Vehicle added");
		res.status(201).render("./inventory/management", {
			title: "Vehicle Management",
			nav,
		});
	} else {
		req.flash("error", "Vehicle addition failed");
		res.status(501).render("./inventory/add-vehicle", {
			title: "Add Vehicle",
			nav,
			classSelect,
		});
	}
};

/* ****************************************
 *  Process class info
 * *************************************** */
// /this is for posting classification name to the database
invCont.addClass = async function (req, res, next) {
	const { classification_name } = req.body;

	const regResult = await invModel.addClassificationName(classification_name);
	let nav = await utilities.getNav();

	if (regResult) {
		req.flash("success", "Classification added");
		res.status(200).render("./inventory/management", {
			title: "Inventory Management",
			nav,
			errors: null,
		});
	} else {
		req.flash("error", "Class addition failed");
		res.status(501).render("./inventory/add-classView", {
			title: "Add Classification",
			nav,
			errors: null,
		});
	}
};

module.exports = invCont;
