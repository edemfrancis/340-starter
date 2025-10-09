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
	const classificationSelect = await utilities.buildClassificationList();
	res.render("./inventory/management", {
		title: "inventory Management",
		errors: null,
		nav,
		classificationSelect,
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
	const classificationSelect = await utilities.buildClassificationList();
	let nav = await utilities.getNav();
	res.render("./inventory/add-vehicle", {
		title: "Add to Vehicle",
		nav,
		errors: null,
		classificationSelect,
	});
};

/* ****************************************
 *  Process vehicle info
 * *************************************** */
invCont.addVehicle = async function (req, res, next) {
	let nav = await utilities.getNav();
	let classificationSelect = await utilities.buildClassificationList();
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
			classificationSelect,
		});
	} else {
		req.flash("error", "Vehicle addition failed");
		res.status(501).render("./inventory/add-vehicle", {
			title: "Add Vehicle",
			nav,
			classificationSelect,
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

// Created this in week 5
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
	const classification_id = parseInt(req.params.classification_id);
	const data = await invModel.getInventoryByClassificationId(classification_id);
	if (data && data.length > 0 && data[0].inv_id) {
		res.setHeader("Content-Type", "application/json");
		return res.json(data);
	} else {
		next(new Error("Response data not returned"));
	}
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
	const inv_id = parseInt(req.params.inv_id);
	let nav = await utilities.getNav();
	const itemData = await invModel.getInventoryByInvId(inv_id);
	const classificationSelect = await utilities.buildClassificationList(
		itemData.classification_id
	);
	const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
	res.render("./inventory/edit-inventory", {
		title: "Edit " + itemName,
		nav,
		classificationSelect: classificationSelect,
		errors: null,
		inv_id: itemData.inv_id,
		inv_make: itemData.inv_make,
		inv_model: itemData.inv_model,
		inv_year: itemData.inv_year,
		inv_description: itemData.inv_description,
		inv_image: itemData.inv_image,
		inv_thumbnail: itemData.inv_thumbnail,
		inv_price: itemData.inv_price,
		inv_miles: itemData.inv_miles,
		inv_color: itemData.inv_color,
		classification_id: itemData.classification_id,
	});
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
	let nav = await utilities.getNav();
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
		inv_id,
	} = req.body;
	const updateResult = await invModel.updateInventory(
		inv_make,
		inv_model,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_year,
		inv_miles,
		inv_color,
		classification_id,
		inv_id
	);

	if (updateResult) {
		const itemName = updateResult.inv_make + " " + updateResult.inv_model;
		req.flash("notice", `The ${itemName} was successfully updated.`);
		res.redirect("/inv/");
	} else {
		const classificationSelect = await utilities.buildClassificationList(
			classification_id
		);
		const itemName = `${inv_make} ${inv_model}`;
		req.flash("notice", "Sorry, the insert failed.");
		res.status(501).render("inventory/edit-inventory", {
			title: "Edit " + itemName,
			nav,
			classificationSelect: classificationSelect,
			errors: null,
			inv_id,
			inv_make,
			inv_model,
			inv_year,
			inv_description,
			inv_image,
			inv_thumbnail,
			inv_price,
			inv_miles,
			inv_color,
			classification_id,
		});
	}
};

/* ***************************
 *  Building delete inventory view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
	const inv_id = parseInt(req.params.inv_id);
	let nav = await utilities.getNav();
	const itemData = await invModel.getInventoryByInvId(inv_id);
	const classificationSelect = await utilities.buildClassificationList(
		itemData.classification_id
	);
	const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
	res.render("./inventory/deleteView", {
		title: "Edit " + itemName,
		nav,
		classificationSelect: classificationSelect,
		errors: null,
		inv_id: itemData.inv_id,
		inv_make: itemData.inv_make,
		inv_model: itemData.inv_model,
		inv_year: itemData.inv_year,
		inv_price: itemData.inv_price,
		classification_id: itemData.classification_id,
	});
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteViewInventory = async function (req, res, next) {
	let nav = await utilities.getNav();
	const { classification_id, inv_make, inv_model, inv_year, inv_price, inv_id } =
		req.body;
	const updateResult = await invModel.deleteInventory(inv_id);

	if (updateResult) {
		const itemName = updateResult.inv_make + " " + updateResult.inv_model;
		req.flash("notice", `The ${itemName} was successfully deleted.`);
		res.redirect("/inv/");
	} else {
		const classificationSelect = await utilities.buildClassificationList(
			classification_id
		);
		const itemName = `${inv_make} ${inv_model}`;
		req.flash("notice", "Sorry, the insert failed.");
		res.status(501).render("inventory/deleteView", {
			title: "Edit " + itemName,
			nav,
			classificationSelect: classificationSelect,
			errors: null,
			inv_id,
			inv_make,
			inv_model,
			inv_year,
			inv_price,
			classification_id,
		});
	}
};

module.exports = invCont;
