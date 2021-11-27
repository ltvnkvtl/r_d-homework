"use strict";

const _ = require("lodash");
const ApiGateway = require("moleculer-web");
const { UnAuthorizedError } = ApiGateway.Errors;


module.exports = {
	name: "api",
	mixins: [ApiGateway],

	settings: {
		port: process.env.PORT || 3000,

		routes: [
			{
				path: "/api",

				authorization: true,

				aliases: {
					// Login
					"POST /users/login": "users.login",

					// Create User
					"REST /users": "users",

					// Get user by JWT token (for auth middleware)
					"GET /user/token": "users.byToken",

					// Current user
					"GET /user": "users.myself",
					"PUT /user": "users.updateMyself",
				},

				// Disable to call not-mapped actions
				mappingPolicy: "restrict",

				// Set CORS headers
				cors: true,

				// Parse body content
				bodyParsers: {
					json: {
						strict: false
					},
					urlencoded: {
						extended: false
					}
				}
			}
		],
	},

	onError(req, res, err) {
		// Return with the error as JSON object
		res.setHeader("Content-type", "application/json; charset=utf-8");
		res.writeHead(err.code || 500);

		if (err.code === 422) {
			let o = {};
			err.data.forEach(e => {
				let field = e.field.split(".").pop();
				o[field] = e.message;
			});

			res.end(JSON.stringify({ errors: o }, null, 2));
		} else {
			const errObj = _.pick(err, ["name", "message", "code", "type", "data"]);
			res.end(JSON.stringify(errObj, null, 2));
		}
		this.logResponse(req, res, err? err.ctx : null);
	},

	methods: {
		// Authorize the request
		authorize(ctx, route, req) {
			let token;
			if (req.headers.authorization) {
				let type = req.headers.authorization.split(" ")[0];
				if (type === "Token" || type === "Bearer")
					token = req.headers.authorization.split(" ")[1];
			}

			return this.Promise.resolve(token)
				.then(token => {
					if (token) {
						// Verify JWT token
						return ctx.call("users.byToken", { token })
							.then(user => {
								if (user) {
									this.logger.info("Authenticated via JWT: ", user.username);
									// Reduce user fields (it will be transferred to other nodes)
									ctx.meta.user = _.pick(user, ["_id", "username", "email", "image"]);
									ctx.meta.token = token;
								}
								return user;
							})
							.catch(err => {
								// Ignored because we continue processing if user is not exist
								return null;
							});
					}
				})
				.then(user => {
					if (req.$endpoint.action.auth === "required" && !user)
						return this.Promise.reject(new UnAuthorizedError());
				});
		},
	},
};
