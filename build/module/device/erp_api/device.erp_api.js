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
exports.Device_Erp_Api = void 0;
const axios_1 = require("../../../config/axios");
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.axios_instance.post("/api/method/dpms_sf.dpms_sf.api.smart_office.create_biometric_devices", {
            device_list: data
        });
        return result.data.message;
    }
    catch (err) {
        console.log(err);
    }
});
const get_all = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.axios_instance.get("/api/method/dpms_sf.dpms_sf.api.smart_office.get_all_biometric_devices");
        return result.data.message;
    }
    catch (err) {
        console.log(err);
    }
});
const update = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.axios_instance.post("/api/method/dpms_sf.dpms_sf.api.smart_office.update_biometric_devices", {
            device_update_list: data
        });
        return result.data.message;
    }
    catch (err) {
        console.log(err);
    }
});
exports.Device_Erp_Api = {
    create,
    get_all,
    update
};
