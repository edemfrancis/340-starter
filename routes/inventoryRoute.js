// Week 3 - Inventory Route was added
const exprees = require("express");
const router = new exprees.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// week - 3 Assignment was Created
router.get("/detail/:classification_id", invController.buildByDetail);
router.get("/broken", utilities.handleErrors(invController.BuildBrokenPage));

module.exports = router;
