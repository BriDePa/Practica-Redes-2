document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    mensaje: document.getElementById("mensaje").value,
  };

  fetch("http://localhost:3000/formulario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Datos enviados correctamente");
      document.getElementById("contactForm").reset();
    })
    .catch((error) => {
      console.log("Error: " + error);
      alert("Error al enviar los datos");
    });
});
