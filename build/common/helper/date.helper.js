"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql_time_format = exports.biomax_date_to_js_date = exports.sql_date_format = void 0;
const moment_1 = __importDefault(require("moment"));
const sql_date_format = (date, date_time = true) => {
    if (date_time) {
        return moment_1.default.utc(date).format("YYYY-MM-DD HH:mm:ss");
    }
    else {
        return moment_1.default.utc(date).format("YYYY-MM-DD");
    }
};
exports.sql_date_format = sql_date_format;
const biomax_date_to_js_date = (date) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - 5);
    newDate.setMinutes(newDate.getMinutes() - 30);
    return newDate;
};
exports.biomax_date_to_js_date = biomax_date_to_js_date;
const sql_time_format = (date) => {
    return moment_1.default.utc(date).format("HH:mm:ss");
};
exports.sql_time_format = sql_time_format;
