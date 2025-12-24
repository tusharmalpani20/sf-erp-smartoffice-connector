import { Table_Name_Enum } from "../../../common/constant/table_name.constant";
import { pool } from "../../../config/database";

const get_all = async (table_name: string, row_id: number) => {
    const query = `
        SELECT 
            [DeviceLogId],
            [DeviceId],
            [UserId],
            [LogDate],
            [Direction],
            [VerificationMode],
            [AttenndanceMarkingType]
        FROM 
            ${Table_Name_Enum.SCHEMA}.[${table_name}]
        WHERE
            DeviceLogId > ${row_id}
        ;
    `

    console.log(row_id)

    const result = (await pool).request().query(query);

    return result
};

const check_attendance_table_exists = async (table_name: string) => {
    const query = `
        SELECT 
            CASE
                WHEN EXISTS (
                    SELECT 
                        1 
                    FROM 
                        INFORMATION_SCHEMA.TABLES
                    WHERE 
                        TABLE_SCHEMA = 'dbo'
                            AND 
                        TABLE_NAME = '${table_name}'
                ) THEN 1
                ELSE 0
            END AS table_exists;
    `;

    const result = (await pool).request().query(query);

    return result;
};

const get_attendance_for_specific_date = async (table_name: string, date: Date) => {
    const query = `
        SELECT 
            * 
        FROM 
            ${table_name} 
        WHERE 
            CAST(LogDate AS DATE) = '${date.toISOString().split('T')[0]}'
    `;

    const result = (await pool).request().query(query);

    return result;
};

export const Attendance_Model = {
    get_all,
    check_attendance_table_exists,
    get_attendance_for_specific_date
}