import { IResult } from "mssql";
import { biomax_date_to_js_date } from "../../../common/helper/date.helper";
import { Device_Erp_Api } from "../../device/erp_api/device.erp_api";
import { Device_Model } from "../../device/model/device.model";
import { Device_Biomax_Type, Device_Erpnext_Type } from "../../device/schema/device.schema";
import { Location_Erp_Api } from "../../location/location_erp_api/location.erp_api";
import { Location_Erpnext_Type } from "../../location/schema/location.schema";
import { Employee_Biomax_Api } from "../biomax_api/employee.biomax_api";
import { Employee_Erp_Api } from "../erp_api/employee.erp_api";
import { Employee_Model } from "../model/employee.model";
import {
    Employee_Biomax_Api_Create_Type,
    Employee_Biomax_Type,
    Employee_Erpnext_Type,
    Employee_Erpnext_Update_Employee_Id_Type
} from "../schema/employee.schema";



const import_employee_to_biomax_from_erpnext_via_biomax_api = async () => {
    //in this route we will get all the employee created in erpnext and add their entries in biomax
    //after adding the entires we will update the custom_employee_id in erpnext with the EmployeeId of biomax

    console.info(`${new Date().toLocaleString()}\t Importing employee to Biomax from ERPNext`);

    const employee_erpnext_list = await Employee_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: { employees : Employee_Erpnext_Type[]}
    };

    //Get all the location info from erpnext
    const location_erpnext_list = await Location_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            points: Location_Erpnext_Type[]
        }
    };

    //make a map of location based on smart office id 
    const location_erpnext_id_map: {
        [key: string]: Location_Erpnext_Type
    } = {};

    for await (const location of location_erpnext_list.data.points) {
        location.smart_office_id && (location_erpnext_id_map[location.smart_office_id] = location);
    };

    //get all the device info from biomax
    const device_biomax_list = await Device_Model.get_all() as IResult<Device_Biomax_Type>;

    //make a map of device based on their DeviceLocation
    const device_biomax_location_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        if (device.DeviceLocation) {
            device_biomax_location_map[device.DeviceLocation] = device;
        }
    };


    //get all the device info from erpnext
    const device_erpnext_list = await Device_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            devices: Device_Erpnext_Type[]
        }
    };

    //make a map of devices based on their serial number
    const device_erpnext_serial_number_map: {
        [key: string]: Device_Erpnext_Type
    } = {};

    for await (const device of device_erpnext_list.data.devices) {
        device.serial_number && (device_erpnext_serial_number_map[device.serial_number] = device);
    };

    //filter all the employee with empty custom_employee_id

    const employee_to_create_in_biomax: Employee_Biomax_Api_Create_Type[] = [];

    for await (const employee of employee_erpnext_list.data.employees) {

        if (!employee.attendance_device_id) {

            const location_details = employee.custom_point && location_erpnext_id_map[employee.custom_point] ? location_erpnext_id_map[employee.custom_point] : null;

            employee_to_create_in_biomax.push({
                StaffCode: employee.id,
                StaffName: employee.employee_name,
                Gender: employee.gender as "Male" | "Female" | "Other",
                Location: location_details ? location_details.id : "Default",
                Status: "Working",
                CompanySName: "Default",
                CategorySName: "Default",
                HolidayGroupCode: "Default",
                ShiftGroupCode: "Default",
                DepartmentSName: "Default",
                Grade: "Default",
                Team: "Default",
            });
        };
    };


    const employee_with_biomax_id_list: Employee_Erpnext_Update_Employee_Id_Type[] = [];

    for await (const employee of employee_to_create_in_biomax) {

        const is_user_added_to_biomax = await Employee_Biomax_Api.create(employee);

        //get the employee details from biomax using the employee code
        const biomax_employee_detail = await Employee_Model.get_by_employee_code(employee.StaffCode) as IResult<Employee_Biomax_Type>;

        if (biomax_employee_detail.recordset.length > 0) {
            //if there is no employee found in biomax then we will have to skip this employee
            //set the location of the employee to null
            await Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);
        }

        if (is_user_added_to_biomax) {

            let device_erpnext_name: string | null = null;

            const biomax_employee_detail = await Employee_Model.get_by_employee_code(employee.StaffCode) as IResult<Employee_Biomax_Type>;

            //check if there is any device for the location
            //if there is a device then we will have to add check if the device is online and has a ServerUrl specified

            if (employee.Location && device_biomax_location_map[employee.Location]) {
                const device_info = device_biomax_location_map[employee.Location];

                const current_time = new Date();

                const last_ping_time = device_info.LastPing ? biomax_date_to_js_date(device_info.LastPing) : null;

                const server_url = device_info.ServerURL ? device_info.ServerURL.trim() : null;

                const is_device_online = last_ping_time && current_time.getTime() - last_ping_time.getTime() < 2 * 60 * 1000;


                //check if the difference between current time and last ping time is not more than 2 minutes
                if (server_url && is_device_online) {
                    //we will add the user to the device
                    const is_user_added_to_device = await Employee_Biomax_Api.add_user_to_device({
                        server_url: server_url,
                        EmployeeCode: employee.StaffCode,
                        EmployeeName: employee.StaffName,
                        SerialNumbers: device_info.SerialNumber,
                        VerifyMode: 1,
                    });

                    if (is_user_added_to_device) {
                        //now we will have to update the employee detail in erp as well, saying the user is registered in which biomax system

                        //get the device details from the device_erpnext_serial

                        device_erpnext_name = device_erpnext_serial_number_map[device_info.SerialNumber] ? device_erpnext_serial_number_map[device_info.SerialNumber].id : null;

                    } else {
                        //if there was a error in adding the user to the device then we will have to set the device_erpnext_name to null
                        device_erpnext_name = null;

                        //and also update the location of the employee in biomax to null
                        await Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);

                    }
                } else {
                    //even if the device is not online , we need to mark the location as null
                    device_erpnext_name = null;

                    //and also update the location of the employee in biomax to null
                    await Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);

                }
            } else {
                //even if the device is not online , we need to mark the location as null
                device_erpnext_name = null;

                //and also update the location of the employee in biomax to null
                await Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);
            }


            //if the device is set to null, then we will have to update the biomax employee detail and set the location to null
            //we are doing this, incase if a location does not have any device attached to it or in the case of a device being offline
            if (!device_erpnext_name) {
                await Employee_Model.update_location(biomax_employee_detail.recordset[0].EmployeeId, null);
            }

            //once the employee is created in biomax we will have to get the user's biomax id 

            employee_with_biomax_id_list.push({
                name: employee.StaffCode,
                attendance_device_id: biomax_employee_detail.recordset[0].EmployeeId.toString(),
                custom_biometric_device: device_erpnext_name ? device_erpnext_name : null
            });

        }
        console.log(employee.StaffCode, is_user_added_to_biomax);
    };



    if (employee_with_biomax_id_list.length > 0) {
        await Employee_Erp_Api.update_employee_id(employee_with_biomax_id_list);
    };

    console.info(`${new Date().toLocaleString()}\t Importing employee to Biomax from ERPNext completed`);
};

