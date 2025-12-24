import { z } from "zod";

export const device_erpnext_doc = z.object({
    id: z.string(),
    biometric_device_id : z.string().nullish(),
    device_name: z.string().nullish(),
    serial_number: z.string().nullish(),
    device_model: z.string().nullish(),
    device_vendor: z.string().nullish(),
    device_type: z.string().nullish(),
    point_id: z.string().nullish(),
    point_name: z.string().nullish(),
    device_direction: z.string().nullish(),
    connection_type: z.string().nullish(),
    ip_address: z.string().nullish(),
    server_url: z.string().nullish(),
    user_count: z.number().nullish(),
    finger_print_count: z.number().nullish(),
    device_info: z.any().nullish(),
    is_real_time: z.boolean().nullish(),
    last_ping_time: z.coerce.date().nullish(),
});

export type Device_Erpnext_Type = z.infer<typeof device_erpnext_doc>;

export const device_erpnext_create_doc = device_erpnext_doc.pick({
    biometric_device_id: true,
    device_name: true,
    serial_number: true,
    device_model: true,
    device_vendor: true,
    device_type: true,
    device_direction: true,
    connection_type: true,
    ip_address: true,
    server_url: true,
    user_count: true,
    finger_print_count: true,
    device_info: true,
    is_real_time: true,
    last_ping_time: true,
}).extend({
    point : z.string().nullish(),
});

export type Device_Erpnext_Create_Type = z.infer<typeof device_erpnext_create_doc>;

export const device_erpnext_update_doc = device_erpnext_doc.pick({
    biometric_device_id: true,
    device_name: true,
    serial_number: true,
    device_model: true,
    device_vendor: true,
    device_type: true,
    device_direction: true,
    connection_type: true,
    ip_address: true,
    server_url: true,
    user_count: true,
    finger_print_count: true,
    device_info: true,
    is_real_time: true,
    last_ping_time: true,
}).extend({
    name : z.string().nullish(),
    point: z.string().nullish(),
});

export type Device_Erpnext_Update_Type = z.infer<typeof device_erpnext_update_doc>;

export const device_biomax_doc = z.object({
    DeviceId: z.number(),
    DeviceFName: z.string(),
    DeviceSName: z.string(),
    DeviceDirection: z.string(),
    SerialNumber: z.string(),
    ConnectionType: z.string(),
    IpAddress: z.string().nullish(),
    LastPing: z.coerce.date().nullish(),
    DeviceType: z.string().nullish(),
    DeviceLocation: z.string().nullish(),
    IsRealTime: z.boolean().nullish(),
    DeviceVendor: z.string().nullish(),
    DeviceInfo: z.any().nullish(),
    UserCount: z.number().nullish(),
    FPCount: z.number().nullish(),
    DeviceModel: z.string().nullish(),
    ServerURL: z.string().nullish(),
});

export type Device_Biomax_Type = z.infer<typeof device_biomax_doc>;
