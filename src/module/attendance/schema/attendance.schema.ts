import { z } from "zod";

export const device_log_biomax_doc = z.object({
    DeviceLogId: z.number(),
    DeviceId: z.number(),
    UserId: z.number(),

    LogDate: z.coerce.date(),
    Direction: z.string(),

    VerificationMode: z.string().nullish(),

    AttenndanceMarkingType: z.string().nullish(),
});

export type Device_Log_Biomax_Type = z.infer<typeof device_log_biomax_doc>;

export const attendance_erpnext_status_enum = z.enum(["Present", "Absent", "On Leave", "Half Day", "Work From Home"]);

export type Attendance_Erpnext_Status_Enum = z.infer<typeof attendance_erpnext_status_enum>;

export const attendance_erpnext_doc = z.object({
    name: z.string(),
    owner: z.string(),
    creation: z.coerce.date(),
    modified: z.coerce.date(),
    modified_by: z.string(),
    docstatus: z.number(),
    idx: z.number(),

    naming_series: z.string().default("HR-ATT-.YYYY.-"),
    employee: z.string(),
    employee_name: z.string(),

    status: attendance_erpnext_status_enum,

    attendance_date: z.coerce.date(),

    company: z.string(),

    custom_device: z.string(),
    custom_device_name: z.string().nullish(),

    custom_table_name: z.string(),

    custom_table_row_id: z.string(),

    custom_attendance_marked_at: z.coerce.date(),
    custom_punch_in_at: z.string(),

    custom_location: z.string().nullish(),
});

export type Attendance_Erpnext_Type = z.infer<typeof attendance_erpnext_doc>;


export const attendance_erpnext_create_doc = z.object({
    employee: z.string(),
    status: attendance_erpnext_status_enum,
    attendance_date: z.coerce.date(),
    custom_biometric_device: z.string(),
    custom_table_name: z.string(),
    custom_table_row_id: z.string(),
    custom_biometric_marked_at: z.coerce.date(),
});

export type Attendance_Erpnext_Create_Type = z.infer<typeof attendance_erpnext_create_doc>;