const remove_employee_from_devices = async () => {
    //in this function we will check if the location of the employee 
    //if there is a change in location, then we will remove the employee from the device and make the custom_device field as null in erpnext

    //this should only be done if the device is online and has ServerURL specified

    console.info(`${new Date().toLocaleString()}\t Removing employee from devices`);
    const employee_erpnext_list = await Employee_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: { employees : Employee_Erpnext_Type[]}
    };

    const employee_biomax_list = await Employee_Model.get_all() as IResult<Employee_Biomax_Type>;

    //make a map of employee biomax id
    const employee_biomax_id_map: {
        [key: string]: Employee_Biomax_Type
    } = {};

    for await (const employee of employee_biomax_list.recordset) {
        employee_biomax_id_map[employee.EmployeeId.toString()] = employee;
    };

    const device_erpnext_list = await Device_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: { devices : Device_Erpnext_Type[] } 
    };

    const device_erpnext_id_map: {
        [key: string]: Device_Erpnext_Type
    } = {};

    for await (const device of device_erpnext_list.data.devices) {
        device_erpnext_id_map[device.id] = device;
    };

    const location_erpnext_list = await Location_Erp_Api.get_all() as {
        status: string,
        message: string,
        data:  { points : Location_Erpnext_Type[] } 
    };

    const location_erpnext_id_map: {
        [key: string]: Location_Erpnext_Type
    } = {};

    for await (const location of location_erpnext_list.data.points) {
        location_erpnext_id_map[location.id] = location;
    };

    const location_biomax_id_map: {
        [key: string]: Location_Erpnext_Type
    } = {};

    for await (const location of location_erpnext_list.data.points) {
        location.smart_office_id && (location_biomax_id_map[location.smart_office_id] = location);
    };

    //and now get the device details from biomax

    const device_biomax_list = await Device_Model.get_all() as IResult<Device_Biomax_Type>;

    const device_biomax_id_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        device_biomax_id_map[device.DeviceId.toString()] = device;
    };

    const device_biomax_location_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        device.DeviceLocation && (device_biomax_location_map[device.DeviceLocation] = device);
    };

    const device_biomax_serial_number_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        device.SerialNumber && (device_biomax_serial_number_map[device.SerialNumber] = device);
    };

    //once we have all the details, we will start checking if there is any changes in location of employee location 
    //if there is a change in the employee location, then we will remove the employee from the device and update the employee location to null in biomax

    for await (const employee of employee_erpnext_list.data.employees) {

        if (!employee.attendance_device_id) {
            //if there is no attendance_device_id, then there is nothing to do
            continue;
        }

        if (!employee.custom_point) {
            //if there is no location assigned to a user then there is nothing to do
            continue;
        }

        const erpnext_location_info = location_erpnext_id_map[employee.custom_point];

        if (!erpnext_location_info.smart_office_id) {
            //if there is no location id assigned to the location then there is nothing to do
            continue;
        }

        //now we will check if the location id of biomax is same as the location id of erpnext
        const bio_max_employee = employee_biomax_id_map[employee.attendance_device_id];

        const employee_biomax_location_id = bio_max_employee.Location;

        //if the location id in biomax is 23 then we need to set the location id to null
        //since 23 is the default location id in biomax
        if (employee_biomax_location_id == 23) {
            await Employee_Model.update_location(bio_max_employee.EmployeeId, null);
            continue;
        }

        const erpnext_location_id = Number(erpnext_location_info.smart_office_id);

        if (!employee_biomax_location_id) {
            //if there is no location id assigned to the employee in biomax then there is nothing to do
            continue;
        }

        if (employee_biomax_location_id == erpnext_location_id) {
            //if the location id is same then there is nothing to do
            continue;
        }


        //now we know that the location has been changed

        //first we will remove the user from the previous device

        const previous_device_serial_number = employee.custom_biometric_device ? (device_erpnext_id_map[employee.custom_biometric_device].serial_number) : null;

        if (previous_device_serial_number) {
            //if there is a previous device then we will remove the user from the device
            const biomax_device_details = device_biomax_serial_number_map[previous_device_serial_number];

            //check if the device is online and has ServerURL specified

            const current_time = new Date();
            const last_ping_time = biomax_device_details.LastPing ? biomax_date_to_js_date(biomax_device_details.LastPing) : null;

            const is_device_online = last_ping_time && current_time.getTime() - last_ping_time.getTime() < 2 * 60 * 1000;

            if (biomax_device_details.ServerURL && is_device_online) {
                const result = await Employee_Biomax_Api.delete_user_from_device({
                    server_url: biomax_device_details.ServerURL,
                    EmployeeCode: employee.id,
                    SerialNumbers: biomax_device_details.SerialNumber,
                });

                console.log("Employee deleted from device: ", result);

                if (result) {
                    //and simply update the location of the employee in biomax and set it to null
                    await Employee_Model.update_location(bio_max_employee.EmployeeId, null);

                    //and now set the custom_biometric_device field to null in erpnext
                    await Employee_Erp_Api.update_employee_biometric_device({
                        name: employee.id,
                        custom_biometric_device: null
                    });
                } else {
                    console.log("Employee deletion from device failed: ", result);
                }

            } else {
                //if there is a device but the device is currently offline, then we will continue and wait for the device to come online
                continue;
            }
        }
    }

    console.info(`${new Date().toLocaleString()}\t Removing employee from devices completed`);
}

