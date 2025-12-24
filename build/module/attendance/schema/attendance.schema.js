"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendance_erpnext_create_doc = exports.attendance_erpnext_doc = exports.attendance_erpnext_status_enum = exports.device_log_biomax_doc = void 0;
const zod_1 = require("zod");
exports.device_log_biomax_doc = zod_1.z.object({
    DeviceLogId: zod_1.z.number(),
    DeviceId: zod_1.z.number(),
    UserId: zod_1.z.number(),
    LogDate: zod_1.z.coerce.date(),
    Direction: zod_1.z.string(),
    VerificationMode: zod_1.z.string().nullish(),
    AttenndanceMarkingType: zod_1.z.string().nullish(),
});
exports.attendance_erpnext_status_enum = zod_1.z.enum(["Present", "Absent", "On Leave", "Half Day", "Work From Home"]);
exports.attendance_erpnext_doc = zod_1.z.object({
    name: zod_1.z.string(),
    owner: zod_1.z.string(),
    creation: zod_1.z.coerce.date(),
    modified: zod_1.z.coerce.date(),
    modified_by: zod_1.z.string(),
    docstatus: zod_1.z.number(),
    idx: zod_1.z.number(),
    naming_series: zod_1.z.string().default("HR-ATT-.YYYY.-"),
    employee: zod_1.z.string(),
    employee_name: zod_1.z.string(),
    status: exports.attendance_erpnext_status_enum,
    attendance_date: zod_1.z.coerce.date(),
    company: zod_1.z.string(),
    custom_device: zod_1.z.string(),
    custom_device_name: zod_1.z.string().nullish(),
    custom_table_name: zod_1.z.string(),
    custom_table_row_id: zod_1.z.string(),
    custom_attendance_marked_at: zod_1.z.coerce.date(),
    custom_punch_in_at: zod_1.z.string(),
    custom_location: zod_1.z.string().nullish(),
});
exports.attendance_erpnext_create_doc = zod_1.z.object({
    employee: zod_1.z.string(),
    status: exports.attendance_erpnext_status_enum,
    attendance_date: zod_1.z.coerce.date(),
    custom_biometric_device: zod_1.z.string(),
    custom_table_name: zod_1.z.string(),
    custom_table_row_id: zod_1.z.string(),
    custom_biometric_marked_at: zod_1.z.coerce.date(),
});
