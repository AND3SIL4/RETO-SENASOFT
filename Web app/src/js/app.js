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

const archivo = document.getElementById("input-file");

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
    // Crea un nuevo objeto FormData y agrega el archivo
    let formData = new FormData();
    formData.append("archivo", file.files[0]);

    const headers = {
      "Prediction-Key": PREDICTION_KEY,
      "Content-Type": "application/octet-stream",
    };

    descriptionDiv.innerHTML = "Analizando imagen...";

    // Haz una petición axios para enviar los datos del formulario a la API
    axios
      .post(
        "https://democlasificacionytraduccion.cognitiveservices.azure.com/customvision/v3.0/Prediction/bab26199-b40b-44f9-bb64-44c9bd4d3daa/classify/iterations/proyectoClasificacionV2/image",
        formData,
        { headers }
      )
      .then(function (response) {
        // Maneja la respuesta de la API
        const result = response.data;
        const items = result.predictions;
        respuesta = `La imagen corresponde a ${items[0].tagName}`;
        descriptionDiv.innerHTML = respuesta;
        resolve(); // Resolvemos la promesa una vez que tengamos la respuesta
      })
      .catch(function (error) {
        // Maneja cualquier error que ocurra
        console.error(error);
        descriptionDiv.innerHTML =
          "Error al analizar la imagen por favor intente de nuevo";
        alert(`Un error ha ocurrido por favor intente de nuevo`);
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
    botonSelectLanguge.innerHTML = `${
      languageValue == "es"
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
async function hacerTraduccion(textoATraducir, idiomaSeleccionado) {
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
      const traduccion = response.data[0].translations[0].text;
      descriptionDiv.innerHTML = traduccion;

      const key_Speech = "41ec7dc0100d4a8bbb87adbf3e2cad0d";
      const location_Speech = "eastus";

      const headers = new Headers();
      headers.append("Ocp-Apim-Subscription-Key", PREDICTION_URL);
      headers.append( "Content-Type","application/ssml+xml" );
      axios
        .post(
          `https://${LOCATION}.tts.speech.microsoft.com/cognitiveservices/v1`,
          {
            headers: headers,
            body: `<speak version="1.0" xml:lang="es-CO"><voice xml:lang="es-CO" xml:gender="Female" name="es-CO-SalomeNeural">${traduccion}</voice></speak>`,
          }
        )
        .then((response) => {
          const blob = new Blob([response.data], { type: "audio/mpeg" });
          if (blob instanceof Blob) {
            console.log("Sí es un Blob");
          } else {
            console.log("No es un Blob");
          }
          const audioElement = new Audio(blob);
          audioElement.play();
        });

      // console.log(JSON.stringify(response.data, null, 4));
    })
    .catch((err) => {
      console.error(err);
    });
}

// Llamado a la función que hace la solicitud a las llaves del modelo de clasificación
btn.addEventListener("click", async () => {
  try {
    if (loadFile.files.length === 0 && inputImagen.value === "") {
      alert("No ha seleccionado ninguna imagen...");
    }
    if (inputImagen.value === "") {
      await consumeAPIwithLocalFile(loadFile);
      await hacerTraduccion(respuesta, languageValue);
      console.log("carga de archivos desde directorio local");
      loadFile.value = "";
    } else {
      await consumeAPIWithUrl(inputImagen.value);
      await hacerTraduccion(respuesta, languageValue);
      console.log("carga de archivo desde url");
      inputImagen.value = "";
    }
  } catch (error) {
    alert("Error al cargar los archivos, por favor seleccione solo uno...");
    console.error(error);
  }
});