const remove_employee_from_devices_with_status_left_or_inactive = async () => {

    //in this function we will check if the location of the employee 
    //if there is a change in location, then we will remove the employee from the device and make the custom_device field as null in erpnext

    //this should only be done if the device is online and has ServerURL specified

    console.info(`${new Date().toLocaleString()}\t Removing inactive or left employees from devices`);
    const employee_erpnext_list = await Employee_Erp_Api.get_all_inactive_or_left_employees_having_device_id() as {
        status: string,
        message: string,
        data: {
            employees: Employee_Erpnext_Type[]
        }
    };

    const employee_biomax_list = await Employee_Model.get_all() as IResult<Employee_Biomax_Type>;

    //make a map of employee biomax id
    const employee_biomax_id_map: {
        [key: string]: Employee_Biomax_Type
    } = {};

    for await (const employee of employee_biomax_list.recordset) {
        employee_biomax_id_map[employee.EmployeeId.toString()] = employee;
    };

    const device_erpnext_list = await Device_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            devices: Device_Erpnext_Type[]
        }
    };

    const device_erpnext_id_map: {
        [key: string]: Device_Erpnext_Type
    } = {};

    for await (const device of device_erpnext_list.data.devices) {
        device_erpnext_id_map[device.id] = device;
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

    const location_biomax_id_map: {
        [key: string]: Location_Erpnext_Type
    } = {};

    for await (const location of location_erpnext_list.data.points) {
        location.smart_office_id && (location_biomax_id_map[location.smart_office_id] = location);
    };

    //and now get the device details from biomax

    const device_biomax_list = await Device_Model.get_all() as IResult<Device_Biomax_Type>;

    const device_biomax_id_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        device_biomax_id_map[device.DeviceId.toString()] = device;
    };

    const device_biomax_location_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        device.DeviceLocation && (device_biomax_location_map[device.DeviceLocation] = device);
    };

    const device_biomax_serial_number_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        device.SerialNumber && (device_biomax_serial_number_map[device.SerialNumber] = device);
    };

    //once we have all the details, we will check if the employee was assigned to a location and if yes. Then we will remove the employee from the device, given the employee is offline
    for await (const employee of employee_erpnext_list.data.employees) {

        if (!employee.attendance_device_id) {
            //if there is no custom employee id, then there is nothing to do
            continue;
        }

        if (!employee.custom_point) {
            //if there is no location assigned to a user then there is nothing to do
            continue;
        }

        const erpnext_location_info = location_erpnext_id_map[employee.custom_point];

        if (!erpnext_location_info.smart_office_id) {
            //if there is no location id assigned to the location then there is nothing to do
            continue;
        }

        //now we will check if the location id of biomax is same as the location id of erpnext
        const bio_max_employee = employee_biomax_id_map[employee.attendance_device_id];

        const employee_biomax_location_id = bio_max_employee.Location;


        if (!employee_biomax_location_id) {
            //if there is no location id assigned to the employee in biomax then there is nothing to do
            continue;
        }

        //now we will remove the employee from the device

        const device_serial_number = employee.custom_biometric_device ? (device_erpnext_id_map[employee.custom_biometric_device].serial_number) : null;

        if (device_serial_number) {
            //if there is a previous device then we will remove the user from the device
            const biomax_device_details = device_biomax_serial_number_map[device_serial_number];

            //check if the device is online and has ServerURL specified

            const current_time = new Date();
            const last_ping_time = biomax_device_details.LastPing ? biomax_date_to_js_date(biomax_device_details.LastPing) : null;

            const is_device_online = last_ping_time && current_time.getTime() - last_ping_time.getTime() < 2 * 60 * 1000;

            if (biomax_device_details.ServerURL && is_device_online) {
                const result = await Employee_Biomax_Api.delete_user_from_device({
                    server_url: biomax_device_details.ServerURL,
                    EmployeeCode: employee.id,
                    SerialNumbers: biomax_device_details.SerialNumber,
                });

                console.log("Employee deleted from device: ", result);

                if (result) {
                    //and simply update the location of the employee in biomax and set it to null
                    await Employee_Model.update_location(bio_max_employee.EmployeeId, null);

                    //and now set the custom_device field to null in erpnext
                    await Employee_Erp_Api.update_employee_biometric_device({
                        name: employee.id,
                        custom_biometric_device: null
                    });
                } else {
                    console.log("Employee deletion from device failed: ", result);
                }

            } else {
                //if there is a device but the device is currently offline, then we will continue and wait for the device to come online
                continue;
            }
        }
    }

    console.info(`${new Date().toLocaleString()}\t Removing employee from devices completed`);
}

