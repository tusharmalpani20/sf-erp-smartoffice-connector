"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.biomax_axios_instance = void 0;
const axios_1 = __importDefault(require("axios"));
const biomax_axios_instance = axios_1.default.create({
    baseURL: 'https://smartoffice.sidsfarm.com',
    params: {
        APIKey: process.env.BIOMAX_APIKEY
    }
});
exports.biomax_axios_instance = biomax_axios_instance;
