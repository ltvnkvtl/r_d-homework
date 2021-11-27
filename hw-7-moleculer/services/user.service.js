"use strict";

const { MoleculerClientError } = require("moleculer").Errors;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DbService = require("../mixins/db.mixin");

module.exports = {
 name: "users",
 mixins: [DbService("users")],

 /**
  * Default settings
  */
 settings: {
  /** Secret for JWT */
  JWT_SECRET: process.env.JWT_SECRET || "jwt-conduit-secret",

  /** Public fields */
  fields: ["_id", "username", "email"],

  /** Validator schema for entity */
  entityValidator: {
   username: { type: "string", min: 2, pattern: /^[a-zA-Z0-9]+$/ },
   password: { type: "string", min: 5 },
   email: { type: "email" },
  }
 },

 actions: {
  // Register a new user
  create: {
   params: {
    user: { type: "object" }
   },
   handler(ctx) {
    let entity = ctx.params.user;
    return this.validateEntity(entity)
     .then(() => {
      if (entity.username)
       return this.adapter.findOne({ username: entity.username })
        .then(found => {
         if (found)
          return Promise.reject(new MoleculerClientError("Username is exist!", 422, "", [{ field: "username", message: "is exist"}]));

        });
     })
     .then(() => {
      if (entity.email)
       return this.adapter.findOne({ email: entity.email })
        .then(found => {
         if (found)
          return Promise.reject(new MoleculerClientError("Email is exist!", 422, "", [{ field: "email", message: "is exist"}]));
        });

     })
     .then(() => {
      entity.password = bcrypt.hashSync(entity.password, 3);
      entity.createdAt = new Date();

      return this.adapter.insert(entity)
       .then(doc => this.transformDocuments(ctx, {}, doc))
       .then(user => this.transformEntity(user, true, ctx.meta.token))
       .then(json => this.entityChanged("created", json, ctx).then(() => json));
     });
   }
  },

  // Login with email & password
  login: {
   params: {
    user: { type: "object", props: {
      email: { type: "email" },
      password: { type: "string", min: 1 }
     }}
   },
   handler(ctx) {
    const { email, password } = ctx.params.user;

    return this.Promise.resolve()
     .then(() => this.adapter.findOne({ email }))
     .then(user => {
      if (!user)
       return this.Promise.reject(new MoleculerClientError("Email or password is invalid!", 422, "", [{ field: "email", message: "is not found"}]));

      return bcrypt.compare(password, user.password).then(res => {
       if (!res)
        return Promise.reject(new MoleculerClientError("Wrong password!", 422, "", [{ field: "email", message: "is not found"}]));

       // Transform user entity (remove password and all protected fields)
       return this.transformDocuments(ctx, {}, user);
      });
     })
     .then(user => this.transformEntity(user, true, ctx.meta.token));
   }
  },

  // Get user by JWT token (for API GW authentication)
  byToken: {
   params: {
    token: "string"
   },
   handler(ctx) {
    return new this.Promise((resolve, reject) => {
     jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err, decoded) => {
      if (err)
       return reject(err);

      resolve(decoded);
     });

    })
     .then(decoded => {
      if (decoded.id)
       return this.getById(decoded.id);
     });
   }
  },

  // Get current user entity. Auth is required!
  myself: {
   auth: "required",
   cache: {
    keys: ["#token"]
   },
   handler(ctx) {
    return this.getById(ctx.meta.user._id)
     .then(user => {
      if (!user)
       return this.Promise.reject(new MoleculerClientError("User not found!", 400));

      return this.transformDocuments(ctx, {}, user);
     })
     .then(user => this.transformEntity(user, true, ctx.meta.token));
   }
  },

  // Update current user entity. Auth is required!
  updateMyself: {
   auth: "required",
   params: {
    user: { type: "object", props: {
      username: { type: "string", min: 2, optional: true, pattern: /^[a-zA-Z0-9]+$/ },
      password: { type: "string", min: 5, optional: true },
      email: { type: "email", optional: true },
     }}
   },
   handler(ctx) {
    const newData = ctx.params.user;
    return this.Promise.resolve()
     .then(() => {
      if (newData.username)
       return this.adapter.findOne({ username: newData.username })
        .then(found => {
         if (found && found._id.toString() !== ctx.meta.user._id.toString())
          return Promise.reject(new MoleculerClientError("Username is exist!", 422, "", [{ field: "username", message: "is exist"}]));

        });
     })
     .then(() => {
      if (newData.email)
       return this.adapter.findOne({ email: newData.email })
        .then(found => {
         if (found && found._id.toString() !== ctx.meta.user._id.toString())
          return Promise.reject(new MoleculerClientError("Email is exist!", 422, "", [{ field: "email", message: "is exist"}]));
        });

     })
     .then(() => {
      newData.updatedAt = new Date();
      const update = {
       "$set": newData
      };
      return this.adapter.updateById(ctx.meta.user._id, update);
     })
     .then(doc => this.transformDocuments(ctx, {}, doc))
     .then(user => this.transformEntity(user, true, ctx.meta.token))
     .then(json => this.entityChanged("updated", json, ctx).then(() => json));

   }
  },
 },

 methods: {
  // Generate a JWT token from user entity
  generateJWT(user) {
   const today = new Date();
   const exp = new Date(today);
   exp.setDate(today.getDate() + 60);

   return jwt.sign({
    id: user._id,
    username: user.username,
    exp: Math.floor(exp.getTime() / 1000)
   }, this.settings.JWT_SECRET);
  },

  // Transform returned user entity. Generate JWT token if neccessary.
  transformEntity(user, withToken, token) {
   if (user) {
    if (withToken)
     user.token = token || this.generateJWT(user);
   }

   return { user };
  },
 },

};
