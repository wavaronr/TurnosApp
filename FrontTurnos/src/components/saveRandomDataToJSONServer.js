import getRandomProfile from "./getRandomProfile";

async function saveRandomDataToJSONServer() {
  /*
  try {
    // Realizar una solicitud GET previa para verificar si los datos ya existen
    const response = await fetch(`http://localhost:3004/posts/randomProfiles`);
    const existingData = await response.json();
    console.log(Object.keys(existingData).length === 1)
    // Si los datos ya existen, no es necesario hacer otra solicitud PUT
    if (Object.keys(existingData).length === 1) {
      console.log("Los datos ya existen en json-server. No se realizará otra solicitud PUT.");
      // return;
    }

    // Si los datos no existen, proceder con la solicitud PUT
    else{const jsonData = JSON.stringify(await getRandomProfile());

    await fetch(`http://localhost:3004/posts/randomProfiles`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    });

    console.log("Datos guardados en json-server correctamente.");
  }
  } catch (error) {
    console.error("Error al generar y guardar los datos:", error);
  }
  */
}

// Llamar a la función para guardar los datos
export default saveRandomDataToJSONServer;
