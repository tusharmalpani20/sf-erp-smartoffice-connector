import cron from "node-cron";
import { Attendance_Service } from "../module/attendance/service/attendance.service";
import { Device_Service } from "../module/device/service/device.service";
import { Employee_Service } from "../module/employee/service/employee.service";
import { Location_Service } from "../module/location/service/location.service";


export const index_cron_job_function = async (
    is_initial_load_required: boolean
) => {

    // if (is_initial_load_required) {
    //     await Location_Service.import_location_to_erpnext_from_biomax();
    //     await Device_Service.import_device_to_erpnext_from_biomax();
    //     await Employee_Service.import_employee_to_erpnext_from_biomax();
    // }

    


    console.log(`${new Date().toISOString()} Cron job started\n\n`)

        // //Importing and updating Location from ERPNext to Biomax
        // await Location_Service.import_location_to_biomax_from_erpnext();

        // await Location_Service.update_location_data_in_biomax_from_erpnext();

        //Importing and updating Device from ERPNext to Biomax
        await Device_Service.import_device_to_erpnext_from_biomax();

    //     await Device_Service.update_device_in_erpnext();

    //     //Importing and updating Employee from ERPNext to Biomax
    //     await Employee_Service.import_employee_to_biomax_from_erpnext_via_biomax_api();

    //     //Removing Employee from Devices
    //     await Employee_Service.remove_employee_from_devices();

    //     //Removing Employee from Devices with status left or inactive
    //     await Employee_Service.remove_employee_from_devices_with_status_left_or_inactive();

    //     //Adding Employee to Devices
    //     await Employee_Service.add_employee_to_devices();

    //     //Importing Attendance from Biomax to ERPNext
    //     await Attendance_Service.import_attendance_to_erpnext_from_biomax();

    //     console.log(`${new Date().toISOString()} Cron job ended\n\n`)

    // // await Attendance_Service.import_attendance_to_erpnext_from_biomax_for_specific_date(new Date('2025-01-25'));
    // // await Attendance_Service.import_attendance_to_erpnext_from_biomax_for_specific_date(new Date('2025-01-26'));
    // cron.schedule('* * * * *', async () => {

    //     console.log(`${new Date().toISOString()} Cron job started\n\n`)

    //     //Importing and updating Location from ERPNext to Biomax
    //     await Location_Service.import_location_to_biomax_from_erpnext();

    //     await Location_Service.update_location_data_in_biomax_from_erpnext();

    //     //Importing and updating Device from ERPNext to Biomax
    //     await Device_Service.import_device_to_erpnext_from_biomax();

    //     await Device_Service.update_device_in_erpnext();

    //     //Importing and updating Employee from ERPNext to Biomax
    //     await Employee_Service.import_employee_to_biomax_from_erpnext_via_biomax_api();

    //     //Removing Employee from Devices
    //     await Employee_Service.remove_employee_from_devices();

    //     //Removing Employee from Devices with status left or inactive
    //     await Employee_Service.remove_employee_from_devices_with_status_left_or_inactive();

    //     //Adding Employee to Devices
    //     await Employee_Service.add_employee_to_devices();

    //     //Importing Attendance from Biomax to ERPNext
    //     await Attendance_Service.import_attendance_to_erpnext_from_biomax();

    //     console.log(`${new Date().toISOString()} Cron job ended\n\n`)

    // });
};

