import sql from "mssql";
import { Table_Name_Enum } from "../../../common/constant/table_name.constant";
import { pool } from "../../../config/database";
import { Employee_Biomax_Create_Type, Employee_Biomax_Update_Type } from "../schema/employee.schema";

const get_all = async () => {
    const query = `
        SELECT 
            [EmployeeId],
            [EmployeeName],
            [EmployeeCode],
            [Gender],
            [CompanyId],
            [DepartmentId],
            [CategoryId],
            [EmployeeCodeInDevice],
            [EmployementType],
            [Status],
            [Location]
        FROM 
            ${Table_Name_Enum.SCHEMA}.${Table_Name_Enum.Employee}
        ;
    `
    const result = (await pool).request().query(query);

    return result
};


//@deprecated
const create = async (data: Employee_Biomax_Create_Type) => {
    const request = (await pool).request();

    // Add parameters with proper SQL types
    request
        .input('EmployeeName', sql.VarChar, data.EmployeeName)
        .input('EmployeeCode', sql.VarChar, data.EmployeeCode)
        .input('Gender', sql.VarChar, data.Gender)
        .input('CompanyId', sql.Int, data.CompanyId)
        .input('DepartmentId', sql.Int, data.DepartmentId)
        .input('CategoryId', sql.Int, data.CategoryId)
        .input('EmployeeCodeInDevice', sql.VarChar, data.EmployeeCodeInDevice)
        .input('EmployementType', sql.Int, data.EmployementType)
        .input('Status', sql.VarChar, data.Status)
        .input('Location', sql.Int, data.Location);

    const query = `
        INSERT INTO 
            ${Table_Name_Enum.SCHEMA}.${Table_Name_Enum.Employee}
        (
            EmployeeName,
            EmployeeCode,
            Gender,
            CompanyId,
            DepartmentId,
            CategoryId,
            EmployeeCodeInDevice,
            EmployementType,
            Status,
            Location
        )
        OUTPUT inserted.EmployeeId
        VALUES
        (
            @EmployeeName,
            @EmployeeCode,
            @Gender,
            @CompanyId,
            @DepartmentId,
            @CategoryId,
            @EmployeeCodeInDevice,
            @EmployementType,
            @Status,
            @Location
        )
    `;

    const result = await request.query(query);
    return result;
}

//@deprecated
const update = async (data: Employee_Biomax_Update_Type) => {
    const request = (await pool).request();

    request
        .input('EmployeeId', sql.Int, data.EmployeeId)
        .input('EmployeeName', sql.VarChar, data.EmployeeName)
        .input('EmployeeCode', sql.VarChar, data.EmployeeCode)
        .input('Gender', sql.VarChar, data.Gender)
        .input('CompanyId', sql.Int, data.CompanyId)
        .input('DepartmentId', sql.Int, data.DepartmentId)
        .input('CategoryId', sql.Int, data.CategoryId)
        .input('EmployeeCodeInDevice', sql.VarChar, data.EmployeeCodeInDevice)
        .input('EmployementType', sql.Int, data.EmployementType)
        .input('Status', sql.VarChar, data.Status)
        .input('Location', sql.Int, data.Location);

    const query = `
        UPDATE 
            ${Table_Name_Enum.SCHEMA}.${Table_Name_Enum.Employee}
        SET
            EmployeeName = @EmployeeName,
            EmployeeCode = @EmployeeCode,
            Gender = @Gender,
            CompanyId = @CompanyId,
            DepartmentId = @DepartmentId,
            CategoryId = @CategoryId,
            EmployeeCodeInDevice = @EmployeeCodeInDevice,
            EmployementType = @EmployementType,
            Status = @Status,
            Location = @Location
        WHERE
            EmployeeId = @EmployeeId
    `;

    const result = await request.query(query);
    return result;
}

const get_by_employee_code = async (employee_code: string) => {
    const request = (await pool).request();

    request.input('EmployeeCode', sql.VarChar, employee_code);

    const query = `
        SELECT 
            * 
        FROM 
            ${Table_Name_Enum.SCHEMA}.${Table_Name_Enum.Employee} 
        WHERE 
            EmployeeCode = @EmployeeCode
    `;
    const result = await request.query(query);
    return result;
}

const update_location = async (employee_id: number, location: number | null) => {
    const request = (await pool).request();

    request.input('EmployeeId', sql.Int, employee_id);
    request.input('Location', sql.Int, location);

    const query = `
        UPDATE 
            ${Table_Name_Enum.SCHEMA}.${Table_Name_Enum.Employee}
        SET
            Location = @Location
        WHERE
            EmployeeId = @EmployeeId
    `;
    const result = await request.query(query);
    return result;
}

export const Employee_Model = {
    get_all,
    //@deprecated
    // create,
    // update,
    get_by_employee_code,
    update_location
}