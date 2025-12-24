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
exports.index_cron_job_function = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const attendance_service_1 = require("../module/attendance/service/attendance.service");
const device_service_1 = require("../module/device/service/device.service");
const employee_service_1 = require("../module/employee/service/employee.service");
const location_service_1 = require("../module/location/service/location.service");
const index_cron_job_function = (is_initial_load_required) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${new Date().toISOString()} Cron job started\n\n`);
    yield location_service_1.Location_Service.import_location_to_biomax_from_erpnext();
    yield location_service_1.Location_Service.update_location_data_in_biomax_from_erpnext();
    yield device_service_1.Device_Service.import_device_to_erpnext_from_biomax();
    yield device_service_1.Device_Service.update_device_in_erpnext();
    yield employee_service_1.Employee_Service.import_employee_to_biomax_from_erpnext_via_biomax_api();
    yield employee_service_1.Employee_Service.remove_employee_from_devices();
    yield employee_service_1.Employee_Service.remove_employee_from_devices_with_status_left_or_inactive();
    yield employee_service_1.Employee_Service.add_employee_to_devices();
    yield attendance_service_1.Attendance_Service.import_attendance_to_erpnext_from_biomax();
    console.log(`${new Date().toISOString()} Cron job ended\n\n`);
    node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`${new Date().toISOString()} Cron job started\n\n`);
        yield location_service_1.Location_Service.import_location_to_biomax_from_erpnext();
        yield location_service_1.Location_Service.update_location_data_in_biomax_from_erpnext();
        yield device_service_1.Device_Service.import_device_to_erpnext_from_biomax();
        yield device_service_1.Device_Service.update_device_in_erpnext();
        yield employee_service_1.Employee_Service.import_employee_to_biomax_from_erpnext_via_biomax_api();
        yield employee_service_1.Employee_Service.remove_employee_from_devices();
        yield employee_service_1.Employee_Service.remove_employee_from_devices_with_status_left_or_inactive();
        yield employee_service_1.Employee_Service.add_employee_to_devices();
        yield attendance_service_1.Attendance_Service.import_attendance_to_erpnext_from_biomax();
        console.log(`${new Date().toISOString()} Cron job ended\n\n`);
    }));
});
exports.index_cron_job_function = index_cron_job_function;
