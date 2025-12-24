"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.device_log_table_name_generator_for_biomax = void 0;
const device_log_table_name_generator_for_biomax = () => {
    let table_name = "DeviceLogs_";
    const todays_date = new Date();
    let month = todays_date.getMonth() + 1;
    let year = todays_date.getFullYear();
    table_name += month.toString() + "_" + year.toString();
    return table_name;
};
exports.device_log_table_name_generator_for_biomax = device_log_table_name_generator_for_biomax;
