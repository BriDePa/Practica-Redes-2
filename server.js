const express = require("express");
const morgan = require("morgan");
const path = require("path");
require("ejs");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "static"));

app.get("/formulario", (req, res) => {
    res.send("metodo get")
})

app.post("/formulario", (req, res) => {
    res.send("metodo post")
})

app.put("/formulario", (req, res) => {
    res.send("metodo put")
})

app.delete("/formulario", (req, res) => {
    res.send("metodo delete")
})

app.patch("/formulario", (req, res) => {
    res.send("metodo patch")
})

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
