const express = require("express");
const morgan = require("morgan");
const { Pool } = require("pg");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "contactos",
  password: "password",
  port: 5432,
});

async function crearTabla() {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXIST contactos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR (100) NOT NULL,
                mensaje TEXT NOT NULL,
                creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            `);
    console.log("Tabla creada o existente");
  } catch (err) {
    console.log("error de creacion: " + err);
  }
}

app.get("/formulario", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM contactos ORDER BY creacion DESC"
    );
    res.status(200).json(resultado.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json("error del servidor");
  }
});

app.post("/formulario", async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    const resultado = await pool.query(
      "INSERT INTO contactos (nombre, email, mensaje) VALUES ($1, $2, $3) RETURNING *",
      [nombre, email, mensaje]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json("error del servidor");
  }
});

app.put("/formulario", (req, res) => {
  res.send("metodo put");
});

app.delete("/formulario", (req, res) => {
  res.send("metodo delete");
});

app.patch("/formulario", (req, res) => {
  res.send("metodo patch");
});

/* app.get("/about", (req, res) => {
  const titulo = "pagina con express";
  res.render("index.ejs", { titulo: titulo });
}); */

/* app.get("/formulario/:id", (req, res) => {
  console.log(req.params.id);
  const formEncontrado = forms.find((form) => form.id == req.params.id);

  if (!formEncontrado)
    return res.status(404).json({
      mensaje: "no encontrado",
    });
  console.log(formEncontrado);

  res.json(formEncontrado);
}); */

app.listen(3000);
console.log(`servidor en puerto ${3000}`);
