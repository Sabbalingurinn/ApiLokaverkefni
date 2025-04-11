"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const usersApi_js_1 = require("./routes/usersApi.js");
const recipesApi_js_1 = require("./routes/recipesApi.js");
const app = new hono_1.Hono();
app.route('/users', usersApi_js_1.usersApi);
app.route('/recipes', recipesApi_js_1.recipesApi);
app.get('/', (c) => {
    return c.text('Hono API virkar!');
});
exports.default = app;
