"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.location_biomax_update_doc = exports.location_biomax_create_doc = exports.location_biomax_doc = exports.location_erpnext_doc = void 0;
const zod_1 = __importDefault(require("zod"));
exports.location_erpnext_doc = zod_1.default.object({
    id: zod_1.default.string(),
    point_name: zod_1.default.string(),
    zone_id: zod_1.default.string(),
    zone_name: zod_1.default.string(),
    branch_id: zod_1.default.string(),
    point_type: zod_1.default.string(),
    point_sub_type: zod_1.default.string(),
    sf_analytics_id: zod_1.default.string(),
    smart_office_id: zod_1.default.string(),
    latitude: zod_1.default.number(),
    longitude: zod_1.default.number(),
    radius: zod_1.default.number(),
});
exports.location_biomax_doc = zod_1.default.object({
    LocationId: zod_1.default.number(),
    LocationName: zod_1.default.string().max(50),
    LocationCode: zod_1.default.string().max(50),
    LeaveApprovalWorkFlowId: zod_1.default.number().nullish(),
    OdApprovalWorkFlowId: zod_1.default.number().nullish(),
    AttRegularizeApprovalWorkFlowId: zod_1.default.number().nullish(),
    AttRegAppWorkFlowId: zod_1.default.number().nullish(),
    LocationLattitude: zod_1.default.number().nullish(),
    LocationLongitude: zod_1.default.number().nullish(),
    Radius: zod_1.default.number().nullish(),
    eMail: zod_1.default.string().nullish(),
    LocationFullAddress: zod_1.default.string().max(300).nullish(),
    IsActive: zod_1.default.number(),
    ClutureTimeZoneName: zod_1.default.string().max(500).nullish(),
    ClutureName: zod_1.default.string().max(300).nullish(),
});
exports.location_biomax_create_doc = exports.location_biomax_doc.omit({
    LocationId: true,
    IsActive: true,
});
exports.location_biomax_update_doc = exports.location_biomax_doc.pick({
    LocationId: true,
    LocationName: true,
    LocationCode: true,
    LocationLattitude: true,
    LocationLongitude: true,
    Radius: true,
    LocationFullAddress: true,
});
