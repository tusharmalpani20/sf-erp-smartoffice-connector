"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location_Model = void 0;
const mssql_1 = __importDefault(require("mssql"));
const table_name_constant_1 = require("../../../common/constant/table_name.constant");
const database_1 = require("../../../config/database");
const get_all = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        SELECT 
            *
        FROM 
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.${table_name_constant_1.Table_Name_Enum.Location}
        ;
    `;
    const result = (yield database_1.pool).request().query(query);
    return result;
});
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const request = (yield database_1.pool).request();
    request
        .input('LocationName', mssql_1.default.VarChar, data.LocationName)
        .input('LocationCode', mssql_1.default.VarChar, data.LocationCode)
        .input('LeaveApprovalWorkFlowId', mssql_1.default.VarChar, data.LeaveApprovalWorkFlowId)
        .input('OdApprovalWorkFlowId', mssql_1.default.VarChar, data.OdApprovalWorkFlowId)
        .input('AttRegularizeApprovalWorkFlowId', mssql_1.default.VarChar, data.AttRegularizeApprovalWorkFlowId)
        .input('AttRegAppWorkFlowId', mssql_1.default.VarChar, data.AttRegAppWorkFlowId)
        .input('LocationLattitude', mssql_1.default.Decimal(18, 6), data.LocationLattitude)
        .input('LocationLongitude', mssql_1.default.Decimal(18, 6), data.LocationLongitude)
        .input('Radius', mssql_1.default.Int, data.Radius)
        .input('eMail', mssql_1.default.VarChar, data.eMail)
        .input('LocationFullAddress', mssql_1.default.VarChar, data.LocationFullAddress)
        .input('ClutureTimeZoneName', mssql_1.default.VarChar, data.ClutureTimeZoneName)
        .input('ClutureName', mssql_1.default.VarChar, data.ClutureName)
        .input("IsActive", mssql_1.default.Bit, 1);
    const query = `
        INSERT INTO 
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.${table_name_constant_1.Table_Name_Enum.Location}
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
    const result = yield request.query(query);
    return result;
});
const update = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const request = (yield database_1.pool).request();
    request
        .input('LocationId', mssql_1.default.Int, data.LocationId)
        .input('LocationName', mssql_1.default.VarChar, data.LocationName)
        .input('LocationCode', mssql_1.default.VarChar, data.LocationCode)
        .input('LocationLattitude', mssql_1.default.Decimal(18, 6), data.LocationLattitude)
        .input('LocationLongitude', mssql_1.default.Decimal(18, 6), data.LocationLongitude)
        .input('Radius', mssql_1.default.Int, data.Radius)
        .input('LocationFullAddress', mssql_1.default.VarChar, data.LocationFullAddress);
    const query = `
        UPDATE 
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.${table_name_constant_1.Table_Name_Enum.Location}
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
    const result = yield request.query(query);
    return result;
});
exports.Location_Model = {
    get_all,
    create,
    update
};
