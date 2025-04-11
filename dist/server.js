"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const app_js_1 = __importDefault(require("./app.js"));
(0, node_server_1.serve)({ fetch: app_js_1.default.fetch, port: 3000 }, () => {
    console.log('🚀 Server listening on http://localhost:3000');
});
