// BUild this function in week 5
// This function will not allow the "Update" button from executing unless some data has changed.

const form = document.getElementById("updateForm");
form.addEventListener("change", function () {
	const updateBtn = document.getElementById("updateBtn");
	updateBtn.removeAttribute("disabled");
});
