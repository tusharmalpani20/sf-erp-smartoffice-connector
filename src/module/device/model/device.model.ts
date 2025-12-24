import { Table_Name_Enum } from "../../../common/constant/table_name.constant";
import { pool } from "../../../config/database";

const get_all = async () => {
    const query = `
        SELECT 
            *
        FROM 
            ${Table_Name_Enum.SCHEMA}.${Table_Name_Enum.Device}
        ;
    `
    const result = (await pool).request().query(query);

    return result
};

export const Device_Model = {
    get_all,
}