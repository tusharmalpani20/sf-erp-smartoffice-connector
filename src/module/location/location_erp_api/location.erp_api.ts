import { axios_instance } from "../../../config/axios";

const get_all = async () => {
    try {
        const result = await axios_instance.get("/api/method/dpms_sf.dpms_sf.api.smart_office.get_all_points");
        return result.data.message;
    } catch (err) {
        console.error(err);
    }
};

const update_point_id = async (data: {
    name: string,
    smart_office_id: string
}[]) => {
    try {
        const result = await axios_instance.post("/api/method/dpms_sf.dpms_sf.api.smart_office.update_point_smart_office_id", 
            {
                point_update_list: data
            }
        );
        return result.data.message;
    } catch (err) {
        console.error(err);
    }
};

export const Location_Erp_Api = {
    get_all,
    update_point_id
}