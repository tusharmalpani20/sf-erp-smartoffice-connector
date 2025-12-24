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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee_Service = void 0;
const date_helper_1 = require("../../../common/helper/date.helper");
const device_erp_api_1 = require("../../device/erp_api/device.erp_api");
const device_model_1 = require("../../device/model/device.model");
const location_erp_api_1 = require("../../location/location_erp_api/location.erp_api");
const employee_biomax_api_1 = require("../biomax_api/employee.biomax_api");
const employee_erp_api_1 = require("../erp_api/employee.erp_api");
const employee_model_1 = require("../model/employee.model");
const import_employee_to_biomax_from_erpnext_via_biomax_api = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j, _k, e_4, _l, _m, _o, e_5, _p, _q;
    console.info(`${new Date().toLocaleString()}\t Importing employee to Biomax from ERPNext`);
    const employee_erpnext_list = yield employee_erp_api_1.Employee_Erp_Api.get_all();
    const location_erpnext_list = yield location_erp_api_1.Location_Erp_Api.get_all();
    const location_erpnext_id_map = {};
    try {
        for (var _r = true, _s = __asyncValues(location_erpnext_list.data.points), _t; _t = yield _s.next(), _a = _t.done, !_a; _r = true) {
            _c = _t.value;
            _r = false;
            const location = _c;
            location.smart_office_id && (location_erpnext_id_map[location.smart_office_id] = location);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_r && !_a && (_b = _s.return)) yield _b.call(_s);
        }
        finally { if (e_1) throw e_1.error; }
    }
    ;
    const device_biomax_list = yield device_model_1.Device_Model.get_all();
    const device_biomax_location_map = {};
    try {
        for (var _u = true, _v = __asyncValues(device_biomax_list.recordset), _w; _w = yield _v.next(), _d = _w.done, !_d; _u = true) {
            _f = _w.value;
            _u = false;
            const device = _f;
            if (device.DeviceLocation) {
                device_biomax_location_map[device.DeviceLocation] = device;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_u && !_d && (_e = _v.return)) yield _e.call(_v);
        }
        finally { if (e_2) throw e_2.error; }
    }
    ;
    const device_erpnext_list = yield device_erp_api_1.Device_Erp_Api.get_all();
    const device_erpnext_serial_number_map = {};
    try {
        for (var _x = true, _y = __asyncValues(device_erpnext_list.data.devices), _z; _z = yield _y.next(), _g = _z.done, !_g; _x = true) {
            _j = _z.value;
            _x = false;
            const device = _j;
            device.serial_number && (device_erpnext_serial_number_map[device.serial_number] = device);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (!_x && !_g && (_h = _y.return)) yield _h.call(_y);
        }
        finally { if (e_3) throw e_3.error; }
    }
    ;
    const employee_to_create_in_biomax = [];
    try {
        for (var _0 = true, _1 = __asyncValues(employee_erpnext_list.data.employees), _2; _2 = yield _1.next(), _k = _2.done, !_k; _0 = true) {
            _m = _2.value;
            _0 = false;
            const employee = _m;
            if (!employee.attendance_device_id) {
                const location_details = employee.custom_point && location_erpnext_id_map[employee.custom_point] ? location_erpnext_id_map[employee.custom_point] : null;
                employee_to_create_in_biomax.push({
                    StaffCode: employee.id,
                    StaffName: employee.employee_name,
                    Gender: employee.gender,
                    Location: location_details ? location_details.id : "Default",
                    Status: "Working",
                    CompanySName: "Default",
                    CategorySName: "Default",
                    HolidayGroupCode: "Default",
                    ShiftGroupCode: "Default",
                    DepartmentSName: "Default",
                    Grade: "Default",
                    Team: "Default",
                });
            }
            ;
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (!_0 && !_k && (_l = _1.return)) yield _l.call(_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    ;
    const employee_with_biomax_id_list = [];
    try {
        for (var _3 = true, employee_to_create_in_biomax_1 = __asyncValues(employee_to_create_in_biomax), employee_to_create_in_biomax_1_1; employee_to_create_in_biomax_1_1 = yield employee_to_create_in_biomax_1.next(), _o = employee_to_create_in_biomax_1_1.done, !_o; _3 = true) {
            _q = employee_to_create_in_biomax_1_1.value;
            _3 = false;
            const employee = _q;
            const is_user_added_to_biomax = yield employee_biomax_api_1.Employee_Biomax_Api.create(employee);
            const biomax_employee_detail = yield employee_model_1.Employee_Model.get_by_employee_code(employee.StaffCode);
            if (biomax_employee_detail.recordset.length > 0) {
                yield employee_model_1.Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);
            }
            if (is_user_added_to_biomax) {
                let device_erpnext_name = null;
                const biomax_employee_detail = yield employee_model_1.Employee_Model.get_by_employee_code(employee.StaffCode);
                if (employee.Location && device_biomax_location_map[employee.Location]) {
                    const device_info = device_biomax_location_map[employee.Location];
                    const current_time = new Date();
                    const last_ping_time = device_info.LastPing ? (0, date_helper_1.biomax_date_to_js_date)(device_info.LastPing) : null;
                    const server_url = device_info.ServerURL ? device_info.ServerURL.trim() : null;
                    const is_device_online = last_ping_time && current_time.getTime() - last_ping_time.getTime() < 2 * 60 * 1000;
                    if (server_url && is_device_online) {
                        const is_user_added_to_device = yield employee_biomax_api_1.Employee_Biomax_Api.add_user_to_device({
                            server_url: server_url,
                            EmployeeCode: employee.StaffCode,
                            EmployeeName: employee.StaffName,
                            SerialNumbers: device_info.SerialNumber,
                            VerifyMode: 1,
                        });
                        if (is_user_added_to_device) {
                            device_erpnext_name = device_erpnext_serial_number_map[device_info.SerialNumber] ? device_erpnext_serial_number_map[device_info.SerialNumber].id : null;
                        }
                        else {
                            device_erpnext_name = null;
                            yield employee_model_1.Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);
                        }
                    }
                    else {
                        device_erpnext_name = null;
                        yield employee_model_1.Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);
                    }
                }
                else {
                    device_erpnext_name = null;
                    yield employee_model_1.Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);
                }
                if (!device_erpnext_name) {
                    yield employee_model_1.Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);
                }
                employee_with_biomax_id_list.push({
                    name: employee.StaffCode,
                    attendance_device_id: biomax_employee_detail.recordset[0].EmployeeId.toString(),
                    custom_biometric_device: device_erpnext_name ? device_erpnext_name : null
                });
            }
            console.log(employee.StaffCode, is_user_added_to_biomax);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (!_3 && !_o && (_p = employee_to_create_in_biomax_1.return)) yield _p.call(employee_to_create_in_biomax_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    ;
    if (employee_with_biomax_id_list.length > 0) {
        const chunkSize = 500;
        for (let i = 0; i < employee_with_biomax_id_list.length; i += chunkSize) {
            const chunk = employee_with_biomax_id_list.slice(i, i + chunkSize);
            yield employee_erp_api_1.Employee_Erp_Api.update_employee_id(chunk);
        }
    }
    ;
    console.info(`${new Date().toLocaleString()}\t Importing employee to Biomax from ERPNext completed`);
});
const remove_employee_from_devices = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_6, _b, _c, _d, e_7, _e, _f, _g, e_8, _h, _j, _k, e_9, _l, _m, _o, e_10, _p, _q, _r, e_11, _s, _t, _u, e_12, _v, _w, _x, e_13, _y, _z;
    console.info(`${new Date().toLocaleString()}\t Removing employee from devices`);
    const employee_erpnext_list = yield employee_erp_api_1.Employee_Erp_Api.get_all();
    const employee_biomax_list = yield employee_model_1.Employee_Model.get_all();
    const employee_biomax_id_map = {};
    try {
        for (var _0 = true, _1 = __asyncValues(employee_biomax_list.recordset), _2; _2 = yield _1.next(), _a = _2.done, !_a; _0 = true) {
            _c = _2.value;
            _0 = false;
            const employee = _c;
            employee_biomax_id_map[employee.EmployeeId.toString()] = employee;
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (!_0 && !_a && (_b = _1.return)) yield _b.call(_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    ;
    const device_erpnext_list = yield device_erp_api_1.Device_Erp_Api.get_all();
    const device_erpnext_id_map = {};
    try {
        for (var _3 = true, _4 = __asyncValues(device_erpnext_list.data.devices), _5; _5 = yield _4.next(), _d = _5.done, !_d; _3 = true) {
            _f = _5.value;
            _3 = false;
            const device = _f;
            device_erpnext_id_map[device.id] = device;
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (!_3 && !_d && (_e = _4.return)) yield _e.call(_4);
        }
        finally { if (e_7) throw e_7.error; }
    }
    ;
    const location_erpnext_list = yield location_erp_api_1.Location_Erp_Api.get_all();
    const location_erpnext_id_map = {};
    try {
        for (var _6 = true, _7 = __asyncValues(location_erpnext_list.data.points), _8; _8 = yield _7.next(), _g = _8.done, !_g; _6 = true) {
            _j = _8.value;
            _6 = false;
            const location = _j;
            location_erpnext_id_map[location.id] = location;
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (!_6 && !_g && (_h = _7.return)) yield _h.call(_7);
        }
        finally { if (e_8) throw e_8.error; }
    }
    ;
    const location_biomax_id_map = {};
    try {
        for (var _9 = true, _10 = __asyncValues(location_erpnext_list.data.points), _11; _11 = yield _10.next(), _k = _11.done, !_k; _9 = true) {
            _m = _11.value;
            _9 = false;
            const location = _m;
            location.smart_office_id && (location_biomax_id_map[location.smart_office_id] = location);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (!_9 && !_k && (_l = _10.return)) yield _l.call(_10);
        }
        finally { if (e_9) throw e_9.error; }
    }
    ;
    const device_biomax_list = yield device_model_1.Device_Model.get_all();
    const device_biomax_id_map = {};
    try {
        for (var _12 = true, _13 = __asyncValues(device_biomax_list.recordset), _14; _14 = yield _13.next(), _o = _14.done, !_o; _12 = true) {
            _q = _14.value;
            _12 = false;
            const device = _q;
            device_biomax_id_map[device.DeviceId.toString()] = device;
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (!_12 && !_o && (_p = _13.return)) yield _p.call(_13);
        }
        finally { if (e_10) throw e_10.error; }
    }
    ;
    const device_biomax_location_map = {};
    try {
        for (var _15 = true, _16 = __asyncValues(device_biomax_list.recordset), _17; _17 = yield _16.next(), _r = _17.done, !_r; _15 = true) {
            _t = _17.value;
            _15 = false;
            const device = _t;
            device.DeviceLocation && (device_biomax_location_map[device.DeviceLocation] = device);
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (!_15 && !_r && (_s = _16.return)) yield _s.call(_16);
        }
        finally { if (e_11) throw e_11.error; }
    }
    ;
    const device_biomax_serial_number_map = {};
    try {
        for (var _18 = true, _19 = __asyncValues(device_biomax_list.recordset), _20; _20 = yield _19.next(), _u = _20.done, !_u; _18 = true) {
            _w = _20.value;
            _18 = false;
            const device = _w;
            device.SerialNumber && (device_biomax_serial_number_map[device.SerialNumber] = device);
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (!_18 && !_u && (_v = _19.return)) yield _v.call(_19);
        }
        finally { if (e_12) throw e_12.error; }
    }
    ;
    try {
        for (var _21 = true, _22 = __asyncValues(employee_erpnext_list.data.employees), _23; _23 = yield _22.next(), _x = _23.done, !_x; _21 = true) {
            _z = _23.value;
            _21 = false;
            const employee = _z;
            if (!employee.attendance_device_id) {
                continue;
            }
            if (!employee.custom_point) {
                continue;
            }
            const erpnext_location_info = location_erpnext_id_map[employee.custom_point];
            if (!erpnext_location_info.smart_office_id) {
                continue;
            }
            const bio_max_employee = employee_biomax_id_map[employee.attendance_device_id];
            const employee_biomax_location_id = bio_max_employee.Location;
            if (employee_biomax_location_id == 23) {
                yield employee_model_1.Employee_Model.update_location(bio_max_employee.EmployeeId, null);
                continue;
            }
            const erpnext_location_id = Number(erpnext_location_info.smart_office_id);
            if (!employee_biomax_location_id) {
                continue;
            }
            if (employee_biomax_location_id == erpnext_location_id) {
                continue;
            }
            const previous_device_serial_number = employee.custom_biometric_device ? (device_erpnext_id_map[employee.custom_biometric_device].serial_number) : null;
            if (previous_device_serial_number) {
                const biomax_device_details = device_biomax_serial_number_map[previous_device_serial_number];
                const current_time = new Date();
                const last_ping_time = biomax_device_details.LastPing ? (0, date_helper_1.biomax_date_to_js_date)(biomax_device_details.LastPing) : null;
                const is_device_online = last_ping_time && current_time.getTime() - last_ping_time.getTime() < 2 * 60 * 1000;
                if (biomax_device_details.ServerURL && is_device_online) {
                    const result = yield employee_biomax_api_1.Employee_Biomax_Api.delete_user_from_device({
                        server_url: biomax_device_details.ServerURL,
                        EmployeeCode: employee.id,
                        SerialNumbers: biomax_device_details.SerialNumber,
                    });
                    console.log("Employee deleted from device: ", result);
                    if (result) {
                        yield employee_model_1.Employee_Model.update_location(bio_max_employee.EmployeeId, null);
                        yield employee_erp_api_1.Employee_Erp_Api.update_employee_biometric_device({
                            name: employee.id,
                            custom_biometric_device: null
                        });
                    }
                    else {
                        console.log("Employee deletion from device failed: ", result);
                    }
                }
                else {
                    continue;
                }
            }
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (!_21 && !_x && (_y = _22.return)) yield _y.call(_22);
        }
        finally { if (e_13) throw e_13.error; }
    }
    console.info(`${new Date().toLocaleString()}\t Removing employee from devices completed`);
});
const remove_employee_from_devices_with_status_left_or_inactive = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_14, _b, _c, _d, e_15, _e, _f, _g, e_16, _h, _j, _k, e_17, _l, _m, _o, e_18, _p, _q, _r, e_19, _s, _t, _u, e_20, _v, _w, _x, e_21, _y, _z;
    console.info(`${new Date().toLocaleString()}\t Removing inactive or left employees from devices`);
    const employee_erpnext_list = yield employee_erp_api_1.Employee_Erp_Api.get_all_inactive_or_left_employees_having_device_id();
    const employee_biomax_list = yield employee_model_1.Employee_Model.get_all();
    const employee_biomax_id_map = {};
    try {
        for (var _0 = true, _1 = __asyncValues(employee_biomax_list.recordset), _2; _2 = yield _1.next(), _a = _2.done, !_a; _0 = true) {
            _c = _2.value;
            _0 = false;
            const employee = _c;
            employee_biomax_id_map[employee.EmployeeId.toString()] = employee;
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (!_0 && !_a && (_b = _1.return)) yield _b.call(_1);
        }
        finally { if (e_14) throw e_14.error; }
    }
    ;
    const device_erpnext_list = yield device_erp_api_1.Device_Erp_Api.get_all();
    const device_erpnext_id_map = {};
    try {
        for (var _3 = true, _4 = __asyncValues(device_erpnext_list.data.devices), _5; _5 = yield _4.next(), _d = _5.done, !_d; _3 = true) {
            _f = _5.value;
            _3 = false;
            const device = _f;
            device_erpnext_id_map[device.id] = device;
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (!_3 && !_d && (_e = _4.return)) yield _e.call(_4);
        }
        finally { if (e_15) throw e_15.error; }
    }
    ;
    const location_erpnext_list = yield location_erp_api_1.Location_Erp_Api.get_all();
    const location_erpnext_id_map = {};
    try {
        for (var _6 = true, _7 = __asyncValues(location_erpnext_list.data.points), _8; _8 = yield _7.next(), _g = _8.done, !_g; _6 = true) {
            _j = _8.value;
            _6 = false;
            const location = _j;
            location_erpnext_id_map[location.id] = location;
        }
    }
    catch (e_16_1) { e_16 = { error: e_16_1 }; }
    finally {
        try {
            if (!_6 && !_g && (_h = _7.return)) yield _h.call(_7);
        }
        finally { if (e_16) throw e_16.error; }
    }
    ;
    const location_biomax_id_map = {};
    try {
        for (var _9 = true, _10 = __asyncValues(location_erpnext_list.data.points), _11; _11 = yield _10.next(), _k = _11.done, !_k; _9 = true) {
            _m = _11.value;
            _9 = false;
            const location = _m;
            location.smart_office_id && (location_biomax_id_map[location.smart_office_id] = location);
        }
    }
    catch (e_17_1) { e_17 = { error: e_17_1 }; }
    finally {
        try {
            if (!_9 && !_k && (_l = _10.return)) yield _l.call(_10);
        }
        finally { if (e_17) throw e_17.error; }
    }
    ;
    const device_biomax_list = yield device_model_1.Device_Model.get_all();
    const device_biomax_id_map = {};
    try {
        for (var _12 = true, _13 = __asyncValues(device_biomax_list.recordset), _14; _14 = yield _13.next(), _o = _14.done, !_o; _12 = true) {
            _q = _14.value;
            _12 = false;
            const device = _q;
            device_biomax_id_map[device.DeviceId.toString()] = device;
        }
    }
    catch (e_18_1) { e_18 = { error: e_18_1 }; }
    finally {
        try {
            if (!_12 && !_o && (_p = _13.return)) yield _p.call(_13);
        }
        finally { if (e_18) throw e_18.error; }
    }
    ;
    const device_biomax_location_map = {};
    try {
        for (var _15 = true, _16 = __asyncValues(device_biomax_list.recordset), _17; _17 = yield _16.next(), _r = _17.done, !_r; _15 = true) {
            _t = _17.value;
            _15 = false;
            const device = _t;
            device.DeviceLocation && (device_biomax_location_map[device.DeviceLocation] = device);
        }
    }
    catch (e_19_1) { e_19 = { error: e_19_1 }; }
    finally {
        try {
            if (!_15 && !_r && (_s = _16.return)) yield _s.call(_16);
        }
        finally { if (e_19) throw e_19.error; }
    }
    ;
    const device_biomax_serial_number_map = {};
    try {
        for (var _18 = true, _19 = __asyncValues(device_biomax_list.recordset), _20; _20 = yield _19.next(), _u = _20.done, !_u; _18 = true) {
            _w = _20.value;
            _18 = false;
            const device = _w;
            device.SerialNumber && (device_biomax_serial_number_map[device.SerialNumber] = device);
        }
    }
    catch (e_20_1) { e_20 = { error: e_20_1 }; }
    finally {
        try {
            if (!_18 && !_u && (_v = _19.return)) yield _v.call(_19);
        }
        finally { if (e_20) throw e_20.error; }
    }
    ;
    try {
        for (var _21 = true, _22 = __asyncValues(employee_erpnext_list.data.employees), _23; _23 = yield _22.next(), _x = _23.done, !_x; _21 = true) {
            _z = _23.value;
            _21 = false;
            const employee = _z;
            if (!employee.attendance_device_id) {
                continue;
            }
            if (!employee.custom_point) {
                continue;
            }
            const erpnext_location_info = location_erpnext_id_map[employee.custom_point];
            if (!erpnext_location_info.smart_office_id) {
                continue;
            }
            const bio_max_employee = employee_biomax_id_map[employee.attendance_device_id];
            const employee_biomax_location_id = bio_max_employee.Location;
            if (!employee_biomax_location_id) {
                continue;
            }
            const device_serial_number = employee.custom_biometric_device ? (device_erpnext_id_map[employee.custom_biometric_device].serial_number) : null;
            if (device_serial_number) {
                const biomax_device_details = device_biomax_serial_number_map[device_serial_number];
                const current_time = new Date();
                const last_ping_time = biomax_device_details.LastPing ? (0, date_helper_1.biomax_date_to_js_date)(biomax_device_details.LastPing) : null;
                const is_device_online = last_ping_time && current_time.getTime() - last_ping_time.getTime() < 2 * 60 * 1000;
                if (biomax_device_details.ServerURL && is_device_online) {
                    const result = yield employee_biomax_api_1.Employee_Biomax_Api.delete_user_from_device({
                        server_url: biomax_device_details.ServerURL,
                        EmployeeCode: employee.id,
                        SerialNumbers: biomax_device_details.SerialNumber,
                    });
                    console.log("Employee deleted from device: ", result);
                    if (result) {
                        yield employee_model_1.Employee_Model.update_location(bio_max_employee.EmployeeId, null);
                        yield employee_erp_api_1.Employee_Erp_Api.update_employee_biometric_device({
                            name: employee.id,
                            custom_biometric_device: null
                        });
                    }
                    else {
                        console.log("Employee deletion from device failed: ", result);
                    }
                }
                else {
                    continue;
                }
            }
        }
    }
    catch (e_21_1) { e_21 = { error: e_21_1 }; }
    finally {
        try {
            if (!_21 && !_x && (_y = _22.return)) yield _y.call(_22);
        }
        finally { if (e_21) throw e_21.error; }
    }
    console.info(`${new Date().toLocaleString()}\t Removing employee from devices completed`);
});
const add_employee_to_devices = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_22, _b, _c, _d, e_23, _e, _f, _g, e_24, _h, _j, _k, e_25, _l, _m, _o, e_26, _p, _q, _r, e_27, _s, _t, _u, e_28, _v, _w, _x, e_29, _y, _z, _0, e_30, _1, _2;
    console.info(`${new Date().toLocaleString()}\t Adding employee to devices`);
    const employee_erpnext_list = yield employee_erp_api_1.Employee_Erp_Api.get_all();
    const employee_biomax_list = yield employee_model_1.Employee_Model.get_all();
    const employee_biomax_id_map = {};
    try {
        for (var _3 = true, _4 = __asyncValues(employee_biomax_list.recordset), _5; _5 = yield _4.next(), _a = _5.done, !_a; _3 = true) {
            _c = _5.value;
            _3 = false;
            const employee = _c;
            employee_biomax_id_map[employee.EmployeeId.toString()] = employee;
        }
    }
    catch (e_22_1) { e_22 = { error: e_22_1 }; }
    finally {
        try {
            if (!_3 && !_a && (_b = _4.return)) yield _b.call(_4);
        }
        finally { if (e_22) throw e_22.error; }
    }
    ;
    const device_erpnext_list = yield device_erp_api_1.Device_Erp_Api.get_all();
    const device_erpnext_id_map = {};
    try {
        for (var _6 = true, _7 = __asyncValues(device_erpnext_list.data.devices), _8; _8 = yield _7.next(), _d = _8.done, !_d; _6 = true) {
            _f = _8.value;
            _6 = false;
            const device = _f;
            device_erpnext_id_map[device.id] = device;
        }
    }
    catch (e_23_1) { e_23 = { error: e_23_1 }; }
    finally {
        try {
            if (!_6 && !_d && (_e = _7.return)) yield _e.call(_7);
        }
        finally { if (e_23) throw e_23.error; }
    }
    ;
    const device_erpnext_serial_number_map = {};
    try {
        for (var _9 = true, _10 = __asyncValues(device_erpnext_list.data.devices), _11; _11 = yield _10.next(), _g = _11.done, !_g; _9 = true) {
            _j = _11.value;
            _9 = false;
            const device = _j;
            device.serial_number && (device_erpnext_serial_number_map[device.serial_number] = device);
        }
    }
    catch (e_24_1) { e_24 = { error: e_24_1 }; }
    finally {
        try {
            if (!_9 && !_g && (_h = _10.return)) yield _h.call(_10);
        }
        finally { if (e_24) throw e_24.error; }
    }
    ;
    const location_erpnext_list = yield location_erp_api_1.Location_Erp_Api.get_all();
    const location_erpnext_id_map = {};
    try {
        for (var _12 = true, _13 = __asyncValues(location_erpnext_list.data.points), _14; _14 = yield _13.next(), _k = _14.done, !_k; _12 = true) {
            _m = _14.value;
            _12 = false;
            const location = _m;
            location_erpnext_id_map[location.id] = location;
        }
    }
    catch (e_25_1) { e_25 = { error: e_25_1 }; }
    finally {
        try {
            if (!_12 && !_k && (_l = _13.return)) yield _l.call(_13);
        }
        finally { if (e_25) throw e_25.error; }
    }
    ;
    const location_biomax_id_map = {};
    try {
        for (var _15 = true, _16 = __asyncValues(location_erpnext_list.data.points), _17; _17 = yield _16.next(), _o = _17.done, !_o; _15 = true) {
            _q = _17.value;
            _15 = false;
            const location = _q;
            location.smart_office_id && (location_biomax_id_map[location.smart_office_id] = location);
        }
    }
    catch (e_26_1) { e_26 = { error: e_26_1 }; }
    finally {
        try {
            if (!_15 && !_o && (_p = _16.return)) yield _p.call(_16);
        }
        finally { if (e_26) throw e_26.error; }
    }
    ;
    const device_biomax_list = yield device_model_1.Device_Model.get_all();
    const device_biomax_id_map = {};
    try {
        for (var _18 = true, _19 = __asyncValues(device_biomax_list.recordset), _20; _20 = yield _19.next(), _r = _20.done, !_r; _18 = true) {
            _t = _20.value;
            _18 = false;
            const device = _t;
            device_biomax_id_map[device.DeviceId.toString()] = device;
        }
    }
    catch (e_27_1) { e_27 = { error: e_27_1 }; }
    finally {
        try {
            if (!_18 && !_r && (_s = _19.return)) yield _s.call(_19);
        }
        finally { if (e_27) throw e_27.error; }
    }
    ;
    const device_biomax_location_map = {};
    try {
        for (var _21 = true, _22 = __asyncValues(device_biomax_list.recordset), _23; _23 = yield _22.next(), _u = _23.done, !_u; _21 = true) {
            _w = _23.value;
            _21 = false;
            const device = _w;
            device.DeviceLocation && (device_biomax_location_map[device.DeviceLocation] = device);
        }
    }
    catch (e_28_1) { e_28 = { error: e_28_1 }; }
    finally {
        try {
            if (!_21 && !_u && (_v = _22.return)) yield _v.call(_22);
        }
        finally { if (e_28) throw e_28.error; }
    }
    ;
    const device_biomax_serial_number_map = {};
    try {
        for (var _24 = true, _25 = __asyncValues(device_biomax_list.recordset), _26; _26 = yield _25.next(), _x = _26.done, !_x; _24 = true) {
            _z = _26.value;
            _24 = false;
            const device = _z;
            device.SerialNumber && (device_biomax_serial_number_map[device.SerialNumber] = device);
        }
    }
    catch (e_29_1) { e_29 = { error: e_29_1 }; }
    finally {
        try {
            if (!_24 && !_x && (_y = _25.return)) yield _y.call(_25);
        }
        finally { if (e_29) throw e_29.error; }
    }
    ;
    try {
        for (var _27 = true, _28 = __asyncValues(employee_erpnext_list.data.employees), _29; _29 = yield _28.next(), _0 = _29.done, !_0; _27 = true) {
            _2 = _29.value;
            _27 = false;
            const employee = _2;
            if (!employee.attendance_device_id) {
                continue;
            }
            if (!employee.custom_point) {
                continue;
            }
            const erpnext_location_info = location_erpnext_id_map[employee.custom_point];
            if (!erpnext_location_info.smart_office_id) {
                continue;
            }
            const bio_max_employee = employee_biomax_id_map[employee.attendance_device_id];
            const employee_biomax_location_id = bio_max_employee.Location;
            const erpnext_location_id = Number(erpnext_location_info.smart_office_id);
            if (!(employee_biomax_location_id == null && erpnext_location_id)) {
                continue;
            }
            const device_in_new_location = device_biomax_location_map[erpnext_location_id];
            if (!device_in_new_location) {
                continue;
            }
            const current_time = new Date();
            const last_ping_time = device_in_new_location.LastPing ? (0, date_helper_1.biomax_date_to_js_date)(device_in_new_location.LastPing) : null;
            const is_device_online = last_ping_time && current_time.getTime() - last_ping_time.getTime() < 2 * 60 * 1000;
            if (!is_device_online || !device_in_new_location.ServerURL) {
                continue;
            }
            device_in_new_location.ServerURL = device_in_new_location.ServerURL.trim();
            if (!device_in_new_location.ServerURL) {
                continue;
            }
            const reuslt = yield employee_biomax_api_1.Employee_Biomax_Api.add_user_to_device({
                server_url: device_in_new_location.ServerURL,
                EmployeeCode: employee.id,
                EmployeeName: employee.employee_name,
                CardNumber: "",
                SerialNumbers: device_in_new_location.SerialNumber,
                VerifyMode: 1
            });
            if (!reuslt) {
                continue;
            }
            console.log(employee.id, device_in_new_location.SerialNumber, reuslt);
            yield employee_model_1.Employee_Model.update_location(bio_max_employee.EmployeeId, erpnext_location_id);
            yield employee_erp_api_1.Employee_Erp_Api.update_employee_biometric_device({
                name: employee.id,
                custom_biometric_device: device_erpnext_serial_number_map[device_in_new_location.SerialNumber].id
            });
        }
    }
    catch (e_30_1) { e_30 = { error: e_30_1 }; }
    finally {
        try {
            if (!_27 && !_0 && (_1 = _28.return)) yield _1.call(_28);
        }
        finally { if (e_30) throw e_30.error; }
    }
    console.info(`${new Date().toLocaleString()}\t Adding employee to devices completed`);
});
exports.Employee_Service = {
    import_employee_to_biomax_from_erpnext_via_biomax_api,
    remove_employee_from_devices,
    remove_employee_from_devices_with_status_left_or_inactive,
    add_employee_to_devices
};
