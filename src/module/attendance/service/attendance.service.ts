import { IResult } from "mssql";
import { biomax_date_to_js_date, sql_date_format } from "../../../common/helper/date.helper";
import { Device_Erp_Api } from "../../device/erp_api/device.erp_api";
import { Device_Erpnext_Type } from "../../device/schema/device.schema";
import { Employee_Erp_Api } from "../../employee/erp_api/employee.erp_api";
import { Employee_Erpnext_Type } from "../../employee/schema/employee.schema";
import { Location_Erp_Api } from "../../location/location_erp_api/location.erp_api";
import { Location_Erpnext_Type } from "../../location/schema/location.schema";
import { Attendance_Erp_Api } from "../erp_api/attendance.erp_api";
import { device_log_table_name_generator_for_biomax } from "../helper/attendance.helper";
import { Attendance_Model } from "../model/attendance.model";
import {
    Attendance_Erpnext_Create_Type,
    Attendance_Erpnext_Status_Enum,
    attendance_erpnext_status_enum,
    Device_Log_Biomax_Type
} from "../schema/attendance.schema";

const import_attendance_to_erpnext_from_biomax = async (device_log_table_name = device_log_table_name_generator_for_biomax()) => {

    console.info(`${new Date().toLocaleString()}\t Importing attendance to ERPNext from Biomax`);

    const employee_erpnext_list = await Employee_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            employees: Employee_Erpnext_Type[]
        }
    };

    const employee_biomax_id_map: {
        [key: string]: Employee_Erpnext_Type
    } = {};

    for await (const employee of employee_erpnext_list.data.employees) {
        if (employee.attendance_device_id) {
            employee_biomax_id_map[employee.attendance_device_id] = employee;
        }
    };


    const employee_erpnext_id_map: {
        [key: string]: Employee_Erpnext_Type
    } = {};

    for await (const employee of employee_erpnext_list.data.employees) {
        if (employee.id) {
            employee_erpnext_id_map[employee.id] = employee;
        }
    };

    const location_erpnext_list = await Location_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            points: Location_Erpnext_Type[]
        }
    };

    const location_erpnext_id_map: {
        [key: string]: Location_Erpnext_Type
    } = {};

    for await (const location of location_erpnext_list.data.points) {
        location_erpnext_id_map[location.id] = location;
    };

    const device_erpnext_list = await Device_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            devices: Device_Erpnext_Type[]
        }
    };

    const device_biomax_id_map: {
        [key: string]: Device_Erpnext_Type
    } = {};

    for await (const device of device_erpnext_list.data.devices) {
        if (device.biometric_device_id) {
            device_biomax_id_map[device.biometric_device_id] = device;
        }
    };


    //check if the attendance table exists
    const attendance_table_exists = await Attendance_Model.check_attendance_table_exists(device_log_table_name) as IResult<{
        table_exists: number
    }[]>;

    if (attendance_table_exists.recordset[0].table_exists == 0) {
        console.error(`${new Date().toLocaleString()}\t Attendance table ${device_log_table_name} does not exist`);
        return;
    }

    //now we will have to get the attendance data from the device log table 
    const max_table_row_id = await Attendance_Erp_Api.get_max_table_row_id(device_log_table_name) as {
        status: string,
        message: string,
        data: {
            is_table_present: boolean,
            max_row_id: number,
            count: number
        }
    };

    //now we will have to get the attendance data from the device log table 
    const attendance_data = await Attendance_Model.get_all(
        device_log_table_name,
        max_table_row_id.data.max_row_id) as IResult<Device_Log_Biomax_Type>;

    console.log(device_log_table_name,
        max_table_row_id.data.max_row_id)

    const attendance_erpnext_create_list: Attendance_Erpnext_Create_Type[] = [];

    for await (const attendance of attendance_data.recordset) {
        console.log(attendance);
        //get the device details from the device_erpnext_id_map
        const device = device_biomax_id_map[attendance.DeviceId];

        let device_name = device ? (device.id ?? null) : null;

        let device_first_name = device ? (device.device_name ?? null) : null;

        let location = device ? (device.point_id ?? null) : null;

        //we will wrt to both biomax id and erpnext id, since for old employee we have biomax id and for new employee we have erpnext id

        let employee = employee_biomax_id_map[attendance.UserId] ?? employee_erpnext_id_map[attendance.UserId];

        let status: Attendance_Erpnext_Status_Enum = attendance_erpnext_status_enum.Values.Present;

        const log_date = biomax_date_to_js_date(attendance.LogDate);

        if (log_date.getHours() > 5 && log_date.getMinutes() > 30) {
            //if the attendance is after 5:30 AM then it should be marked as absent
            status = attendance_erpnext_status_enum.Values.Absent;
        }

        if (device_name && employee) {
            //only if we have device name and employee name we will create the attendance 
            attendance_erpnext_create_list.push({
                employee: employee.id,
                custom_biometric_device: device_name,
                status: status,
                attendance_date: sql_date_format(attendance.LogDate, false) as any as Date,
                custom_table_name: device_log_table_name,
                custom_table_row_id: attendance.DeviceLogId.toString(),
                custom_biometric_marked_at: sql_date_format(attendance.LogDate) as any as Date,
            });
        }
    };

    // // now we will have to create the attendance in the erpnext 
    // for await (const attendance of attendance_erpnext_create_list) {
    //     const temp = await Attendance_Erp_Api.create(attendance);
    //     console.log(temp);
    // }

    if (attendance_erpnext_create_list.length > 0) {
        //now instead of sending one by one we will send all the data in a single request
        const temp = await Attendance_Erp_Api.create(attendance_erpnext_create_list);
        console.log(temp);
    }

    console.info(`${new Date().toLocaleString()}\t Importing attendance to ERPNext from Biomax completed`);

}


