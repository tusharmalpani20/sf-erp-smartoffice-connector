import axios from "axios";
import { biomax_axios_instance } from "../../../config/biomax.axios";
import { Employee_Biomax_Api_Create_Type } from "../schema/employee.schema";

const create = async (data: Employee_Biomax_Api_Create_Type) => {

    try {
        const result = await biomax_axios_instance.post("/api/v2/WebAPI/AddEmployee", data);
        console.log(result.data);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const add_user_to_device = async (data: {
    server_url: string,
    EmployeeCode: string,
    EmployeeName: string,
    CardNumber?: string,
    SerialNumbers: string,
    VerifyMode: number
}) => {

    try {
        const result = await axios.post(
            `${data.server_url.replace("/hdata.aspx", "")}/api/v2/WebAPI/UploadUser`,
            {

            },
            {
                params: {
                    APIKey: process.env.BIOMAX_APIKEY,
                    EmployeeCode: data.EmployeeCode,
                    EmployeeName: data.EmployeeName,
                    CardNumber: data.CardNumber,
                    SerialNumbers: data.SerialNumbers,
                    VerifyMode: data.VerifyMode
                }
            }
        )

        return true;
    } catch (error: any) {
        console.error(`Error in add_user_to_device: ${error.message}`);
        console.log(error.response.data)
        return false;
    }

}

const delete_user_from_device = async (data: {
    server_url: string,
    EmployeeCode: string,
    SerialNumbers: string
}) => {
    try {
        const result = await axios.post(
            `${data.server_url.replace("/hdata.aspx", "")}/api/v2/WebAPI/DeleteUser`,
            {

            },
            {
                params: {
                    APIKey: process.env.BIOMAX_APIKEY,
                    EmployeeCode: data.EmployeeCode,
                    SerialNumbers: data.SerialNumbers
                }
            }
        )
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const Employee_Biomax_Api = {
    create,
    add_user_to_device,
    delete_user_from_device
}