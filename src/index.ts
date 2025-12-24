import { pool } from "./config/database";
import { index_cron_job_function } from "./cron_job/index.cron";
import { Attendance_Service } from "./module/attendance/service/attendance.service";
import { Device_Model } from "./module/device/model/device.model";
import { Employee_Service } from "./module/employee/service/employee.service";

const start = async () => {

  if (!process.env.TZ) {
    throw new Error("Timezone must be defined!");
  }

  if (
    !process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME ||
    !process.env.DB_MAX_POOL
  ) {
    throw new Error("Databse configuration must be defined!");
  }

  if (!process.env.TYPE) {
    throw new Error("Type must be defined!");
  }

  console.log(
    `Type is ${process.env.TYPE} \n`,
  )


  //test the cron job function
  index_cron_job_function(false);

};

start();
