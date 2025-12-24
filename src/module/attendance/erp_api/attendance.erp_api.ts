
import { axios_instance } from "../../../config/axios";
import { Attendance_Erpnext_Create_Type } from "../schema/attendance.schema";

const get_max_table_row_id = async (table_name: string) => {
    try {
        const result = await axios_instance.get(
            "/api/method/dpms_sf.dpms_sf.api.smart_office.get_biometric_table_state", {
            params: {
                table_name
            }
        });
        return result.data.message;
    } catch (error) {
        console.log(error);
    }
};

const create = async (data: Attendance_Erpnext_Create_Type[]) => {
    try {
        const result = await axios_instance.post(
            "/api/method/dpms_sf.dpms_sf.api.smart_office.create_attendance_from_biometric_records", 
            {
                attendance_list: data
            }
        );
        return result.data.message;
    } catch (err) {
        console.log(err);
        console.log((err as any).response.data);
    }
};

export const Attendance_Erp_Api = {
    get_max_table_row_id,
    create,
}