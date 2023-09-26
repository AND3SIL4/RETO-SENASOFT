// const axios = require("axios").default;

const URL_ENDPOINT_TRADUCCION = "https://api.cognitive.microsofttranslator.com/";
const KEY_ENPOINT_TRADUCCION = "689e1582511d4a4e87021c582feac9d2";
const LOCATION = "eastus";

const btn = document.getElementById("translateBtn");
const input = document.getElementById("inputText");
const output = document.getElementById("outputText");
const detect = document.getElementById("selecLanguage");
const muestra = document.getElementById("dropdownButton");
const listaIdiomas = document.querySelectorAll(".dropdown-menu li");

listaIdiomas.forEach(function (elemento) {
  elemento.addEventListener("click", function () {
    // Obtén el valor del elemento seleccionado
    var valorSeleccionado = elemento.getAttribute("value");

    // Actualiza el texto del botón con el valor seleccionado
    const inputW = valorSeleccionado;
    muestra.innerHTML = `${
      inputW == "es"
        ? "Español"
        : inputW === "en"
        ? "Ingles"
        : inputW === "fr"
        ? "Frances"
        : inputW === "pt"
        ? "Portugues"
        : "otro"
      }`;

    
    
    // funcion para traducir
    btn.addEventListener("click", (algo) => {
      algo.preventDefault();

      const words = input.value;

      axios({
        baseURL: URL_ENDPOINT_TRADUCCION,
        // usar 'detect', para solo detectar el idioma
        // usar '/dictionary/lookup', para traducciones alternativas
        url: "/translate",
        method: "post",
        headers: {
          "Ocp-Apim-Subscription-Key": KEY_ENPOINT_TRADUCCION,
          "Ocp-Apim-Subscription-Region": LOCATION,
          "Content-type": "application/json",
        },
        params: {
          "api-version": "3.0",
          //from: inputW, // no incluir para detectar idioma - entre mas cerca a 1 es su seguridad
          to: inputW, // quitar solo para la deteccion
          // 'toScript': 'latn', // para la transliteracion fonectica
          // 'includeSentenceLength': true
        },
        data: [
          {
            text: words,
          },
        ],
        responseType: "json",
      })
        .then(function (response) {
          const language = response.data[0].detectedLanguage.language;
          const content = response.data[0].translations[0].text;
          detect.innerHTML = `${
            language == "es"
              ? "Español"
              : language === "en"
              ? "Ingles"
              : language == "fr"
              ? "Frances"
              : language === "pt"
              ? "Portugues"
              : "otro"
          }`;
          output.innerHTML = content;
          // console.log(JSON.stringify(response.data, null, 4));
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
});