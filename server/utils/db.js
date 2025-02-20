// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// async function createDBConnection() {
//   try {
//     const pool = mysql.createPool({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,    
//       database: process.env.DB_DBNAME,
//       port: process.env.DB_PORT,      
//       connectionLimit: 10
//     });

//     console.log("DB Connected");
//     return pool;
//   } catch (error) {
//     console.error("Error creating database connection:", error);
//     throw error;
//   }
// }

// const pool = await createDBConnection();
// export default pool;

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  port: process.env.DB_PORT || 3306, // Default MySQL Port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database Connected Successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
  }
}

testDBConnection();

export default pool;
