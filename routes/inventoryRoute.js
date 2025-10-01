// Week 3 - Inventory Route was added
const exprees = require("express");
const router = new exprees.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// week - 3 Assignment was Created
router.get("/detail/:classification_id", invController.buildByDetail);
router.get("/broken", utilities.handleErrors(invController.BuildBrokenPage));

// add inventory routes
// ACTIVTIY WEEK 4
/* *********************************************
  ********************************************
  WEEK 4 Assignment 
  ******************************************** */
// adding add classification routes

router
	.get("/", utilities.handleErrors(invController.buildManagement))
	.get("/add-classView", utilities.handleErrors(invController.buildAddclass))
	.post(
		"/add-classView",
		regValidate.classRules(),
		regValidate.checkClassData,
		utilities.handleErrors(invController.addClass)
	);
router
	.get("/add-vehicle", utilities.handleErrors(invController.addVehicleIntoInventory))
	.post(
		"/add-vehicle",
		regValidate.vehicleRules(),
		regValidate.checkVehicleData,
		utilities.handleErrors(invController.addVehicle)
	);

module.exports = router;
