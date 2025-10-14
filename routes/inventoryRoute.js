// Week 3 - Inventory Route was added
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// week - 3 Assignment was Created
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByDetail));
router.get("/broken", utilities.handleErrors(invController.BuildBrokenPage));

// add inventory routes
// ACTIVTIY WEEK 4
/* *********************************************
  ********************************************
  WEEK 4 Assignment 
  ******************************************** */
// adding add classification routes

router
	.get(
		"/",
		utilities.isAuthorized,
		utilities.handleErrors(invController.buildManagement)
	)
	.get("/add-classView", utilities.handleErrors(invController.buildAddclass))
	.post(
		"/add-classView",
		utilities.isAuthorized,
		regValidate.classRules(),
		regValidate.checkClassData,
		utilities.handleErrors(invController.addClass)
	);
router
	.get(
		"/add-vehicle",
		utilities.isAuthorized,
		utilities.handleErrors(invController.addVehicleIntoInventory)
	)
	.post(
		"/add-vehicle",
		utilities.isAuthorized,
		regValidate.vehicleRules(),
		regValidate.checkVehicleData,
		utilities.handleErrors(invController.addVehicle)
	);

// Route to build the inventory by classification view was added in week 5
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

router.get(
	"/edit/:inv_id",
	utilities.isAuthorized,
	utilities.handleErrors(invController.editInventoryView)
);

// This Route was added in week 5
// Update Routes
router.post(
	"/update/",
	utilities.isAuthorized,
	regValidate.vehicleRules(),
	regValidate.checkUpdateData,
	utilities.handleErrors(invController.updateInventory)
);

// Delete Routes
router.get(
	"/delete/:inv_id",
	utilities.isAuthorized,
	utilities.handleErrors(invController.deleteView)
);
router.post(
	"/delete/",
	utilities.isAuthorized,
	utilities.handleErrors(invController.deleteViewInventory)
);

module.exports = router;