/*

{
  "Message": "An error has occurred.",
  "ExceptionMessage": "Incorrect syntax near ')'.",
  "ExceptionType": "System.Data.SqlClient.SqlException",
  "StackTrace": "   at System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction)\r\n   at System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose)\r\n   at System.Data.SqlClient.TdsParser.TryRun(RunBehavior runBehavior, SqlCommand cmdHandler, SqlDataReader dataStream, BulkCopySimpleResultSet bulkCopyHandler, TdsParserStateObject stateObj, Boolean& dataReady)\r\n   at System.Data.SqlClient.SqlDataReader.TryConsumeMetaData()\r\n   at System.Data.SqlClient.SqlDataReader.get_MetaData()\r\n   at System.Data.SqlClient.SqlCommand.FinishExecuteReader(SqlDataReader ds, RunBehavior runBehavior, String resetOptionsString, Boolean isInternal, Boolean forDescribeParameterEncryption, Boolean shouldCacheForAlwaysEncrypted)\r\n   at System.Data.SqlClient.SqlCommand.RunExecuteReaderTds(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, Boolean async, Int32 timeout, Task& task, Boolean asyncWrite, Boolean inRetry, SqlDataReader ds, Boolean describeParameterEncryptionRequest)\r\n   at System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method, TaskCompletionSource`1 completion, Int32 timeout, Task& task, Boolean& usedCache, Boolean asyncWrite, Boolean inRetry)\r\n   at System.Data.SqlClient.SqlCommand.RunExecuteReader(CommandBehavior cmdBehavior, RunBehavior runBehavior, Boolean returnStream, String method)\r\n   at System.Data.SqlClient.SqlCommand.ExecuteReader(CommandBehavior behavior, String method)\r\n   at System.Data.Common.DbDataAdapter.FillInternal(DataSet dataset, DataTable[] datatables, Int32 startRecord, Int32 maxRecords, String srcTable, IDbCommand command, CommandBehavior behavior)\r\n   at System.Data.Common.DbDataAdapter.Fill(DataTable[] dataTables, Int32 startRecord, Int32 maxRecords, IDbCommand command, CommandBehavior behavior)\r\n   at System.Data.Common.DbDataAdapter.Fill(DataTable dataTable)\r\n   at eTimeMate.DatabaseGlobal.eTime_FillDataTable_Cloud(String cmdText, String FilterExpression, DataTable objDataTable, String AccountName) in E:\\MultiTable TimeTrax\\multiTableWeb\\multiTableWeb\\eTimeMate_Library\\eTimeMate_Library\\DatabaseGlobal.cs:line 1567\r\n   at eTimeMate_Library.Data_Access_Layler.EmployeeDAL.GetEmployeeTemplates_AllModel(String EmployeeCodeInDevice, String& BioIds, String& FPs, String& FPAlogVersions, String& FaceAlogVersions, String DeviceIds, String Delimiter, Boolean IsGetAllTemplate, String DeviceModel, String DeviceSeries) in E:\\MultiTable TimeTrax\\multiTableWeb\\multiTableWeb\\eTimeMate_Library\\eTimeMate_Library\\Data Access Layler\\EmployeeDAL.cs:line 8717\r\n   at eTimeMate_Library.Data_Access_Layler.DeviceManagementOperationDAL.UploadUsersToDeviceHysoon(Boolean IsUseFpDataCovDLL, String EmployeeCodeInDevice, String EmployeeName, String SerialNumber, String CardNumber, String BioPassword, String Privilege, String FromDate, String ToDate, String NSeriesDeviceIds, Boolean IsFaceChecked, Boolean IsFPChecked, Boolean IsCardChecked, Boolean IsBioPasswordChecked, Boolean UploadUserPhoto) in E:\\MultiTable TimeTrax\\multiTableWeb\\multiTableWeb\\eTimeMate_Library\\eTimeMate_Library\\Data Access Layler\\DeviceManagementOperationDAL.cs:line 2070\r\n   at eTimeMate_Library.Data_Access_Layler.DeviceManagementOperationDAL.UploadUsers(DeviceUploadDeleteOperation objDeviceUploadDeleteOperation) in E:\\MultiTable TimeTrax\\multiTableWeb\\multiTableWeb\\eTimeMate_Library\\eTimeMate_Library\\Data Access Layler\\DeviceManagementOperationDAL.cs:line 389\r\n   at WebApi1Controller.UploadUser(String APIKey, String EmployeeCode, String EmployeeName, String CardNumber, String SerialNumbers, String VerifyMode, Boolean IsFaceUpload, Boolean IsFPUpload, Boolean IsCardUpload, Boolean IsBioPasswordUpload)\r\n   at lambda_method(Closure , Object , Object[] )\r\n   at System.Web.Http.Controllers.ReflectedHttpActionDescriptor.ActionExecutor.<>c__DisplayClass13.<GetExecutor>b__c(Object instance, Object[] methodParameters)\r\n   at System.Threading.Tasks.TaskHelpers.RunSynchronously[TResult](Func`1 func, CancellationToken cancellationToken)"
}

*/