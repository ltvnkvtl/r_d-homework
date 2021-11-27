"use strict";

const DbService	= require("moleculer-db");
require("dotenv").config();

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = function(collection) {
	const MongoAdapter = require("moleculer-db-adapter-mongo");

	return  {
		mixins: [DbService],
		adapter: new MongoAdapter(process.env.MONGO_URI),
		collection,
	};
};
