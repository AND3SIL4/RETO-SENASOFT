// Claves para el servicio de predicción
const PREDICTION_URL =
  "https://democlasificacionytraduccion.cognitiveservices.azure.com/customvision/v3.0/Prediction/bab26199-b40b-44f9-bb64-44c9bd4d3daa/classify/iterations/proyectoClasificacionV2/url";
const PREDICTION_KEY = "689e1582511d4a4e87021c582feac9d2";
const TRASLATOR_URL = "https://api.cognitive.microsofttranslator.com/";
const LOCATION = "eastus";

const imagenContenedor = document.getElementById("contenedor-imagen");
const inputImagen = document.getElementById("input-imagen");
const btn = document.getElementById("button-classification");
const descriptionDiv = document.getElementById("description-image");
const listaIdiomas = document.querySelectorAll(".dropdown-menu li");
const loadFile = document.getElementById("load-file");
const botonSelectLanguge = document.getElementById("selecLanguage");

// Declarar las variables globales
let respuesta;
let languageValue = "es";

// evento para escuchar el input y mostrar la imagen en el contenedor
inputImagen.addEventListener("input", () => {
  const imagenURL = inputImagen.value;

  // Establecer la URL de la imagen como fondo del div
  imagenContenedor.style.backgroundImage = `url('${imagenURL}')`;
});

/**
 *
 * @param {TODO: validacion de achivo para poder hacer el llamado cargando archvios locales} file
 */
// Función para consumir la API utilizando un archivo local
function consumeAPIwithLocalFile(file) {
  return new Promise((resolve, reject) => {
    const headers = {
      "Prediction-Key": PREDICTION_KEY,
      "Content-Type": "application/octet-stream",
    };

    descriptionDiv.innerHTML = "Analizando imagen...";

    axios
      .post(PREDICTION_URL, file, { headers })
      .then((response) => {
        const result = response.data;
        const items = result.predictions;
        respuesta = `La imagen corresponde a ${items[0].tagName}`;
        resolve(); // Resolvemos la promesa una vez que tengamos la respuesta
      })
      .catch((error) => {
        console.error(error);
        reject(error); // Rechazamos la promesa en caso de error
      });
  });
}

// evento que renderiza la carga de imágenes locales
loadFile.addEventListener("change", function () {
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
  return new Promise((resolve, reject) => {
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
        respuesta = `La imagen corresponde a ${items[0].tagName}`;
        resolve(); // Resolvemos la promesa una vez que tengamos la respuesta
      })
      .catch((error) => {
        console.error(error);
        descriptionDiv.innerHTML =
          "Error al analizar la imagen por favor intente de nuevo";
        alert(`Un error ha ocurrido por favor intente de nuevo`);
        reject(error); // Rechazamos la promesa en caso de error
      });
  });
}

// Función para obtener el código ISO de los lenguajes seleccionados
function seleccionarIdioma(elemento) {
  return new Promise((resolve, reject) => {
    // Obtén el valor del elemento seleccionado
    var valorSeleccionado = elemento.getAttribute("value");

    // Actualiza el texto del botón con el valor seleccionado
    languageValue = valorSeleccionado;
    botonSelectLanguge.innerHTML = `${languageValue == "es"
      ? "Español"
      : languageValue === "en"
        ? "Inglés"
        : languageValue === "fr"
          ? "Francés"
          : languageValue === "pt"
            ? "Portugués"
            : languageValue === "de"
              ? "Aleman"
              : "No encontrado"
      }`;

    // Resuelve la promesa con el valor del idioma seleccionado
    resolve(languageValue);
  });
}

// Asignar el evento a cada elemento de la lista de idiomas
listaIdiomas.forEach(function (elemento) {
  elemento.addEventListener("click", () => {
    // Llamar a la función para seleccionar el idioma y esperar a que se resuelva la promesa
    seleccionarIdioma(elemento)
      .then((selectedLanguage) => {
        // llamar a la función hacerTraduccion con el idioma seleccionado
        hacerTraduccion(respuesta, selectedLanguage);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

// funcion para obtener la traduccion del contenido
function hacerTraduccion(textoATraducir, idiomaSeleccionado) {
  axios({
    baseURL: TRASLATOR_URL,
    // usar 'detect', para solo detectar el idioma
    // usar '/dictionary/lookup', para traducciones alternativas
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": PREDICTION_KEY,
      "Ocp-Apim-Subscription-Region": LOCATION,
      "Content-type": "application/json",
    },
    params: {
      "api-version": "3.0",
      //from: inputW, // no incluir para detectar idioma - entre mas cerca a 1 es su seguridad
      to: idiomaSeleccionado, // quitar solo para la deteccion
      // 'toScript': 'latn', // para la transliteracion fonectica
      // 'includeSentenceLength': true
    },
    data: [
      {
        text: textoATraducir,
      },
    ],
    responseType: "json",
  })
    .then(function (response) {
      let traduccion = response.data[0].translations[0].text;
      descriptionDiv.innerHTML = traduccion;

      if (!traduccion) {
        const audio = `<speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' xml:gender='Female' name='en-US-AriaNeural'>
        ${traduccion}</voice></speak>`;

        const headers = {
          "Ocp-Apim-Subscription-Key": PREDICTION_KEY,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3"
        };

        const outputFile = "salida.wav";

        fetch(
          `https://${LOCATION}.tts.speech.microsoft.com/cognitiveservices/v1`,
          {
            method: "POST",
            headers: headers,
            body: audio,
            Outfile: outputFile
          }
        )
      }
      // console.log(JSON.stringify(response.data, null, 4));
    })
    .catch((err) => {
      console.error(err);
    });
}

// Llamado a la función que hace la solicitud a las llaves del modelo de clasificación
btn.addEventListener("click", async () => {
  // logica para imagenes ingresadas desde url
  const file = loadFile.files[0]; // para cargar archivos locales

  try {
    // Llamar a las funciones utilizando async/await
    await consumeAPIWithUrl(inputImagen.value); // funcion para hacer llamado con entrada de url

    // Llamar a la funcion para hacer la traduccion del contenido dado por el modelo de clasificacion
    hacerTraduccion(respuesta, languageValue);
  } catch (error) {
    console.error(error);
  }
});












const archivo = document.getElementById('input-file');
const bton = document.getElementById('enviar-btn');

// Agrega un evento 'click' al botón
bton.addEventListener('click', (event) => {
  event.preventDefault(); // Previene la acción por defecto del botón

  // Crea un nuevo objeto FormData y agrega el archivo
  let formData = new FormData();
  formData.append('archivo', archivo.files[0]);

  const headers = {
    "Prediction-Key": "689e1582511d4a4e87021c582feac9d2",
    "Content-Type": "application/octet-stream",
  };

  // Haz una petición axios para enviar los datos del formulario a la API
  axios.post('https://democlasificacionytraduccion.cognitiveservices.azure.com/customvision/v3.0/Prediction/bab26199-b40b-44f9-bb64-44c9bd4d3daa/classify/iterations/proyectoClasificacionV2/image', formData, { headers })
    .then(function (response) {
      // Maneja la respuesta de la API
      console.log(response.data);
    })
    .catch(function (error) {
      // Maneja cualquier error que ocurra
      console.error(error);
    });
});




