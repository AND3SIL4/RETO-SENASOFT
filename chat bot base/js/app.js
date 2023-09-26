document.addEventListener("DOMContentLoaded", function() {
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

sendButton.addEventListener("click", function() {
    const userMessage = userInput.value;
    appendMessage("user", userMessage);

    // Simulamos la respuesta del servidor después de un tiempo
    setTimeout(function() {
        const serverResponse = "¡Hola! Soy el chatbot. ¿En qué puedo ayudarte?";
        appendMessage("bot", serverResponse);
    }, 1000);

    userInput.value = ""; // Limpiar el input
});

function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerText = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
});
