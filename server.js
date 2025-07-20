const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan('dev'))

app.get("/formulario", (req, res) => {
    res.send('obteniendo formulario')
})

app.post("/formulario", (req, res) => {
    res.send('creando formulario')
})

app.put("/formulario", (req, res) => {
    res.send('actualizando formulario')
})

app.delete("/formulario", (req, res) => {
    res.send('borrando formulario')
})

app.get("/formulario/:id", (req, res) => {
    res.send('obteniendo un producto')
})

app.listen(3000);
console.log(`servidor en puerto ${3000}`);
