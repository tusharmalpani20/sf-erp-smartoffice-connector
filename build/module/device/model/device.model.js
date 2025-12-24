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
exports.Device_Model = void 0;
const table_name_constant_1 = require("../../../common/constant/table_name.constant");
const database_1 = require("../../../config/database");
const get_all = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        SELECT 
            *
        FROM 
            ${table_name_constant_1.Table_Name_Enum.SCHEMA}.${table_name_constant_1.Table_Name_Enum.Device}
        ;
    `;
    const result = (yield database_1.pool).request().query(query);
    return result;
});
exports.Device_Model = {
    get_all,
};
