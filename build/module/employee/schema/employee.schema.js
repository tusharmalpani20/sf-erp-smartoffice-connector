"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employee_biomax_api_create_doc = exports.employee_biomax_update_doc = exports.employee_biomax_create_doc = exports.employee_biomax_doc = exports.employee_erpnext_update_employee_id_doc = exports.employee_erpnext_doc = void 0;
const zod_1 = require("zod");
exports.employee_erpnext_doc = zod_1.z.object({
    id: zod_1.z.string(),
    first_name: zod_1.z.string(),
    middle_name: zod_1.z.string().nullish(),
    last_name: zod_1.z.string().nullish(),
    employee_name: zod_1.z.string(),
    gender: zod_1.z.enum(['Male', 'Female', 'Other']),
    date_of_joining: zod_1.z.coerce.date(),
    date_of_birth: zod_1.z.coerce.date(),
    status: zod_1.z.enum(['Active', 'Inactive', 'Suspended', 'Left']),
    custom_point: zod_1.z.string().nullish(),
    company: zod_1.z.string(),
    attendance_device_id: zod_1.z.string().nullish(),
    custom_biometric_device: zod_1.z.string().nullish(),
});
exports.employee_erpnext_update_employee_id_doc = exports.employee_erpnext_doc.pick({
    attendance_device_id: true,
    custom_biometric_device: true,
}).extend({
    name: zod_1.z.string(),
});
exports.employee_biomax_doc = zod_1.z.object({
    EmployeeId: zod_1.z.number(),
    EmployeeName: zod_1.z.string(),
    EmployeeCode: zod_1.z.string(),
    Gender: zod_1.z.string(),
    CompanyId: zod_1.z.number(),
    DepartmentId: zod_1.z.number(),
    CategoryId: zod_1.z.number(),
    EmployeeCodeInDevice: zod_1.z.string(),
    EmployementType: zod_1.z.number(),
    Status: zod_1.z.string(),
    Location: zod_1.z.number().nullish(),
});
exports.employee_biomax_create_doc = exports.employee_biomax_doc.pick({
    EmployeeName: true,
    EmployeeCode: true,
    Gender: true,
    CompanyId: true,
    DepartmentId: true,
    CategoryId: true,
    EmployeeCodeInDevice: true,
    EmployementType: true,
    Status: true,
    Location: true,
});
exports.employee_biomax_update_doc = exports.employee_biomax_doc.pick({
    EmployeeId: true,
    EmployeeName: true,
    EmployeeCode: true,
    Gender: true,
    CompanyId: true,
    DepartmentId: true,
    CategoryId: true,
    EmployeeCodeInDevice: true,
    EmployementType: true,
    Status: true,
    Location: true,
});
exports.employee_biomax_api_create_doc = zod_1.z.object({
    StaffCode: zod_1.z.string(),
    StaffName: zod_1.z.string(),
    Gender: zod_1.z.string(),
    Location: zod_1.z.string(),
    Status: zod_1.z.string().default("Working"),
    CompanySName: zod_1.z.string().default("Default"),
    CategorySName: zod_1.z.string().default("Default"),
    HolidayGroupCode: zod_1.z.string().default("Default"),
    ShiftGroupCode: zod_1.z.string().default("Default"),
    DepartmentSName: zod_1.z.string().default("Default"),
    Grade: zod_1.z.string().default("Default"),
    Team: zod_1.z.string().default("Default"),
});
