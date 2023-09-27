// Importar axios si no lo has hecho
// import axios from 'axios';

// Claves para el servicio de predicción
const PREDICTION_URL = "https://democlasificacionytraduccion.cognitiveservices.azure.com/customvision/v3.0/Prediction/9e9619cc-7f2b-4bca-9392-be426e317aae/classify/iterations/Modelo%20de%20clasificaci%C3%B3n/url"
const PREDICTION_KEY = "689e1582511d4a4e87021c582feac9d2";

const img = document.getElementById("urlImagen");
const btn = document.getElementById("boton");
const imagenContainer = document.getElementById("imagenContainer");
const title = document.getElementById("title");

let newImg; // Declarar la variable newImg en un alcance más amplio

img.addEventListener("input", () => {
    const imagen = img.value;

    // Crear elemento img
    newImg = document.createElement("img"); // Asignar a la variable newImg
    newImg.src = imagen;
    newImg.className = "img-fluid";

    // Limpiar contenido
    imagenContainer.innerHTML = "";
    imagenContainer.appendChild(newImg);
});

// Función para consumir la API
function consume(imagen) {
    const headers = {
        "Prediction-Key": PREDICTION_KEY,
        "Content-Type": "application/json",
    };

    const body = JSON.stringify({ url: imagen });

    console.log("Analizando imagen...");

    // Eliminar el canvas anterior antes de procesar la nueva imagen
    const existingCanvas = imagenContainer.querySelector("canvas");
    if (existingCanvas) {
        imagenContainer.removeChild(existingCanvas);
    }

    axios
        .post(PREDICTION_URL, body, { headers })
        .then((response) => {
            const result = response.data;
            const items = result.predictions;

            // Crear un canvas para mostrar las coordenadas de detección
            const canvas = document.createElement("canvas");
            canvas.width = newImg.width;
            canvas.height = newImg.height;
            const context = canvas.getContext("2d");
            context.drawImage(newImg, 0, 0);

            // Dibujar las coordenadas de detección en el canvas
            items.forEach((element) => {
                if (element.probability > 0.9) {
                    const nombre = element.tagName;
                    const probabilidad = element.probability;
                    const porcentaje = probabilidad * 100;

                    // Las coordenadas de detección generalmente se encuentran en element.boundingBox
                    const boundingBox = element.boundingBox;

                    const originalImgWidth = newImg.naturalWidth;
                    const originalImgHeight = newImg.naturalHeight;

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
            imagenContainer.innerHTML = '';
            imagenContainer.appendChild(canvas);
        })
        .catch((error) => {
            console.error(error);
        });
}

btn.addEventListener("click", () => {
    consume(img.value);
});