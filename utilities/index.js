const invModel = require("../models/invModel");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
	let data = await invModel.getClassifications();
	let list = "<ul class='ul-list'>";
	list += '<li><a href="/" title="Home page">Home</a></li>';
	data.rows.forEach((row) => {
		list += "<li>";
		list +=
			'<a href="/inv/type/' +
			row.classification_id +
			'" title="See our inventory of ' +
			row.classification_name +
			' vehicles">' +
			row.classification_name +
			"</a>";
		list += "</li>";
	});
	list += "</ul>";
	return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
// this was added in week 3
Util.buildClassificationGrid = async function (data) {
	let grid;
	if (Array.isArray(data) && data.length > 0) {
		grid = '<ul id="inv-display">';
		data.forEach((vehicle) => {
			grid += '<li class="class-view single-view">';
			grid +=
				'<a href="../../inv/detail/' +
				vehicle.inv_id +
				'" title="View ' +
				vehicle.inv_make +
				" " +
				vehicle.inv_model +
				'details"><img src="' +
				vehicle.inv_thumbnail +
				'" alt="Image of ' +
				vehicle.inv_make +
				" " +
				vehicle.inv_model +
				' on CSE Motors" /></a>';
			grid += '<div class="namePrice">';
			grid += "<hr />";
			grid += "<h3>";
			grid +=
				'<a href="../../inv/detail/' +
				vehicle.inv_id +
				'" title="View ' +
				vehicle.inv_make +
				" " +
				vehicle.inv_model +
				' detai ls">' +
				vehicle.inv_make +
				" " +
				vehicle.inv_model +
				"</a>";
			grid += "</h3>";
			grid +=
				"<span>$" +
				new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
				"</span>";
			grid += "</div>";
			grid += "</li>";
		});
		grid += "</ul>";
	} else {
		grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
	}
	return grid;
};

/*
 * Middleware for Handling Errors
 * Wrap other functions to catch errors
 * General Error Handling
 ***********
 */
//This was added in week 3
Util.handleErrors = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

// week 3 - Assignment was Created
Util.buildSpecificViewById = async function (data) {
	let detalView;
	if (Array.isArray(data) && data.length > 0) {
		detalView = '<section id="one_view"> ';
		data.forEach((element) => {
			detalView +=
				'<img src="' +
				element.inv_thumbnail +
				'" alt="Image of ' +
				element.inv_make +
				" " +
				element.inv_model +
				' on CSE Motors" />';
			detalView += '<div class="detail"> ';
			detalView += "<h3>";
			detalView += element.inv_make + " " + element.inv_model;
			detalView += "</h3>";
			detalView += "<ul>";
			detalView +=
				"<li>" +
				"<b> Price $" +
				new Intl.NumberFormat("en-US").format(element.inv_price) +
				"</b>" +
				"</li>";
			detalView +=
				"<li> " + "<b> Description:" + "</b>" + element.inv_description + " </li>";
			detalView +=
				"<li>" + "<b> Color:" + "</b>" + " " + element.inv_color + "</li>";
			detalView +=
				"<li>" + "<b> Miles:" + "</b>" + " " + element.inv_miles + "</li>";
			detalView += "</ul>";
			detalView += "</div>";
			detalView += "</section>";
		});
	} else {
		detalView += '<p class="notice">Sorry, no matching for vehicle data found.</p>';
	}
	return detalView;
};

// week 3 - Assignment was Created
Util.buildBrokenPage = function () {
	let broken = "";
	return broken;
};

module.exports = Util;
