import { z } from "zod";

export const employee_erpnext_doc = z.object({
    id: z.string(),
    first_name: z.string(),
    middle_name: z.string().nullish(),
    last_name: z.string().nullish(),
    employee_name: z.string(),
    gender: z.enum(['Male', 'Female', 'Other']),
    date_of_joining: z.coerce.date(),
    date_of_birth: z.coerce.date(),
    status: z.enum(['Active', 'Inactive', 'Suspended', 'Left']),
    custom_point: z.string().nullish(),
    company: z.string(),
    attendance_device_id: z.string().nullish(),
    custom_biometric_device: z.string().nullish(),
});

export type Employee_Erpnext_Type = z.infer<typeof employee_erpnext_doc>;


export const employee_erpnext_update_employee_id_doc = employee_erpnext_doc.pick({
    attendance_device_id: true,
    custom_biometric_device: true,
}).extend({
    name: z.string(),
});

export type Employee_Erpnext_Update_Employee_Id_Type = z.infer<typeof employee_erpnext_update_employee_id_doc>;

export const employee_biomax_doc = z.object({
    EmployeeId: z.number(),
    EmployeeName: z.string(),
    EmployeeCode: z.string(),
    Gender: z.string(),
    CompanyId: z.number(),
    DepartmentId: z.number(),
    CategoryId: z.number(),
    EmployeeCodeInDevice: z.string(),
    EmployementType: z.number(),
    Status: z.string(),
    Location: z.number().nullish(),
});

export type Employee_Biomax_Type = z.infer<typeof employee_biomax_doc>;

export const employee_biomax_create_doc = employee_biomax_doc.pick({
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

export type Employee_Biomax_Create_Type = z.infer<typeof employee_biomax_create_doc>;

export const employee_biomax_update_doc = employee_biomax_doc.pick({
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

export type Employee_Biomax_Update_Type = z.infer<typeof employee_biomax_update_doc>;

export const employee_biomax_api_create_doc = z.object({
    StaffCode: z.string(),
    StaffName: z.string(),
    Gender: z.string(),
    Location: z.string(),
    Status: z.string().default("Working"),

    CompanySName: z.string().default("Default"),
    CategorySName: z.string().default("Default"),
    HolidayGroupCode: z.string().default("Default"),
    ShiftGroupCode: z.string().default("Default"),
    DepartmentSName: z.string().default("Default"),

    Grade: z.string().default("Default"),
    Team: z.string().default("Default"),
});

export type Employee_Biomax_Api_Create_Type = z.infer<typeof employee_biomax_api_create_doc>;
