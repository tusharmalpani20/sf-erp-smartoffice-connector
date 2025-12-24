import { IResult } from "mssql";
import { sql_date_format } from "../../../common/helper/date.helper";
import { Location_Erp_Api } from "../../location/location_erp_api/location.erp_api";
import { Location_Erpnext_Type } from "../../location/schema/location.schema";
import { Device_Erp_Api } from "../erp_api/device.erp_api";
import { Device_Model } from "../model/device.model";
import {
    Device_Biomax_Type,
    Device_Erpnext_Create_Type,
    Device_Erpnext_Type,
    Device_Erpnext_Update_Type
} from "../schema/device.schema";

const import_device_to_erpnext_from_biomax = async () => {

    console.info(`${new Date().toLocaleString()}\t Importing device to ERPNext from Biomax`);

    const device_biomax_list = await Device_Model.get_all() as IResult<Device_Biomax_Type>;

    const device_erpnext_list = await Device_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            devices: Device_Erpnext_Type[]
        }
    };

    //get location list from erp
    const location_erpnext_list = await Location_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            points: Location_Erpnext_Type[]
        }
    };

    //make a map of location name 
    const location_erpnext_biomax_id_map: {
        [key: string]: Location_Erpnext_Type
    } = {};

    for await (const location of location_erpnext_list.data.points) {
        location.smart_office_id && (location_erpnext_biomax_id_map[location.smart_office_id] = location);
    };

    //if a device is not in the device_erpnext_list, then create it
    const create_device_list: Device_Erpnext_Create_Type[] = [];

    for await (const device_biomax of device_biomax_list.recordset) {
        if (!device_erpnext_list.data.devices.find((device: Device_Erpnext_Type) => device.biometric_device_id && device.biometric_device_id == device_biomax.DeviceId.toString())) {

            let location_name = ( 
                device_biomax.DeviceLocation 
                && 
                location_erpnext_biomax_id_map[device_biomax.DeviceLocation] 
            ) ? location_erpnext_biomax_id_map[device_biomax.DeviceLocation].id : "";

            create_device_list.push({
                biometric_device_id: device_biomax.DeviceId.toString(),
                device_name: device_biomax.DeviceFName,
                serial_number: device_biomax.SerialNumber,
                device_model: device_biomax.DeviceModel,
                device_vendor: device_biomax.DeviceVendor,
                device_type: device_biomax.DeviceType,
                point: location_name,
                device_direction: device_biomax.DeviceDirection,
                connection_type: device_biomax.ConnectionType,
                ip_address: device_biomax.IpAddress,
                last_ping_time: device_biomax.LastPing ? (sql_date_format(device_biomax.LastPing) as any as Date) : null,
                is_real_time: device_biomax.IsRealTime,
                device_info: device_biomax.DeviceInfo,
                user_count: device_biomax.UserCount,
                finger_print_count: device_biomax.FPCount,
                server_url: device_biomax.ServerURL,
            });
        };
    };

    if (create_device_list.length > 0) {
        await Device_Erp_Api.create(create_device_list);
    }

    console.info(`${new Date().toLocaleString()}\t Importing device to ERPNext from Biomax completed`);

}

