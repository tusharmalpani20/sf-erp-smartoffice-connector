import sql from "mssql";

//GRANT SELECT, INSERT, UPDATE, DELETE ON DATABASE::[SmartOfficedb-restore] TO node_cron_user;


// Configuration object
const config = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};


export const pool = sql.connect(config);



