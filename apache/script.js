document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const contactosContainer = document.createElement("div");
  contactosContainer.id = "contactosContainer";
  document.body.appendChild(contactosContainer);

  function cargarContactos() {
    fetch("http://localhost:3000/formulario")
      .then((res) => res.json())
      .then((contactos) => {
        contactosContainer.innerHTML = "<h3>Contactos</h3>";
        contactos.forEach((c) => {
          const div = document.createElement("div");
          div.className = "card mb-2 p-2";
          div.innerHTML = `
            <strong>${c.nombre}</strong> (${c.email})<br/>
            <span>${c.mensaje}</span><br/>
            <button class=\"btn btn-danger btn-sm me-2\" data-id=\"${c.id}\" data-action=\"delete\">Eliminar</button>
            <button class=\"btn btn-warning btn-sm me-2\" data-id=\"${c.id}\" data-action=\"edit\">Editar</button>
            <button class=\"btn btn-info btn-sm\" data-id=\"${c.id}\" data-action=\"patch\">Patch</button>
          `;
          contactosContainer.appendChild(div);
        });
      });
  }

  contactosContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      const id = e.target.getAttribute("data-id");
      const action = e.target.getAttribute("data-action");
      if (action === "delete") {
        fetch(`http://localhost:3000/formulario/${id}`, { method: "DELETE" })
          .then(() => cargarContactos());
      } else if (action === "edit") {
        // Mostrar formulario para editar y luego hacer PUT
        const nombre = prompt("Nuevo nombre:");
        const email = prompt("Nuevo email:");
        const mensaje = prompt("Nuevo mensaje:");
        fetch(`http://localhost:3000/formulario/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, mensaje })
        }).then(() => cargarContactos());
      } else if (action === "patch") {
        const mensaje = prompt("Nuevo mensaje:");
        fetch(`http://localhost:3000/formulario/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mensaje })
        }).then(() => cargarContactos());
      }
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
      nombre: document.getElementById("nombre").value,
      email: document.getElementById("email").value,
      mensaje: document.getElementById("mensaje").value,
    };
    fetch("http://localhost:3000/formulario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Datos enviados correctamente");
        form.reset();
        cargarContactos();
      })
      .catch((error) => {
        console.error("Error:" + error);
        alert("Error al enviar los datos");
      });
  });

  cargarContactos();
});
