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
exports.Employee_Erp_Api = void 0;
const axios_1 = require("../../../config/axios");
const get_all = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.axios_instance.get("/api/method/dpms_sf.dpms_sf.api.smart_office.get_all_employees");
        return result.data.message;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
const get_all_inactive_or_left_employees_having_device_id = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.axios_instance.get("/api/method/dpms_sf.dpms_sf.api.smart_office.get_all_employees_inactive_or_left_with_biometric_device");
        return result.data.message;
    }
    catch (error) {
        console.error(error);
        return [];
    }
});
const update_employee_id = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.axios_instance.post("/api/method/dpms_sf.dpms_sf.api.smart_office.update_employee_attendance_device_id", {
            employee_update_list: data
        });
        return result.data.message;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
const update_employee_biometric_device = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.axios_instance.post("/api/method/dpms_sf.dpms_sf.api.smart_office.update_employee_biometric_device", data);
        return result.data.message;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.Employee_Erp_Api = {
    get_all,
    get_all_inactive_or_left_employees_having_device_id,
    update_employee_id,
    update_employee_biometric_device
};
