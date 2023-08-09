const mongoose = require('mongoose');

const awatingUser = mongoose.Schema({

	email: {
		type: String,
		required: [true, 'email is required'],
	}

}, {timestamps: true});

module.exports = mongoose.model("awaitingUsers", awatingUser);