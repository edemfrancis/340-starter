const pool = require("../database");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
	return await pool.query(
		"SELECT * FROM public.classification ORDER BY classification_name"
	);
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
// this was added in week 3
async function getInventoryByClassificationId(classification_id) {
	try {
		const data = await pool.query(
			`SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
			[classification_id]
		);
		return data.rows;
	} catch (error) {
		console.error("getclassificationsbyid error " + error);
	}
}

// week 3 - Assignment was Created
// async function getInventoryById(invId) {
// 	try {
// 		const sql = "SELECT * FROM inventory WHERE inv_id = $1";
// 		const data = await pool.query(sql, [invId]);
// 		return data.rows[0];
// 	} catch (error) {
// 		throw error;
// 	}
// }

// week 3 - Assignment was Created
async function getInventoryByInvId(inv_id) {
	try {
		const data = await pool.query(
			`SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1`,
			[inv_id]
		);
		return data.rows[0];
	} catch (error) {
		console.error(
			" There was an error retrieving Inventory-Data. " +
				error +
				" This should be from the inventory-model/Utilities/invController"
		);
	}
}

// ACTIVTIY WEEK 4
/* *********************************************
  ********************************************
  WEEK 4 Assignment 
  ******************************************** */
// adding class to classification name
async function addClassificationName(classification_name) {
	try {
		const sql =
			"INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
		const result = await pool.query(sql, [classification_name]);
		return result;
	} catch (error) {
		return error.message;
	}
}

// checking to see if classification name existed
async function ifClasificationNameExists(classification_name) {
	try {
		const sql =
			"SELECT * FROM classification WHERE classification_name = $1 LIMIT 1";
		const classificationName = await pool.query(sql, [classification_name]);
		return classificationName.rows.length;
	} catch (error) {
		return error.message;
	}
}

// Week 5 Assignment
/* ***************************
 *  Add new vehicle
 * ************************** */
async function addVehicle(
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
) {
	try {
		const sql =
			"INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
		return await pool.query(sql, [
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
		]);
	} catch (error) {
		return error.message;
	}
}

// Update Inventory
async function updateInventory(
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
) {
	try {
		const sql =
			"UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
		const data = await pool.query(sql, [
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
			inv_id,
		]);
		return data.rows[0];
	} catch (error) {
		console.error("model error: " + error);
	}
}

// Delete Inventory
async function deleteInventory(inv_id) {
	try {
		const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
		const data = await pool.query(sql, [inv_id]);
		return data;
	} catch (error) {
		new Error("Delete Inventory Error");
	}
}

module.exports = {
	getClassifications,
	getInventoryByClassificationId,
	getInventoryByInvId,
	addClassificationName,
	ifClasificationNameExists,
	addVehicle,
	updateInventory,
	deleteInventory,
};

// "UPDATE public.inventory SET inv_make = $9, inv_model = $10, inv_description = $5, inv_image = $6, inv_thumbnail = $7, inv_price = $2, inv_year = $11, inv_miles = $3, inv_color = $8, classification_id = $4 WHERE inv_id = $1 RETURNING *";
