// import axios from 'axios';

// Claves para el servicio de predicción
const PREDICTION_URL =
  "https://democlasificacionytraduccion.cognitiveservices.azure.com/customvision/v3.0/Prediction/9e9619cc-7f2b-4bca-9392-be426e317aae/classify/iterations/Modelo%20de%20clasificaci%C3%B3n/url";
const PREDICTION_KEY = "689e1582511d4a4e87021c582feac9d2";
const TRASLATOR_URL = 'https://api.cognitive.microsofttranslator.com/';
const LOCATION= "eastus";

const imagenContenedor = document.getElementById("contenedor-imagen");
const inputImagen = document.getElementById("input-imagen");
const btn = document.getElementById("button-classification");
const descriptionDiv = document.getElementById("description-image");
const listaIdiomas = document.querySelectorAll(".dropdown-menu li");
const muestra = document.getElementById("dropdownButton");

let newImg;

// evento para escuchar el input y mostrar la imagen en el contenedor
inputImagen.addEventListener("input", () => {
  const imagenURL = inputImagen.value;

  // Establecer la URL de la imagen como fondo del div
  imagenContenedor.style.backgroundImage = `url('${imagenURL}')`;
});

// Función para consumir la API
function consume(imagen) {
  const headers = {
    "Prediction-Key": PREDICTION_KEY,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({ url: imagen });

  descriptionDiv.innerHTML = "Analizando imagen...";

  axios
  .post(PREDICTION_URL, body, { headers })
  .then((response) => {
    const result = response.data;
    const items = result.predictions;
    let respuesta = `La imagen corresponde a ${items[0].tagName}`;
    descriptionDiv.innerHTML = respuesta;

    listaIdiomas.forEach(function (elemento) {
      elemento.addEventListener("click", function () {
        // Obtén el valor del elemento seleccionado
        var valorSeleccionado = elemento.getAttribute("value");
    
        // Actualiza el texto del botón con el valor seleccionado
        const codigoIso = valorSeleccionado;
        muestra.innerHTML = `${
          codigoIso == "es"
            ? "Español"
            : codigoIso === "en"
            ? "Ingles"
            : codigoIso === "fr"
            ? "Frances"
            : codigoIso === "pt"
            ? "Portugues"
            : "otro"
        }`;
        console.log(codigoIso);
      });
    });

      // Obtiene el valor seleccionado
      const codigoIso = muestra.getAttribute("data-value");
      console.log(respuesta);
      console.log(codigoIso);

      // Llama a la función de traducción con el valor seleccionado y la respuesta
      traducirResultado(codigoIso, respuesta);
    })
    .catch((error) => {
      console.error(error);
      alert(error);
    });
}

// Función para traducir el resultado
function traducirResultado(codigoIso, respuesta) {
  axios({
    baseURL: TRASLATOR_URL,
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": PREDICTION_KEY,
      "Ocp-Apim-Subscription-Region": LOCATION,
      "Content-type": "application/json",
    },
    params: {
      "api-version": "3.0",
      to: codigoIso,
    },
    data: [
      {
        text: respuesta,
      },
    ],
    responseType: "json",
  })
    .then(function (response) {
      const language = response.data[0].detectedLanguage.language;
      const content = response.data[0].translations[0].text;
      console.log(content);
    })
    .catch((err) => {
      alert(err);
      console.error(err);
    });
}

// Llamado a la funcion que hace la solicitud a las llaves del modelo de clasificacion
btn.addEventListener("click", () => {
  consume(inputImagen.value);
});