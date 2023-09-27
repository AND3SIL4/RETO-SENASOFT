// import axios from 'axios';

// Claves para el servicio de predicción
const PREDICTION_URL =
    "https://democlasificacionytraduccion.cognitiveservices.azure.com/customvision/v3.0/Prediction/9e9619cc-7f2b-4bca-9392-be426e317aae/classify/iterations/Modelo%20de%20clasificaci%C3%B3n/url";
const PREDICTION_KEY = "689e1582511d4a4e87021c582feac9d2";
const TRASLATOR_URL = 'https://api.cognitive.microsofttranslator.com/';
const LOCATION = "eastus";

const imagenContenedor = document.getElementById("contenedor-imagen");
const inputImagen = document.getElementById("input-imagen");
const btn = document.getElementById("button-classification");
const descriptionDiv = document.getElementById("description-image");
const listaIdiomas = document.querySelectorAll(".dropdown-menu li");
const muestra = document.getElementById("dropdownButton");
const loadFile = document.getElementById('load-file');

let newImg;

// evento para escuchar el input y mostrar la imagen en el contenedor
inputImagen.addEventListener("input", () => {
    const imagenURL = inputImagen.value;

    // Establecer la URL de la imagen como fondo del div
    imagenContenedor.style.backgroundImage = `url('${imagenURL}')`;
});

// Función para consumir la API utilizando un archivo local
function consumeAPIwithLocalFile(file) {

    const headers = {
        "Prediction-Key": PREDICTION_KEY,
        "Content-Type": "application/octet-stream", // Cambiar el tipo de medio a "multipart/form-data"
    };

    descriptionDiv.innerHTML = "Analizando imagen...";

    axios
        .post(PREDICTION_URL, file, { headers })
        .then((response) => {
            const result = response.data;
            const items = result.predictions;
            let respuesta = `La imagen corresponde a ${items[0].tagName}`;
            descriptionDiv.innerHTML = respuesta;
        })
        .catch((error) => {
            console.error(error);
        });
}


// evento que renderiza la carga de imágenes locales
loadFile.addEventListener('change', function () {
    const file = loadFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageDataLocal = e.target.result;
            console.log(imageDataLocal);
            imagenContenedor.style.backgroundImage = `url(${imageDataLocal})`;
        };
        reader.readAsDataURL(file);
    }
});



// Función para consumir la API utilizando entrada de una url
function consumeAPIWithUrl(imageFromTUrl) {
    const headers = {
        "Prediction-Key": PREDICTION_KEY,
        "Content-Type": "application/json",
    };

    const body = JSON.stringify({ url: imageFromTUrl });

    descriptionDiv.innerHTML = "Analizando imagen...";

    axios
        .post(PREDICTION_URL, body, { headers })
        .then((response) => {
            const result = response.data;
            const items = result.predictions;
            let respuesta = `La imagen corresponde a ${items[0].tagName}`;
            descriptionDiv.innerHTML = respuesta;
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        });
}

// Llamado a la función que hace la solicitud a las llaves del modelo de clasificación
btn.addEventListener("click", () => {
    
    // logica para imagenes ingresadas desde url
    const file = loadFile.files[0];
    consumeAPIWithUrl(inputImagen.value); // funcion para hacer llamado con entrada de url
    // consumeAPIwithLocalFile(file); // funcion para hacer llamada con entrada de archivos locales
});

