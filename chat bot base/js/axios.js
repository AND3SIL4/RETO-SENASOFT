// const axios = require('axios');

const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

// funcion para agregar mensaje al contenedor del chat
function addMessage(message, isUser) {
  const messageDiv = document.createElement("div");
  messageDiv.className = isUser ? "user-message" : "bot-message";
  messageDiv.textContent = message;
  chatContainer.appendChild(messageDiv);
}
function addtarjet(prompt, isUser){
  const card = document.createElement("div");
  card.className = isUser ? "user-message" : "bot-message";
  card.textContent = prompt;
  card.addEventListener(share);
  chatContainer.appendChild(card);
  function share(){
    
  }
  
}

// funcion para enviar el mensaje del usuario al servicio de Azure

function sendMessageToAzure(message) {
  // URL de predicción
  const predictionUrl="https://aaegr.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=CFGB&api-version=2021-10-01&deploymentName=test";
  // la clave de suscripción
  const subscriptionKey="8626c83340f24768bee973751c0e6ca5";

  // Datos ficticios para la predicción
  const inputData = {
    top: 3,
    question: message,
    includeUnstructuredSources: true,
    confidenceScoreThreshold: "0.7",
    answerSpanRequest: {
      enable: true,
      topAnswersWithSpan: 1,
      confidenceScoreThreshold: "0.6",
    },
    filters: {
      metadataFilter: {
        logicalOperation: "OR",
        metadata: [
          //! no incluir metadatos
          // {
          //   key: 'category',
          //   value: 'technology',
          // },
          // {
          //   key: 'language',
          //   value: 'es',
          // },
        ],
      },
    },
  };

  // solicitud HTTP
  const config = {
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Content-Type": "application/json",
    },
  };

  // solicitud POST a la URL de predicción
  axios
    .post(predictionUrl, inputData, config)
    .then((response) => {
      // respuesta de la predicción
      console.log(response)
      const botResponse = response.data.answers[0].answer;
      const cardResponse = response.data.answers[0].dialog.prompt;
      addMessage(botResponse, false); 
      for(i in cardResponse){
        const card = response.data.answers[0].dialog.prompt[i].displayText
        addtarjet(card, false);
      }
    
    })
    .catch((error) => {
      // manejo de errores
      console.error("Error al realizar la predicción:", error);
    });
}

// boton enviar
sendButton.addEventListener("click", () => {
  const userMessage = userInput.value;
  if (userMessage.trim() === "") return;
  addMessage(userMessage, true);
  userInput.value = "";
  sendMessageToAzure(userMessage);
});

// presionar ENTER
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendButton.click();
  }
});
