const express = require("express");
const morgan = require("morgan");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "root",
  host: "localhost", //db para ponerlo en un contenedor
  database: "contactos_db",
  password: "1201",
  port: 5432,

});

app.get("/formulario", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM contactos ORDER BY created_at DESC"
    );
    res.status(200).json(resultado.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json("error del servidor" + err);
  }
});

app.post("/formulario", async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    const result = await pool.query(
      "INSERT INTO contactos (nombre, email, mensaje) VALUES ($1, $2, $3) RETURNING *",
      [nombre, email, mensaje]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.put("/formulario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, mensaje } = req.body;

    const resultado = await pool.query(
      "UPDATE contactos SET nombre = $1, email = $2, mensaje = $3 WHERE id = $4 RETURNING *",
      [nombre, email, mensaje, id]
    );
  } catch (error) {
    console.log(error);
    res.status(500).json("Error del servidor");
  }
});

app.patch("/formulario/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const nuevosDatos = req.body;

    const query = `
    UPDATE contactos
    SET nombre = $1, email = $2
    WHERE id = $3`;

    const valores = [nuevosDatos.nombre, nuevosDatos.email, id];

    const resultado = await pool.query(query, valores);

    res.json(resultado.rows[0])
  } catch (error) {
    console.log("error al actualizar: " + error);
    res.status(500).send("Error")
    
  }
});

app.delete("/formulario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query("DELETE FROM contactos WHERE id = $1", [
      id,
    ]);
    res.status(200).json("eliminado");
  } catch (error) {
    console.log(error);
    res.status(500).send("error del servidor");
  }
});

app.listen(3000);
console.log(`servidor en puerto ${3000}`);
