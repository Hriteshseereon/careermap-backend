import mysql from "mysql2/promise";

export const mysqlConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Hriteshseereon98",
  database: "careermapbackupdb",
  waitForConnections: true,
  connectionLimit: 10,
});

