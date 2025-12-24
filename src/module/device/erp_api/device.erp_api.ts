import { axios_instance } from "../../../config/axios";
import { Device_Erpnext_Create_Type, Device_Erpnext_Update_Type } from "../schema/device.schema";


const create = async (data: Device_Erpnext_Create_Type[]) => {
    try {
        const result = await axios_instance.post(
            "/api/method/dpms_sf.dpms_sf.api.smart_office.create_biometric_devices", 
            {
                device_list: data
            }
        );
        return result.data.message;
    } catch (err) {
        console.log(err);
    }
};

const get_all = async () => {
    try {
        const result = await axios_instance.get(
            "/api/method/dpms_sf.dpms_sf.api.smart_office.get_all_biometric_devices"
        );
        return result.data.message;
    } catch (err) {
        console.log(err);
    }
};

const update = async (data: Device_Erpnext_Update_Type[]) => {

    try {
        const result = await axios_instance.post(
            "/api/method/dpms_sf.dpms_sf.api.smart_office.update_biometric_devices", 
            {
                device_update_list: data
            }
        );
        return result.data.message;
    } catch (err) {
        console.log(err);
    }


};

export const Device_Erp_Api = {
    create,
    get_all,
    update
}