// const import_attendance_to_erpnext_from_biomax_for_specific_date = async (date: Date, device_log_table_name = device_log_table_name_generator_for_biomax()) => {

//     console.info(`${new Date().toLocaleString()}\t Importing attendance to ERPNext from Biomax for date ${date.toLocaleDateString()}`);

//     const employee_erpnext_list = await Employee_Erp_Api.get_all() as {
//         status: string,
//         message: string,
//         data: {
//             employees: Employee_Erpnext_Type[]
//         }
//     };

//     const employee_biomax_id_map: {
//         [key: string]: Employee_Erpnext_Type
//     } = {};

//     for await (const employee of employee_erpnext_list.data.employees) {
//         if (employee.attendance_device_id) {
//             employee_biomax_id_map[employee.attendance_device_id] = employee;
//         }
//     };


//     const employee_erpnext_id_map: {
//         [key: string]: Employee_Erpnext_Type
//     } = {};

//     for await (const employee of employee_erpnext_list.data.employees) {
//         if (employee.id) {
//             employee_erpnext_id_map[employee.id] = employee;
//         }
//     };

//     const location_erpnext_list = await Location_Erp_Api.get_all() as {
//         status: string,
//         message: string,
//         data: {
//             points: Location_Erpnext_Type[]
//         }
//     };

//     const location_erpnext_id_map: {
//         [key: string]: Location_Erpnext_Type
//     } = {};

//     for await (const location of location_erpnext_list.data.points) {
//         location_erpnext_id_map[location.id] = location;
//     };

//     const device_erpnext_list = await Device_Erp_Api.get_all() as {
//         status: string,
//         message: string,
//         data: {
//             devices: Device_Erpnext_Type[]
//         }
//     };

//     const device_biomax_id_map: {
//         [key: string]: Device_Erpnext_Type
//     } = {};

//     for await (const device of device_erpnext_list.data.devices) {
//         if (device.biometric_device_id) {
//             device_biomax_id_map[device.biometric_device_id] = device;
//         }
//     };


//     //check if the attendance table exists
//     const attendance_table_exists = await Attendance_Model.check_attendance_table_exists(device_log_table_name) as IResult<{
//         table_exists: number
//     }[]>;

//     if (attendance_table_exists.recordset[0].table_exists == 0) {
//         console.error(`${new Date().toLocaleString()}\t Attendance table ${device_log_table_name} does not exist`);
//         return;
//     }



