// Importar axios si no lo has hecho
// import axios from 'axios';

// Claves para el servicio de predicción
const PREDICTION_URL = "https://democlasificacionytraduccion.cognitiveservices.azure.com/customvision/v3.0/Prediction/d85a36b3-496f-4041-a115-8223ec0b4452/detect/iterations/modelo%20de%20detecci%C3%B3n%20de%20objetos/url"
const PREDICTION_KEY = "689e1582511d4a4e87021c582feac9d2";

// captura de imagen perro
const imgPerro = document.getElementById("imagen-perro");
const contenedorPerro = document.getElementById("contenedor-perro");

// captura de imagen pato
const imgPato = document.getElementById('imagen-pato');
const contendorPato = document.getElementById('contendor-pato');

// captura de imagen persona
const imgPerson = document.getElementById('imagen-persona');
const contendorPersona = document.getElementById('contenedor-persona');

// captura de imagen general
const imgGeneral = document.getElementById('imagen-general');
const contenedorGeneral = document.getElementById('contenedor-general');

const btn = document.getElementById("boton");
const title = document.getElementById("title");

let newDogImg; 
let newDuckImg;
let newPersonImg;
let newGeneralImg;

// evento que renderiza la imgen del perro
imgPerro.addEventListener("input", () => {
  const imagen = imgPerro.value;

  // Crear elemento img
  newDogImg = document.createElement("img"); // Asignar a la variable newDogImg
  newDogImg.src = imagen;
  newDogImg.className = "img-fluid";

  // Limpiar contenido
  contenedorPerro.innerHTML = "";
  contenedorPerro.appendChild(newDogImg);
});

// evento que renderiza la imagen pato
imgPato.addEventListener("input", () => {
  const imagen = imgPato.value;

  // Crear elemento img
  newDuckImg = document.createElement("img"); // Asignar a la variable newDogImg
  newDuckImg.src = imagen;
  newDuckImg.className = "img-fluid";

  // Limpiar contenido
  contendorPato.innerHTML = "";
  contendorPato.appendChild(newDuckImg);
});

// evento que renderiza la imagen persona
imgPerson.addEventListener("input", () => {
  const imagen = imgPerson.value;

  // Crear elemento img
  newPersonImg = document.createElement("img"); // Asignar a la variable newDogImg
  newPersonImg.src = imagen;
  newPersonImg.className = "img-fluid";

  // Limpiar contenido
  contendorPersona.innerHTML = "";
  contendorPersona.appendChild(newPersonImg);
});

// evento que renderiza la imagen general
imgGeneral.addEventListener("input", () => {
  const imagen = imgGeneral.value;

  // Crear elemento img
  newGeneralImg = document.createElement("img"); // Asignar a la variable newDogImg
  newGeneralImg.src = imagen;
  newGeneralImg.className = "img-fluid";

  // Limpiar contenido
  contenedorGeneral.innerHTML = "";
  contenedorGeneral.appendChild(newGeneralImg);
});


// Función para consumir la API se le pasan 3 parametros (url de imagen, variable imagen, contenedor)
async function consume(imagen, newImage, contendor) {
  const headers = {
    "Prediction-Key": PREDICTION_KEY,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({ url: imagen });

  console.log("Analizando imagen...");

  // Eliminar el canvas anterior antes de procesar la nueva imagen
  const existingCanvas = contendor.querySelector("canvas");
  if (existingCanvas) {
    contendor.removeChild(existingCanvas);
  }

  axios
    .post(PREDICTION_URL, body, { headers })
    .then((response) => {
      const result = response.data;
      const items = result.predictions;

      // Crear un canvas para mostrar las coordenadas de detección
      const canvas = document.createElement("canvas");
      canvas.width = newImage.width;
      canvas.height = newImage.height;
      const context = canvas.getContext("2d");
      context.drawImage(newImage, 0, 0);

      // Dibujar las coordenadas de detección en el canvas
      items.forEach((element) => {
        if (element.probability > 0.9) {
          const nombre = element.tagName;
          const probabilidad = element.probability;
          const porcentaje = probabilidad * 100;

          // Las coordenadas de detección generalmente se encuentran en element.boundingBox
          const boundingBox = element.boundingBox;

          const originalImgWidth = newImage.naturalWidth;
          const originalImgHeight = newImage.naturalHeight;

          context.rect(
            boundingBox.left * originalImgWidth,
            boundingBox.top * originalImgHeight,
            boundingBox.width * originalImgWidth,
            boundingBox.height * originalImgHeight
          );
          context.lineWidth = 2;
          context.strokeStyle = "red";
          context.fillStyle = "red";
          context.stroke();

          context.fillStyle = "red"; // Color y opacidad del fondo
          context.fillRect(
            boundingBox.left * originalImgWidth,
            boundingBox.top * originalImgHeight - 20, // Ajustar la posición vertical del fondo
            context.measureText(nombre).width + 65, // Ancho del fondo (basado en el texto)
            20 // Altura del fondo
          );

          // Agregar etiqueta al cuadro de detección
          context.font = "16px Arial";
          context.fillStyle = "white";
          context.fillText(
            nombre,
            boundingBox.left * originalImgWidth,
            boundingBox.top * originalImgHeight + -5
          );

          // Agregar otro comentario aquí
          // Puedes personalizar el estilo del texto y su posición
          context.font = "16px Arial";
          context.fillStyle = "white";
          context.fillText(
            porcentaje.toFixed(0) + '%',
            boundingBox.left * originalImgWidth + 52,
            boundingBox.top * originalImgHeight - 5
          );
          console.log("Prediccion realizada con exito...");
        }
      });

      // Limpiar el contenido anterior y agregar la nueva imagen con las coordenadas de detección
      contendor.innerHTML = '';
      contendor.appendChild(canvas);
    })
    .catch((error) => {
      console.error(error);
    });
}

btn.addEventListener("click", async() => {
  // funcion para la imagen de perro
  await consume(imgPerro.value, newDogImg, contenedorPerro); 

  // funcion para la imagen de pato
  await consume(imgPato.value, newDuckImg, contendorPato);

  // funcion para la imagen de persona
  await consume(imgPerson.value, newPersonImg, contendorPersona);

  // funcion para la imagen general
  await consume(imgGeneral.value, newGeneralImg, contenedorGeneral)
});