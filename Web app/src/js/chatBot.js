document.addEventListener("DOMContentLoaded", () => {

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

// funcion para enviar el mensaje del usuario al servicio de Azure

function sendMessageToAzure(message) {
  // URL de predicción
  const predictionUrl="https://botsenasoft2023.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=botAndrea&api-version=2021-10-01&deploymentName=test";
  // la clave de suscripción
  const subscriptionKey="b7ce4d5c06b14f13b1d55a22e32133d9";

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
      const item = response.data.answers[0];
      const botResponse = item.answer;
      console.log(response);
      addMessage(botResponse, false); 

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
});
