import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createDBConnection() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,    
      database: process.env.DB_DBNAME,
      port: process.env.DB_PORT,      
      connectionLimit: 10
    });

    console.log("DB Connected");
    return pool;
  } catch (error) {
    console.error("Error creating database connection:", error);
    throw error;
  }
}

const pool = await createDBConnection();
export default pool;
