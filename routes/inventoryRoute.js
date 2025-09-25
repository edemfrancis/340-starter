// Week 3 - Inventory Route was added
const exprees = require("express");
const router = new exprees.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// week - 3 Assignment was Created
router.get("/detail/:classification_id", invController.buildByDetail);

module.exports = router;
