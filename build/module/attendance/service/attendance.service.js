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
exports.Attendance_Service = void 0;
const date_helper_1 = require("../../../common/helper/date.helper");
const device_erp_api_1 = require("../../device/erp_api/device.erp_api");
const employee_erp_api_1 = require("../../employee/erp_api/employee.erp_api");
const location_erp_api_1 = require("../../location/location_erp_api/location.erp_api");
const attendance_erp_api_1 = require("../erp_api/attendance.erp_api");
const attendance_helper_1 = require("../helper/attendance.helper");
const attendance_model_1 = require("../model/attendance.model");
const attendance_schema_1 = require("../schema/attendance.schema");
const import_attendance_to_erpnext_from_biomax = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (device_log_table_name = (0, attendance_helper_1.device_log_table_name_generator_for_biomax)()) {
    var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j, _k, e_4, _l, _m, _o, e_5, _p, _q;
    var _r, _s, _t, _u;
    console.info(`${new Date().toLocaleString()}\t Importing attendance to ERPNext from Biomax`);
    const employee_erpnext_list = yield employee_erp_api_1.Employee_Erp_Api.get_all();
    const employee_biomax_id_map = {};
    try {
        for (var _v = true, _w = __asyncValues(employee_erpnext_list.data.employees), _x; _x = yield _w.next(), _a = _x.done, !_a; _v = true) {
            _c = _x.value;
            _v = false;
            const employee = _c;
            if (employee.attendance_device_id) {
                employee_biomax_id_map[employee.attendance_device_id] = employee;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_v && !_a && (_b = _w.return)) yield _b.call(_w);
        }
        finally { if (e_1) throw e_1.error; }
    }
    ;
    const employee_erpnext_id_map = {};
    try {
        for (var _y = true, _z = __asyncValues(employee_erpnext_list.data.employees), _0; _0 = yield _z.next(), _d = _0.done, !_d; _y = true) {
            _f = _0.value;
            _y = false;
            const employee = _f;
            if (employee.id) {
                employee_erpnext_id_map[employee.id] = employee;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_y && !_d && (_e = _z.return)) yield _e.call(_z);
        }
        finally { if (e_2) throw e_2.error; }
    }
    ;
    const location_erpnext_list = yield location_erp_api_1.Location_Erp_Api.get_all();
    const location_erpnext_id_map = {};
    try {
        for (var _1 = true, _2 = __asyncValues(location_erpnext_list.data.points), _3; _3 = yield _2.next(), _g = _3.done, !_g; _1 = true) {
            _j = _3.value;
            _1 = false;
            const location = _j;
            location_erpnext_id_map[location.id] = location;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (!_1 && !_g && (_h = _2.return)) yield _h.call(_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    ;
    const device_erpnext_list = yield device_erp_api_1.Device_Erp_Api.get_all();
    const device_biomax_id_map = {};
    try {
        for (var _4 = true, _5 = __asyncValues(device_erpnext_list.data.devices), _6; _6 = yield _5.next(), _k = _6.done, !_k; _4 = true) {
            _m = _6.value;
            _4 = false;
            const device = _m;
            if (device.biometric_device_id) {
                device_biomax_id_map[device.biometric_device_id] = device;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (!_4 && !_k && (_l = _5.return)) yield _l.call(_5);
        }
        finally { if (e_4) throw e_4.error; }
    }
    ;
    const attendance_table_exists = yield attendance_model_1.Attendance_Model.check_attendance_table_exists(device_log_table_name);
    if (attendance_table_exists.recordset[0].table_exists == 0) {
        console.error(`${new Date().toLocaleString()}\t Attendance table ${device_log_table_name} does not exist`);
        return;
    }
    const max_table_row_id = yield attendance_erp_api_1.Attendance_Erp_Api.get_max_table_row_id(device_log_table_name);
    const attendance_data = yield attendance_model_1.Attendance_Model.get_all(device_log_table_name, max_table_row_id.data.max_row_id);
    console.log(device_log_table_name, max_table_row_id.data.max_row_id);
    const attendance_erpnext_create_list = [];
    try {
        for (var _7 = true, _8 = __asyncValues(attendance_data.recordset), _9; _9 = yield _8.next(), _o = _9.done, !_o; _7 = true) {
            _q = _9.value;
            _7 = false;
            const attendance = _q;
            console.log(attendance);
            const device = device_biomax_id_map[attendance.DeviceId];
            let device_name = device ? ((_r = device.id) !== null && _r !== void 0 ? _r : null) : null;
            let device_first_name = device ? ((_s = device.device_name) !== null && _s !== void 0 ? _s : null) : null;
            let location = device ? ((_t = device.point_id) !== null && _t !== void 0 ? _t : null) : null;
            let employee = (_u = employee_biomax_id_map[attendance.UserId]) !== null && _u !== void 0 ? _u : employee_erpnext_id_map[attendance.UserId];
            let status = attendance_schema_1.attendance_erpnext_status_enum.Values.Present;
            const log_date = (0, date_helper_1.biomax_date_to_js_date)(attendance.LogDate);
            if (log_date.getHours() > 5 && log_date.getMinutes() > 30) {
                status = attendance_schema_1.attendance_erpnext_status_enum.Values.Absent;
            }
            if (device_name && employee) {
                attendance_erpnext_create_list.push({
                    employee: employee.id,
                    custom_biometric_device: device_name,
                    status: status,
                    attendance_date: (0, date_helper_1.sql_date_format)(attendance.LogDate, false),
                    custom_table_name: device_log_table_name,
                    custom_table_row_id: attendance.DeviceLogId.toString(),
                    custom_biometric_marked_at: (0, date_helper_1.sql_date_format)(attendance.LogDate),
                });
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (!_7 && !_o && (_p = _8.return)) yield _p.call(_8);
        }
        finally { if (e_5) throw e_5.error; }
    }
    ;
    if (attendance_erpnext_create_list.length > 0) {
        const temp = yield attendance_erp_api_1.Attendance_Erp_Api.create(attendance_erpnext_create_list);
        console.log(temp);
    }
    console.info(`${new Date().toLocaleString()}\t Importing attendance to ERPNext from Biomax completed`);
});
exports.Attendance_Service = {
    import_attendance_to_erpnext_from_biomax,
};
