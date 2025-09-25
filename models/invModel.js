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
		return data.rows;
	} catch (error) {
		console.error(
			" There was an error retrieving Inventory-Data. " +
				error +
				" This should be from the inventory-model/Utilities/invController"
		);
	}
}

module.exports = {
	getClassifications,
	getInventoryByClassificationId,
	getInventoryByInvId,
};
