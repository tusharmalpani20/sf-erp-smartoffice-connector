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
exports.Device_Service = void 0;
const date_helper_1 = require("../../../common/helper/date.helper");
const location_erp_api_1 = require("../../location/location_erp_api/location.erp_api");
const device_erp_api_1 = require("../erp_api/device.erp_api");
const device_model_1 = require("../model/device.model");
const import_device_to_erpnext_from_biomax = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    console.info(`${new Date().toLocaleString()}\t Importing device to ERPNext from Biomax`);
    const device_biomax_list = yield device_model_1.Device_Model.get_all();
    const device_erpnext_list = yield device_erp_api_1.Device_Erp_Api.get_all();
    const location_erpnext_list = yield location_erp_api_1.Location_Erp_Api.get_all();
    const location_erpnext_biomax_id_map = {};
    try {
        for (var _g = true, _h = __asyncValues(location_erpnext_list.data.points), _j; _j = yield _h.next(), _a = _j.done, !_a; _g = true) {
            _c = _j.value;
            _g = false;
            const location = _c;
            location.smart_office_id && (location_erpnext_biomax_id_map[location.smart_office_id] = location);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
        }
        finally { if (e_1) throw e_1.error; }
    }
    ;
    const create_device_list = [];
    try {
        for (var _k = true, _l = __asyncValues(device_biomax_list.recordset), _m; _m = yield _l.next(), _d = _m.done, !_d; _k = true) {
            _f = _m.value;
            _k = false;
            const device_biomax = _f;
            if (!device_erpnext_list.data.devices.find((device) => device.biometric_device_id && device.biometric_device_id == device_biomax.DeviceId.toString())) {
                let location_name = (device_biomax.DeviceLocation
                    &&
                        location_erpnext_biomax_id_map[device_biomax.DeviceLocation]) ? location_erpnext_biomax_id_map[device_biomax.DeviceLocation].id : "";
                create_device_list.push({
                    biometric_device_id: device_biomax.DeviceId.toString(),
                    device_name: device_biomax.DeviceFName,
                    serial_number: device_biomax.SerialNumber,
                    device_model: device_biomax.DeviceModel,
                    device_vendor: device_biomax.DeviceVendor,
                    device_type: device_biomax.DeviceType,
                    point: location_name,
                    device_direction: device_biomax.DeviceDirection,
                    connection_type: device_biomax.ConnectionType,
                    ip_address: device_biomax.IpAddress,
                    last_ping_time: device_biomax.LastPing ? (0, date_helper_1.sql_date_format)(device_biomax.LastPing) : null,
                    is_real_time: device_biomax.IsRealTime,
                    device_info: device_biomax.DeviceInfo,
                    user_count: device_biomax.UserCount,
                    finger_print_count: device_biomax.FPCount,
                    server_url: device_biomax.ServerURL,
                });
            }
            ;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_k && !_d && (_e = _l.return)) yield _e.call(_l);
        }
        finally { if (e_2) throw e_2.error; }
    }
    ;
    if (create_device_list.length > 0) {
        yield device_erp_api_1.Device_Erp_Api.create(create_device_list);
    }
    console.info(`${new Date().toLocaleString()}\t Importing device to ERPNext from Biomax completed`);
});
const update_device_in_erpnext = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_3, _b, _c, _d, e_4, _e, _f, _g, e_5, _h, _j;
    try {
        console.info(`${new Date().toLocaleString()}\t Updating device in ERPNext from Biomax`);
        const get_biomax_device_list = yield device_model_1.Device_Model.get_all();
        const get_erpnext_device_list = yield device_erp_api_1.Device_Erp_Api.get_all();
        const erpnextdevice_biomax_id_map = {};
        try {
            for (var _k = true, _l = __asyncValues(get_erpnext_device_list.data.devices), _m; _m = yield _l.next(), _a = _m.done, !_a; _k = true) {
                _c = _m.value;
                _k = false;
                const device = _c;
                device.biometric_device_id && (erpnextdevice_biomax_id_map[device.biometric_device_id] = device);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = _l.return)) yield _b.call(_l);
            }
            finally { if (e_3) throw e_3.error; }
        }
        const location_erpnext_list = yield location_erp_api_1.Location_Erp_Api.get_all();
        const location_name_map = {};
        try {
            for (var _o = true, _p = __asyncValues(location_erpnext_list.data.points), _q; _q = yield _p.next(), _d = _q.done, !_d; _o = true) {
                _f = _q.value;
                _o = false;
                const location = _f;
                location.smart_office_id && (location_name_map[location.smart_office_id] = location);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (!_o && !_d && (_e = _p.return)) yield _e.call(_p);
            }
            finally { if (e_4) throw e_4.error; }
        }
        ;
        const update_device_list = [];
        try {
            for (var _r = true, _s = __asyncValues(get_biomax_device_list.recordset), _t; _t = yield _s.next(), _g = _t.done, !_g; _r = true) {
                _j = _t.value;
                _r = false;
                const device = _j;
                const erpnext_device = erpnextdevice_biomax_id_map[device.DeviceId.toString()];
                if (erpnext_device) {
                    let biomax_last_ping = null;
                    if (device.LastPing) {
                        biomax_last_ping = `${new Date(device.LastPing).getFullYear()}-${new Date(device.LastPing).getMonth() + 1}-${new Date(device.LastPing).getDate()} ${new Date(device.LastPing).getHours()}:${new Date(device.LastPing).getMinutes()}:${device.LastPing.getSeconds()}`;
                    }
                    let erpnext_last_ping = null;
                    if (erpnext_device.last_ping_time) {
                        erpnext_last_ping = `${new Date(erpnext_device.last_ping_time).getFullYear()}-${new Date(erpnext_device.last_ping_time).getMonth() + 1}-${new Date(erpnext_device.last_ping_time).getDate()} ${new Date(erpnext_device.last_ping_time).getHours()}:${new Date(erpnext_device.last_ping_time).getMinutes()}:${new Date(erpnext_device.last_ping_time).getSeconds()}`;
                    }
                    if (erpnext_device.device_name != device.DeviceFName ||
                        erpnext_device.serial_number != device.SerialNumber ||
                        erpnext_device.device_model != device.DeviceModel ||
                        erpnext_device.device_vendor != device.DeviceVendor ||
                        erpnext_device.device_type != device.DeviceType ||
                        erpnext_device.point_id != device.DeviceLocation ||
                        erpnext_device.device_direction != device.DeviceDirection ||
                        erpnext_device.connection_type != device.ConnectionType ||
                        erpnext_device.ip_address != device.IpAddress ||
                        biomax_last_ping != erpnext_last_ping) {
                        let location_name = (device.DeviceLocation
                            &&
                                location_name_map[device.DeviceLocation]) ? location_name_map[device.DeviceLocation].id : null;
                        update_device_list.push({
                            name: erpnext_device.id,
                            biometric_device_id: erpnext_device.biometric_device_id,
                            device_name: device.DeviceFName,
                            device_direction: device.DeviceDirection,
                            serial_number: device.SerialNumber,
                            connection_type: device.ConnectionType,
                            ip_address: device.IpAddress,
                            device_type: device.DeviceType,
                            last_ping_time: device.LastPing ? (0, date_helper_1.sql_date_format)(device.LastPing) : null,
                            is_real_time: device.IsRealTime,
                            device_vendor: device.DeviceVendor,
                            device_info: device.DeviceInfo ? device.DeviceInfo : {},
                            user_count: device.UserCount,
                            finger_print_count: device.FPCount,
                            device_model: device.DeviceModel,
                            server_url: device.ServerURL,
                            point: location_name
                        });
                    }
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (!_r && !_g && (_h = _s.return)) yield _h.call(_s);
            }
            finally { if (e_5) throw e_5.error; }
        }
        if (update_device_list.length > 0) {
            yield device_erp_api_1.Device_Erp_Api.update(update_device_list);
        }
        console.info(`${new Date().toLocaleString()}\t Updating device in ERPNext from Biomax completed`);
    }
    catch (error) {
        console.log(`Error in update_device_in_erpnext function ${error}`);
    }
});
exports.Device_Service = {
    import_device_to_erpnext_from_biomax,
    update_device_in_erpnext
};
