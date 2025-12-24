import z from "zod";

export const location_erpnext_doc = z.object({
    id: z.string(),
    point_name: z.string(),
    zone_id: z.string(),
    zone_name: z.string(),
    branch_id: z.string(),
    point_type: z.string(),
    point_sub_type: z.string(),
    sf_analytics_id: z.string(),
    smart_office_id: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    radius: z.number(),
});

export type Location_Erpnext_Type = z.infer<typeof location_erpnext_doc>;

export const location_biomax_doc = z.object({
    LocationId: z.number(),
    LocationName: z.string().max(50),
    LocationCode: z.string().max(50),
    LeaveApprovalWorkFlowId: z.number().nullish(),
    OdApprovalWorkFlowId: z.number().nullish(),
    AttRegularizeApprovalWorkFlowId: z.number().nullish(),
    AttRegAppWorkFlowId: z.number().nullish(),
    LocationLattitude: z.number().nullish(),
    LocationLongitude: z.number().nullish(),
    Radius: z.number().nullish(),
    eMail: z.string().nullish(),
    LocationFullAddress: z.string().max(300).nullish(),
    IsActive: z.number(),
    ClutureTimeZoneName: z.string().max(500).nullish(),
    ClutureName: z.string().max(300).nullish(),
});

export type Location_Biomax_Type = z.infer<typeof location_biomax_doc>;

export const location_biomax_create_doc = location_biomax_doc.omit({
    LocationId: true,
    IsActive: true,
});

export type Location_Biomax_Create_Type = z.infer<typeof location_biomax_create_doc>;

export const location_biomax_update_doc = location_biomax_doc.pick({
    LocationId: true,
    LocationName: true,
    LocationCode: true,
    LocationLattitude: true,
    LocationLongitude: true,
    Radius: true,
    LocationFullAddress: true,
});

export type Location_Biomax_Update_Type = z.infer<typeof location_biomax_update_doc>;
