// Claves para el servicio de predicción
const PREDICTION_URL = "https://democlasificacionytraduccion.cognitiveservices.azure.com/customvision/v3.0/Prediction/9e9619cc-7f2b-4bca-9392-be426e317aae/classify/iterations/Modelo%20de%20clasificaci%C3%B3n/url"
const PREDICTION_KEY = "689e1582511d4a4e87021c582feac9d2";

const imagen1 = document.getElementById("urlImagen1");
const contenedor1 = document.getElementById("imagenContainer1");

const imagen2 = document.getElementById("urlImagen2");
const contenedor2 = document.getElementById("imagenContainer2");

const imagen3 = document.getElementById("urlImagen3");
const contenedor3 = document.getElementById("imagenContainer3");

const imagen4 = document.getElementById("urlImagen4");
const contenedor4 = document.getElementById("imagenContainer4");

const btn = document.querySelector('.div-boton');

let newImg1;
let newImg2;
let newImg3;
let newImg4;


// codigo para renderizar las imagenes en su respectivo contenedor
imagen1.addEventListener("input", () => {
    const imagen = imagen1.value;
    mostrarImagen(imagen, contenedor1);
});

imagen2.addEventListener("input", () => {
    const imagen = imagen2.value;
    mostrarImagen(imagen, contenedor2);
});

imagen3.addEventListener("input", () => {
    const imagen = imagen3.value;
    mostrarImagen(imagen, contenedor3);
});

imagen4.addEventListener("input", () => {
    const imagen = imagen4.value;
    mostrarImagen(imagen, contenedor4);
});

function mostrarImagen(imagenURL, contenedor) {
    const newImg = document.createElement("img");
    newImg.src = imagenURL;
    newImg.className = "img-fluid";

    contenedor.innerHTML = "";
    contenedor.appendChild(newImg);
}

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
            canvas.width = newImg1.width;
            canvas.height = newImg1.height;
            const context = canvas.getContext("2d");
            context.drawImage(newImg1, 0, 0);

            // Dibujar las coordenadas de detección en el canvas
            items.forEach((element) => {
                if (element.probability > 0.9) {
                    const nombre = element.tagName;
                    const probabilidad = element.probability;
                    const porcentaje = probabilidad * 100;

                    // Las coordenadas de detección generalmente se encuentran en element.boundingBox
                    const boundingBox = element.boundingBox;

                    const originalImgWidth = newImg1.naturalWidth;
                    const originalImgHeight = newImg1.naturalHeight;

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