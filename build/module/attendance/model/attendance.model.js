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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance_Model = void 0;
const table_name_constant_1 = require("../../../common/constant/table_name.constant");
const database_1 = require("../../../config/database");
const get_all = (table_name, row_id) => __awaiter(void 0, void 0, void 0, function* () {
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
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.[${table_name}]
        WHERE
            DeviceLogId > ${row_id}
        ;
    `;
    console.log(row_id);
    const result = (yield database_1.pool).request().query(query);
    return result;
});
const check_attendance_table_exists = (table_name) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = (yield database_1.pool).request().query(query);
    return result;
});
const get_attendance_for_specific_date = (table_name, date) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        SELECT 
            * 
        FROM 
            ${table_name} 
        WHERE 
            CAST(LogDate AS DATE) = '${date.toISOString().split('T')[0]}'
    `;
    const result = (yield database_1.pool).request().query(query);
    return result;
});
exports.Attendance_Model = {
    get_all,
    check_attendance_table_exists,
    get_attendance_for_specific_date
};