//     //now we will have to get the attendance data from the device log table 
//     const attendance_data = await Attendance_Model.get_attendance_for_specific_date(
//         device_log_table_name,
//         date) as IResult<Device_Log_Biomax_Type>;

//     console.log(device_log_table_name,
//         date)

//     const attendance_erpnext_create_list: Attendance_Erpnext_Create_Type[] = [];
//     const attendance_records_for_csv: {
//         Employee: string;
//         Status: string;
//         "Attendance Date": Date;
//         "Device name": string;
//         "Table Name": string;
//         "Table Row ID": string;
//         "Attendance Marked At": Date;
//     }[] = [];

//     for await (const attendance of attendance_data.recordset) {
//         // console.log(attendance);
//         //get the device details from the device_erpnext_id_map
//         const device = device_biomax_id_map[attendance.DeviceId];

//         let device_name = device ? (device.device_name ?? null) : null;

//         let device_first_name = device ? (device.device_name ?? null) : null;

//         let location = device ? (device.point_id ?? null) : null;

//         //we will wrt to both biomax id and erpnext id, since for old employee we have biomax id and for new employee we have erpnext id

//         let employee = employee_biomax_id_map[attendance.UserId] ?? employee_erpnext_id_map[attendance.UserId];

//         let status: Attendance_Erpnext_Status_Enum = attendance_erpnext_status_enum.Values.Present;

//         const log_date = biomax_date_to_js_date(attendance.LogDate);

//         if (log_date.getHours() > 5 && log_date.getMinutes() > 30) {
//             //if the attendance is after 5:30 AM then it should be marked as absent
//             status = attendance_erpnext_status_enum.Values.Absent;
//         }

//         if (device_name && employee) {
//             const attendance_record = {
//                 employee: employee.id,
//                 custom_biometric_device: device_name,
//                 status: status,
//                 attendance_date: sql_date_format(attendance.LogDate, false) as any as Date,
//                 custom_table_name: device_log_table_name,
//                 custom_table_row_id: attendance.DeviceLogId.toString(),
//                 custom_biometric_marked_at: sql_date_format(attendance.LogDate) as any as Date,
//             };

//             attendance_erpnext_create_list.push(attendance_record);
//         }
//     }

//     // Create attendance records and update CSV data
//     for await (const record of attendance_erpnext_create_list) {
//         // const temp = await Attendance_Erp_Api.create(record);
//         attendance_records_for_csv.push({
//             Employee: record.employee,
//             Status: record.status,
//             "Attendance Date": record.attendance_date,
//             "Device name": record.custom_biometric_device,
//             "Table Name": record.custom_table_name,
//             "Table Row ID": record.custom_table_row_id,
//             "Attendance Marked At": record.custom_biometric_marked_at,
//         });
//         // console.log(temp);
//     }

//     // Generate CSV content
//     const csvHeaders = "Employee,Status,Attendance Date,Company,Device name,Device,Table Name,Table Row ID,Attendance Marked At,Point,Series";
//     const csvRows = attendance_records_for_csv.map(record =>
//         [
//             record.Employee,
//             record.Status,
//             record["Attendance Date"],
//             record.Company,
//             record["Device name"],
//             record.Device,
//             record["Table Name"],
//             record["Table Row ID"],
//             record["Attendance Marked At"],
//             record.Point,
//             record.Series
//         ].map(value => `"${value?.toString().replace(/"/g, '""') ?? ''}"`)
//             .join(',')
//     );
//     const csvContent = [csvHeaders, ...csvRows].join('\n');
//     console.log(csvContent);
//     // Write to file
//     const fs = require('fs');
//     const filename = `./attendance_import_${date.toISOString().split('T')[0]}_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
//     fs.writeFileSync(filename, csvContent);

//     console.info(`${new Date().toLocaleString()}\t CSV file created: ${filename}`);
//     console.info(`${new Date().toLocaleString()}\t Importing attendance to ERPNext from Biomax completed`);
// }

export const Attendance_Service = {
    import_attendance_to_erpnext_from_biomax,
    // import_attendance_to_erpnext_from_biomax_for_specific_date
}