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
	const data = await invModel.getInventoryByClassificationId(classification_id)
	const grid = await utilities.buildClassificationGrid(data);
	let nav = await utilities.getNav();
	const className = data[0].classification_name;
	res.render("./inventory/classification", {
		title: className + " vehicles",
		nav,
		grid,
	});
};

module.exports = invCont;