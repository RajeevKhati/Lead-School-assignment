var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
	name: String,
	age: String,
	school: String,
	class: String,
	division: String,
	status: String,
	dateOfBirth: String
});

module.exports = mongoose.model("Student", studentSchema);