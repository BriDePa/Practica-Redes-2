const { Pool } = require("pg");

const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "contactos_db",
  password: "1201",
  port: 5432,
});

async function test() {
  try {
    const contactos = await pool.query("SELECT * FROM contactos");
    console.log("datos:", JSON.stringify(contactos.rows));
  } catch (error) {
    console.log("error de conexion: " + error);
  } finally {
    await pool.end();
  }
}

test();