const add_employee_to_devices = async () => {
    console.info(`${new Date().toLocaleString()}\t Adding employee to devices`);

    //in this function we will check if the location of the employee has been changed
    //if there is a change in location, then we will add the employee to the device and update the employee location in biomax

    //this should only be done if the device is online and has ServerURL specified


    const employee_erpnext_list = await Employee_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            employees: Employee_Erpnext_Type[]
        }
    };

    const employee_biomax_list = await Employee_Model.get_all() as IResult<Employee_Biomax_Type>;

    //make a map of employee biomax id
    const employee_biomax_id_map: {
        [key: string]: Employee_Biomax_Type
    } = {};

    for await (const employee of employee_biomax_list.recordset) {
        employee_biomax_id_map[employee.EmployeeId.toString()] = employee;
    };

    const device_erpnext_list = await Device_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            devices: Device_Erpnext_Type[]
        }
    };

    const device_erpnext_id_map: {
        [key: string]: Device_Erpnext_Type
    } = {};

    for await (const device of device_erpnext_list.data.devices) {
        device_erpnext_id_map[device.id] = device;
    };

    const device_erpnext_serial_number_map: {
        [key: string]: Device_Erpnext_Type
    } = {};

    for await (const device of device_erpnext_list.data.devices) {
        device.serial_number && (device_erpnext_serial_number_map[device.serial_number] = device);
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

    const location_biomax_id_map: {
        [key: string]: Location_Erpnext_Type
    } = {};

    for await (const location of location_erpnext_list.data.points) {
        location.smart_office_id && (location_biomax_id_map[location.smart_office_id] = location);
    };

    //and now get the device details from biomax

    const device_biomax_list = await Device_Model.get_all() as IResult<Device_Biomax_Type>;

    const device_biomax_id_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        device_biomax_id_map[device.DeviceId.toString()] = device;
    };

    const device_biomax_location_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        device.DeviceLocation && (device_biomax_location_map[device.DeviceLocation] = device);
    };

    const device_biomax_serial_number_map: {
        [key: string]: Device_Biomax_Type
    } = {};

    for await (const device of device_biomax_list.recordset) {
        device.SerialNumber && (device_biomax_serial_number_map[device.SerialNumber] = device);
    };

    //once we have all the details, we will start checking if there is any changes in location of employee location 
    //if there is a change in the employee location, then we will add the employee to the device and update the employee location in biomax

    for await (const employee of employee_erpnext_list.data.employees) {

        if (!employee.attendance_device_id) {
            //if there is no custom employee id, then there is nothing to do
            //this means that the employee has been created in erpnext but not in biomax
            continue;
        }

        if (!employee.custom_point) {
            //if there is no location assigned to a user then there is nothing to do
            continue;
        }

        const erpnext_location_info = location_erpnext_id_map[employee.custom_point];

        if (!erpnext_location_info.smart_office_id) {
            //if there is no location id assigned to the location then there is nothing to do
            //this means that the location has been entered in erpnext but not in biomax
            continue;
        }

        //now we will check if the location id of biomax should be null and the location id of erpnext is not null
        const bio_max_employee = employee_biomax_id_map[employee.attendance_device_id];

        const employee_biomax_location_id = bio_max_employee.Location;

        const erpnext_location_id = Number(erpnext_location_info.smart_office_id);



        if (!(employee_biomax_location_id == null && erpnext_location_id)) {
            //we are making sure that the location of the biomax is null and the location of erpnext is not null
            //cause for all the new entries and for the entries where the location has been changed, the location id initially needs to be null
            //and then we will add the user to the device in the new location
            continue;
        }

        //we will get check if there is a new device in the location and if there is a new device then we will add the user to the device

        const device_in_new_location = device_biomax_location_map[erpnext_location_id];

        if (!device_in_new_location) {
            //if there is no device in the new location then there is nothing to do
            continue;
        }

        //now check if the device is online and has ServerURL specified
        const current_time = new Date();
        const last_ping_time = device_in_new_location.LastPing ? biomax_date_to_js_date(device_in_new_location.LastPing) : null;

        const is_device_online = last_ping_time && current_time.getTime() - last_ping_time.getTime() < 2 * 60 * 1000;

        if (!is_device_online || !device_in_new_location.ServerURL) {
            //if the device is offline and does not have ServerURL specified then we will continue and wait for the device to come online
            continue;
        }

        device_in_new_location.ServerURL = device_in_new_location.ServerURL.trim();

        if (!device_in_new_location.ServerURL) {
            //if the server url is empty then there is nothing to do
            continue;
        }

        //now we will add the user to the device
        const reuslt = await Employee_Biomax_Api.add_user_to_device({
            server_url: device_in_new_location.ServerURL,
            EmployeeCode: employee.id,
            EmployeeName: employee.employee_name,
            CardNumber: "",
            SerialNumbers: device_in_new_location.SerialNumber,
            VerifyMode: 1
        });

        if (!reuslt) {
            //if the user addition to the device failed then there is nothing to do
            continue;
        }
        console.log(employee.id, device_in_new_location.SerialNumber, reuslt);
        //and simply update the location of the employee in biomax and set it to null
        await Employee_Model.update_location(bio_max_employee.EmployeeId, erpnext_location_id);

        //and now set the custom_device field to null in erpnext
        await Employee_Erp_Api.update_employee_biometric_device({
            name: employee.id,
            custom_biometric_device: device_erpnext_serial_number_map[device_in_new_location.SerialNumber].id
        });
    }


    console.info(`${new Date().toLocaleString()}\t Adding employee to devices completed`);
}

export const Employee_Service = {
    import_employee_to_biomax_from_erpnext_via_biomax_api,
    remove_employee_from_devices,
    remove_employee_from_devices_with_status_left_or_inactive,
    add_employee_to_devices
}