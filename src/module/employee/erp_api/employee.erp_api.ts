import { axios_instance } from "../../../config/axios";
import { Employee_Erpnext_Update_Employee_Id_Type } from "../schema/employee.schema";


const get_all = async () => {
    try {
        const result = await axios_instance.get(
            "/api/method/dpms_sf.dpms_sf.api.smart_office.get_all_employees"
        );
        return result.data.message;
    } catch (err) {
        console.error(err);
        return [];
    }
};

const get_all_inactive_or_left_employees_having_device_id = async () => {
    try {
        const result = await axios_instance.get(
            "/api/method/dpms_sf.dpms_sf.api.smart_office.get_all_employees_inactive_or_left_with_biometric_device"
        );
        return result.data.message;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const update_employee_id = async (data: Employee_Erpnext_Update_Employee_Id_Type[]) => {
    try {
        const result = await axios_instance.post(
            "/api/method/dpms_sf.dpms_sf.api.smart_office.update_employee_attendance_device_id", 
            {
                employee_update_list: data
            }
        );
        return result.data.message;
    } catch (err) {
        console.error(err);
        return [];
    }
};

const update_employee_biometric_device = async (data: {
    name: string,
    custom_biometric_device: string | null,
}) => {
    try {
        const result = await axios_instance.post(
            "/api/method/dpms_sf.dpms_sf.api.smart_office.update_employee_biometric_device", 
            data
        );
        return result.data.message;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const Employee_Erp_Api = {
    get_all,
    get_all_inactive_or_left_employees_having_device_id,
    update_employee_id,
    update_employee_biometric_device
}