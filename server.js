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
  host: "db",
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
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      return res
        .status(400)
        .json({ error: "No se proporcionaron campos para actualizar" });
    }

    let query = "UPDATE contactos SET ";
    const values = [];
    let paramIndex = 1;
    const updates = [];

    for (const [key, value] of Object.entries(fields)) {
      updates.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    query += updates.join(", ") + ` WHERE id = $${paramIndex} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE - Eliminar un contacto
app.delete("/formulario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM contactos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }

    res.status(200).json({ message: "Contacto eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(3000);
console.log(`servidor en puerto ${3000}`);