const update_device_in_erpnext = async () => {

    try {
        //if there is change in device info in biomax, then update it in erpnext

        console.info(`${new Date().toLocaleString()}\t Updating device in ERPNext from Biomax`);

        const get_biomax_device_list = await Device_Model.get_all() as IResult<Device_Biomax_Type>;

        const get_erpnext_device_list = await Device_Erp_Api.get_all() as {
            status: string,
            message: string,
            data: {
                devices: Device_Erpnext_Type[]
            }
        };

        //make a map of device id
        const erpnextdevice_biomax_id_map: {
            [key: string]: Device_Erpnext_Type
        } = {};

        for await (const device of get_erpnext_device_list.data.devices) {
            device.biometric_device_id && (erpnextdevice_biomax_id_map[device.biometric_device_id] = device);
        }

        //get location list from erp next as well
        const location_erpnext_list = await Location_Erp_Api.get_all() as {
            status: string,
            message: string,
            data: {
                points: Location_Erpnext_Type[]
            }
        };

        //make a map of location name 
        const location_name_map: {
            [key: string]: Location_Erpnext_Type
        } = {};

        for await (const location of location_erpnext_list.data.points) {
            location.smart_office_id && (location_name_map[location.smart_office_id] = location);
        };

        const update_device_list: Device_Erpnext_Update_Type[] = [];

        for await (const device of get_biomax_device_list.recordset) {

            const erpnext_device = erpnextdevice_biomax_id_map[device.DeviceId.toString()];

            if (erpnext_device) {

                let biomax_last_ping: string | null = null;

                if (device.LastPing) {
                    biomax_last_ping = `${new Date(device.LastPing).getFullYear()}-${new Date(device.LastPing).getMonth() + 1}-${new Date(device.LastPing).getDate()} ${new Date(device.LastPing).getHours()}:${new Date(device.LastPing).getMinutes()}:${device.LastPing.getSeconds()}`;
                }

                let erpnext_last_ping: string | null = null;

                if (erpnext_device.last_ping_time) {
                    erpnext_last_ping = `${new Date(erpnext_device.last_ping_time).getFullYear()}-${new Date(erpnext_device.last_ping_time).getMonth() + 1}-${new Date(erpnext_device.last_ping_time).getDate()} ${new Date(erpnext_device.last_ping_time).getHours()}:${new Date(erpnext_device.last_ping_time).getMinutes()}:${new Date(erpnext_device.last_ping_time).getSeconds()}`;
                }

                //check if any of it's field has changed
                if (erpnext_device.device_name != device.DeviceFName ||
                    erpnext_device.serial_number != device.SerialNumber ||
                    erpnext_device.device_model != device.DeviceModel ||
                    erpnext_device.device_vendor != device.DeviceVendor ||
                    erpnext_device.device_type != device.DeviceType ||
                    erpnext_device.point_id != device.DeviceLocation ||
                    erpnext_device.device_direction != device.DeviceDirection ||
                    erpnext_device.connection_type != device.ConnectionType ||
                    erpnext_device.ip_address != device.IpAddress ||
                    biomax_last_ping != erpnext_last_ping
                ) {

                    let location_name = ( 
                        device.DeviceLocation 
                        && 
                        location_name_map[device.DeviceLocation]
                     ) ? location_name_map[device.DeviceLocation].id : null;

                    update_device_list.push({
                        name: erpnext_device.id,
                        biometric_device_id: erpnext_device.biometric_device_id,
                        device_name: device.DeviceFName,
                        device_direction: device.DeviceDirection,
                        serial_number: device.SerialNumber,
                        connection_type: device.ConnectionType,
                        ip_address: device.IpAddress,
                        device_type: device.DeviceType,
                        last_ping_time: device.LastPing ? (sql_date_format(device.LastPing) as any as Date) : null,
                        is_real_time: device.IsRealTime,
                        device_vendor: device.DeviceVendor,
                        device_info: device.DeviceInfo ? device.DeviceInfo : {},
                        user_count: device.UserCount,
                        finger_print_count: device.FPCount,
                        device_model: device.DeviceModel,
                        server_url: device.ServerURL,
                        point: location_name
                    });
                }

            }
        }

        if (update_device_list.length > 0) {
            await Device_Erp_Api.update(update_device_list);
        }

        console.info(`${new Date().toLocaleString()}\t Updating device in ERPNext from Biomax completed`);
    } catch (error) {
        console.log(`Error in update_device_in_erpnext function ${error}`);
    }



};

export const Device_Service = {
    import_device_to_erpnext_from_biomax,
    update_device_in_erpnext
}