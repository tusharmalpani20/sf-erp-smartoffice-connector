import { IResult } from "mssql";
import { Location_Model } from "../model/location.model";
import { 
    Location_Biomax_Create_Type,
    Location_Biomax_Type, 
    Location_Biomax_Update_Type, 
    Location_Erpnext_Type
} from "../schema/location.schema";
import { Location_Erp_Api } from "../location_erp_api/location.erp_api";


const import_location_to_biomax_from_erpnext = async () => {
    //in this function we will get all the location created in erpnext and add their entries in biomax
    //after adding the entires we will update the location_id in erpnext with the LocationID of biomax

    console.info(`${new Date().toLocaleString()}\t Importing location to Biomax from ERPNext`);

    const location_erpnext_list = await Location_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            points: Location_Erpnext_Type[]
        }
    };

    const location_to_create_in_biomax: Location_Biomax_Create_Type[] = [];

    for await (const location of location_erpnext_list.data.points) {
        //filter all the location with empty location_id
        //if a location_id is empty then we will create it in biomax
        if (!location.smart_office_id) {
            location_to_create_in_biomax.push({
                LocationName: location.point_name,
                LocationCode: location.id,
                LocationLattitude: location.latitude,
                LocationLongitude: location.longitude,
                Radius: location.radius,
                LocationFullAddress: location.zone_name + ", " + location.branch_id,
            });

            console.log("Added point to create in Biomax", location.id);
        };
    };

    const location_with_biomax_id_list: {
        name: string,
        smart_office_id: string
    }[] = [];

    for await (const location of location_to_create_in_biomax) {
        const biomax_location_id = await Location_Model.create(location) as IResult<Location_Biomax_Type>;

        location_with_biomax_id_list.push({
            name: location.LocationCode,
            smart_office_id: biomax_location_id.recordset[0].LocationId.toString(),
            
        });
    };

    if (location_with_biomax_id_list.length > 0) {
        await Location_Erp_Api.update_point_id(location_with_biomax_id_list);
    };

    console.info(`${new Date().toLocaleString()}\t Importing location to Biomax from ERPNext completed`);

}

const update_location_data_in_biomax_from_erpnext = async () => {
    //here we will get all the location from erpnext and check if there is any location that has any updated fields
    //if there is any updated field then we will update the record in biomax as well

    console.info(`${new Date().toLocaleString()}\t Updating location data in Biomax from ERPNext`);

    const location_erpnext_list = await Location_Erp_Api.get_all() as {
        status: string,
        message: string,
        data: {
            points: Location_Erpnext_Type[]
        }
    };

    const location_biomax_list = await Location_Model.get_all() as IResult<Location_Biomax_Type>;

    const location_biomax_id_map: {
        [key: string]: Location_Biomax_Type
    } = {};

    for await (const location of location_biomax_list.recordset) {
        location_biomax_id_map[location.LocationId.toString()] = location;
    };

    const update_biomax_location_list: Location_Biomax_Update_Type[] = [];

    //now loop through the location_erpnext_list and check if there are any updated fields
    for await (const location of location_erpnext_list.data.points) {

        if (location.smart_office_id) {
            const biomax_location = location_biomax_id_map[location.smart_office_id];

            //now we will check if there are any updated fields in the location 
            if (location.point_name != biomax_location.LocationName
                || location.id != biomax_location.LocationCode
                || location.latitude != biomax_location.LocationLattitude
                || location.longitude != biomax_location.LocationLongitude
                || location.radius != biomax_location.Radius
                || (location.zone_name + ", " + location.branch_id) != biomax_location.LocationFullAddress) {

                update_biomax_location_list.push({
                    LocationId: Number(location.smart_office_id),
                    LocationName: location.point_name,
                    LocationCode: location.id,
                    LocationLattitude: location.latitude,
                    LocationLongitude: location.longitude,
                    Radius: location.radius,
                    LocationFullAddress: (location.zone_name + ", " + location.branch_id),
                });

                console.log("Update point", location);
            }
        }
    }

    if (update_biomax_location_list.length > 0) {
        for await (const location of update_biomax_location_list) {
            await Location_Model.update(location);
        }
    }

    console.info(`${new Date().toLocaleString()}\t Updating location data in Biomax from ERPNext completed`);
}

export const Location_Service = {
    import_location_to_biomax_from_erpnext,
    update_location_data_in_biomax_from_erpnext
}