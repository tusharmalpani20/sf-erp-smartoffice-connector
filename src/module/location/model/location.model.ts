import sql from "mssql";
import { Table_Name_Enum } from "../../../common/constant/table_name.constant"
import { pool } from "../../../config/database"
import { Location_Biomax_Create_Type, Location_Biomax_Update_Type } from "../schema/location.schema";

const get_all = async () => {
    const query = `
        SELECT 
            *
        FROM 
            ${Table_Name_Enum.SCHEMA}.${Table_Name_Enum.Location}
        ;
    `
    const result = (await pool).request().query(query);

    return result
};

const create = async (data: Location_Biomax_Create_Type) => {
    const request = (await pool).request();

    // Add parameters with proper SQL types
    request
        // .input('LocationId', sql.VarChar, data.LocationId)
        .input('LocationName', sql.VarChar, data.LocationName)
        .input('LocationCode', sql.VarChar, data.LocationCode)
        .input('LeaveApprovalWorkFlowId', sql.VarChar, data.LeaveApprovalWorkFlowId)
        .input('OdApprovalWorkFlowId', sql.VarChar, data.OdApprovalWorkFlowId)
        .input('AttRegularizeApprovalWorkFlowId', sql.VarChar, data.AttRegularizeApprovalWorkFlowId)
        .input('AttRegAppWorkFlowId', sql.VarChar, data.AttRegAppWorkFlowId)
        .input('LocationLattitude', sql.Decimal(18, 6), data.LocationLattitude)
        .input('LocationLongitude', sql.Decimal(18, 6), data.LocationLongitude)
        .input('Radius', sql.Int, data.Radius)
        .input('eMail', sql.VarChar, data.eMail)
        .input('LocationFullAddress', sql.VarChar, data.LocationFullAddress)
        // .input('IsActive', sql.Bit, data.IsActive)
        .input('ClutureTimeZoneName', sql.VarChar, data.ClutureTimeZoneName)
        .input('ClutureName', sql.VarChar, data.ClutureName)
        .input("IsActive", sql.Bit, 1);

    const query = `
        INSERT INTO 
            ${Table_Name_Enum.SCHEMA}.${Table_Name_Enum.Location}
        (
            LocationName,
            LocationCode,
            LeaveApprovalWorkFlowId,
            OdApprovalWorkFlowId,
            AttRegularizeApprovalWorkFlowId,
            AttRegAppWorkFlowId,
            LocationLattitude,
            LocationLongitude,
            Radius,
            eMail,
            LocationFullAddress,
            ClutureTimeZoneName,
            ClutureName,
            IsActive
        )
        OUTPUT inserted.LocationId
        VALUES
        (
            @LocationName,
            @LocationCode,
            @LeaveApprovalWorkFlowId,
            @OdApprovalWorkFlowId,
            @AttRegularizeApprovalWorkFlowId,
            @AttRegAppWorkFlowId,
            @LocationLattitude,
            @LocationLongitude,
            @Radius,
            @eMail,
            @LocationFullAddress,
            @ClutureTimeZoneName,
            @ClutureName,
            @IsActive
        )
    `;

    const result = await request.query(query);
    return result;
}

const update = async (data: Location_Biomax_Update_Type) => {
    const request = (await pool).request();

    request
        .input('LocationId', sql.Int, data.LocationId)
        .input('LocationName', sql.VarChar, data.LocationName)
        .input('LocationCode', sql.VarChar, data.LocationCode)
        .input('LocationLattitude', sql.Decimal(18, 6), data.LocationLattitude)
        .input('LocationLongitude', sql.Decimal(18, 6), data.LocationLongitude)
        .input('Radius', sql.Int, data.Radius)
        .input('LocationFullAddress', sql.VarChar, data.LocationFullAddress);

    const query = `
        UPDATE 
            ${Table_Name_Enum.SCHEMA}.${Table_Name_Enum.Location}
        SET
            LocationName = @LocationName,
            LocationCode = @LocationCode,
            LocationLattitude = @LocationLattitude,
            LocationLongitude = @LocationLongitude,
            Radius = @Radius,
            LocationFullAddress = @LocationFullAddress
        WHERE
            LocationId = @LocationId
    `;

    const result = await request.query(query);
    return result;
}

export const Location_Model = {
    get_all,
    create,
    update
}