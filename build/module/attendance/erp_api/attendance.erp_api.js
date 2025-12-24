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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance_Erp_Api = void 0;
const axios_1 = require("../../../config/axios");
const get_max_table_row_id = (table_name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.axios_instance.get("/api/method/dpms_sf.dpms_sf.api.smart_office.get_biometric_table_state", {
            params: {
                table_name
            }
        });
        return result.data.message;
    }
    catch (error) {
        console.log(error);
    }
});
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.axios_instance.post("/api/method/dpms_sf.dpms_sf.api.smart_office.create_attendance_from_biometric_records", {
            attendance_list: data
        });
        return result.data.message;
    }
    catch (err) {
        console.log(err);
        console.log(err.response.data);
    }
});
exports.Attendance_Erp_Api = {
    get_max_table_row_id,
    create,
};
