"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee_Biomax_Api = void 0;
const axios_1 = __importDefault(require("axios"));
const biomax_axios_1 = require("../../../config/biomax.axios");
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield biomax_axios_1.biomax_axios_instance.post("/api/v2/WebAPI/AddEmployee", data);
        console.log(data);
        console.log(result.data);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
const add_user_to_device = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.post(`${data.server_url.replace("/hdata.aspx", "")}/api/v2/WebAPI/UploadUser`, {}, {
            params: {
                APIKey: process.env.BIOMAX_APIKEY,
                EmployeeCode: data.EmployeeCode,
                EmployeeName: data.EmployeeName,
                CardNumber: data.CardNumber,
                SerialNumbers: data.SerialNumbers,
                VerifyMode: data.VerifyMode
            }
        });
        return true;
    }
    catch (error) {
        console.error(`Error in add_user_to_device: ${error.message}`);
        console.log(error.response.data);
        return false;
    }
});
const delete_user_from_device = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.post(`${data.server_url.replace("/hdata.aspx", "")}/api/v2/WebAPI/DeleteUser`, {}, {
            params: {
                APIKey: process.env.BIOMAX_APIKEY,
                EmployeeCode: data.EmployeeCode,
                SerialNumbers: data.SerialNumbers
            }
        });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
exports.Employee_Biomax_Api = {
    create,
    add_user_to_device,
    delete_user_from_device
};
