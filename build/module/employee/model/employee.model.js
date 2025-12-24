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
exports.Employee_Model = void 0;
const mssql_1 = __importDefault(require("mssql"));
const table_name_constant_1 = require("../../../common/constant/table_name.constant");
const database_1 = require("../../../config/database");
const get_all = () => __awaiter(void 0, void 0, void 0, function* () {
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
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.${table_name_constant_1.Table_Name_Enum.Employee}
        ;
    `;
    const result = (yield database_1.pool).request().query(query);
    return result;
});
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const request = (yield database_1.pool).request();
    request
        .input('EmployeeName', mssql_1.default.VarChar, data.EmployeeName)
        .input('EmployeeCode', mssql_1.default.VarChar, data.EmployeeCode)
        .input('Gender', mssql_1.default.VarChar, data.Gender)
        .input('CompanyId', mssql_1.default.Int, data.CompanyId)
        .input('DepartmentId', mssql_1.default.Int, data.DepartmentId)
        .input('CategoryId', mssql_1.default.Int, data.CategoryId)
        .input('EmployeeCodeInDevice', mssql_1.default.VarChar, data.EmployeeCodeInDevice)
        .input('EmployementType', mssql_1.default.Int, data.EmployementType)
        .input('Status', mssql_1.default.VarChar, data.Status)
        .input('Location', mssql_1.default.Int, data.Location);
    const query = `
        INSERT INTO 
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.${table_name_constant_1.Table_Name_Enum.Employee}
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
    const result = yield request.query(query);
    return result;
});
const update = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const request = (yield database_1.pool).request();
    request
        .input('EmployeeId', mssql_1.default.Int, data.EmployeeId)
        .input('EmployeeName', mssql_1.default.VarChar, data.EmployeeName)
        .input('EmployeeCode', mssql_1.default.VarChar, data.EmployeeCode)
        .input('Gender', mssql_1.default.VarChar, data.Gender)
        .input('CompanyId', mssql_1.default.Int, data.CompanyId)
        .input('DepartmentId', mssql_1.default.Int, data.DepartmentId)
        .input('CategoryId', mssql_1.default.Int, data.CategoryId)
        .input('EmployeeCodeInDevice', mssql_1.default.VarChar, data.EmployeeCodeInDevice)
        .input('EmployementType', mssql_1.default.Int, data.EmployementType)
        .input('Status', mssql_1.default.VarChar, data.Status)
        .input('Location', mssql_1.default.Int, data.Location);
    const query = `
        UPDATE 
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.${table_name_constant_1.Table_Name_Enum.Employee}
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
    const result = yield request.query(query);
    return result;
});
const get_by_employee_code = (employee_code) => __awaiter(void 0, void 0, void 0, function* () {
    const request = (yield database_1.pool).request();
    request.input('EmployeeCode', mssql_1.default.VarChar, employee_code);
    const query = `
        SELECT 
            * 
        FROM 
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.${table_name_constant_1.Table_Name_Enum.Employee} 
        WHERE 
            EmployeeCode = @EmployeeCode
    `;
    const result = yield request.query(query);
    return result;
});
const update_location = (employee_id, location) => __awaiter(void 0, void 0, void 0, function* () {
    const request = (yield database_1.pool).request();
    request.input('EmployeeId', mssql_1.default.Int, employee_id);
    request.input('Location', mssql_1.default.Int, location);
    const query = `
        UPDATE 
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.${table_name_constant_1.Table_Name_Enum.Employee}
        SET
            Location = @Location
        WHERE
            EmployeeId = @EmployeeId
    `;
    const result = yield request.query(query);
    return result;
});
exports.Employee_Model = {
    get_all,
    get_by_employee_code,
    update_location
};
