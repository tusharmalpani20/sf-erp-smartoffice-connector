"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axios_instance = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_instance = axios_1.default.create({
    baseURL: 'https://erpnext.sidsfarm.com',
    headers: {
        'Authorization': `token ${process.env.ERPNEXT_APIKEY}`,
        'Content-Type': 'application/json'
    }
});
exports.axios_instance = axios_instance;
