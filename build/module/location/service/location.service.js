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
exports.Location_Service = void 0;
const location_model_1 = require("../model/location.model");
const location_erp_api_1 = require("../location_erp_api/location.erp_api");
const import_location_to_biomax_from_erpnext = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    console.info(`${new Date().toLocaleString()}\t Importing location to Biomax from ERPNext`);
    const location_erpnext_list = yield location_erp_api_1.Location_Erp_Api.get_all();
    const location_to_create_in_biomax = [];
    try {
        for (var _g = true, _h = __asyncValues(location_erpnext_list.data.points), _j; _j = yield _h.next(), _a = _j.done, !_a; _g = true) {
            _c = _j.value;
            _g = false;
            const location = _c;
            if (!location.smart_office_id) {
                location_to_create_in_biomax.push({
                    LocationName: location.point_name,
                    LocationCode: location.id,
                    LocationLattitude: location.latitude,
                    LocationLongitude: location.longitude,
                    Radius: location.radius,
                    LocationFullAddress: location.zone_name + ", " + location.branch_id,
                });
                console.log("Added point to create in Biomax", location.id);
            }
            ;
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
    const location_with_biomax_id_list = [];
    try {
        for (var _k = true, location_to_create_in_biomax_1 = __asyncValues(location_to_create_in_biomax), location_to_create_in_biomax_1_1; location_to_create_in_biomax_1_1 = yield location_to_create_in_biomax_1.next(), _d = location_to_create_in_biomax_1_1.done, !_d; _k = true) {
            _f = location_to_create_in_biomax_1_1.value;
            _k = false;
            const location = _f;
            const biomax_location_id = yield location_model_1.Location_Model.create(location);
            location_with_biomax_id_list.push({
                name: location.LocationCode,
                smart_office_id: biomax_location_id.recordset[0].LocationId.toString(),
            });
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_k && !_d && (_e = location_to_create_in_biomax_1.return)) yield _e.call(location_to_create_in_biomax_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    ;
    if (location_with_biomax_id_list.length > 0) {
        yield location_erp_api_1.Location_Erp_Api.update_point_id(location_with_biomax_id_list);
    }
    ;
    console.info(`${new Date().toLocaleString()}\t Importing location to Biomax from ERPNext completed`);
});
const update_location_data_in_biomax_from_erpnext = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_3, _b, _c, _d, e_4, _e, _f, _g, e_5, _h, _j;
    console.info(`${new Date().toLocaleString()}\t Updating location data in Biomax from ERPNext`);
    const location_erpnext_list = yield location_erp_api_1.Location_Erp_Api.get_all();
    const location_biomax_list = yield location_model_1.Location_Model.get_all();
    const location_biomax_id_map = {};
    try {
        for (var _k = true, _l = __asyncValues(location_biomax_list.recordset), _m; _m = yield _l.next(), _a = _m.done, !_a; _k = true) {
            _c = _m.value;
            _k = false;
            const location = _c;
            location_biomax_id_map[location.LocationId.toString()] = location;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (!_k && !_a && (_b = _l.return)) yield _b.call(_l);
        }
        finally { if (e_3) throw e_3.error; }
    }
    ;
    const update_biomax_location_list = [];
    try {
        for (var _o = true, _p = __asyncValues(location_erpnext_list.data.points), _q; _q = yield _p.next(), _d = _q.done, !_d; _o = true) {
            _f = _q.value;
            _o = false;
            const location = _f;
            if (location.smart_office_id) {
                const biomax_location = location_biomax_id_map[location.smart_office_id];
                if (location.point_name != biomax_location.LocationName
                    || location.id != biomax_location.LocationCode
                    || location.latitude != biomax_location.LocationLattitude
                    || location.longitude != biomax_location.LocationLongitude
                    || location.radius != biomax_location.Radius
                    || (location.zone_name + ", " + location.branch_id) != biomax_location.LocationFullAddress) {
                    update_biomax_location_list.push({
                        LocationId: Number(location.smart_office_id),
                        LocationName: location.point_name,
                        LocationCode: location.id,
                        LocationLattitude: location.latitude,
                        LocationLongitude: location.longitude,
                        Radius: location.radius,
                        LocationFullAddress: (location.zone_name + ", " + location.branch_id),
                    });
                    console.log("Update point", location);
                }
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (!_o && !_d && (_e = _p.return)) yield _e.call(_p);
        }
        finally { if (e_4) throw e_4.error; }
    }
    if (update_biomax_location_list.length > 0) {
        try {
            for (var _r = true, update_biomax_location_list_1 = __asyncValues(update_biomax_location_list), update_biomax_location_list_1_1; update_biomax_location_list_1_1 = yield update_biomax_location_list_1.next(), _g = update_biomax_location_list_1_1.done, !_g; _r = true) {
                _j = update_biomax_location_list_1_1.value;
                _r = false;
                const location = _j;
                yield location_model_1.Location_Model.update(location);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (!_r && !_g && (_h = update_biomax_location_list_1.return)) yield _h.call(update_biomax_location_list_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
    }
    console.info(`${new Date().toLocaleString()}\t Updating location data in Biomax from ERPNext completed`);
});
exports.Location_Service = {
    import_location_to_biomax_from_erpnext,
    update_location_data_in_biomax_from_erpnext
};
