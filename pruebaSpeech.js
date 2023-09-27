const { AudioConfig, SpeechSynthesizer, SpeechConfig, CancellationReason, ResultReason } = require("microsoft-cognitiveservices-speech-sdk");

// Datos de autenticación
const subscriptionKey = "689e1582511d4a4e87021c582feac9d2";
const serviceRegion = "eastus";

// Configuración de reconocimiento de voz
const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
speechConfig.speechSynthesisVoiceName = "es-CO-SalomeNeural";

// Texto que se va a sintetizar
const text = "Hola, soy Salomé";

// Configuración de salida de audio
const audioConfig = AudioConfig.fromDefaultSpeakerOutput();

// Sintetizar el texto
const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

synthesizer.speakTextAsync(
    text,
    (result) => {
        if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            console.log(`Texto sintetizado: [${text}]`);
        } else if (result.reason === ResultReason.Canceled) {
            const cancellation = CancellationDetails.fromResult(result);
            console.log(`CANCELADO: Razón=${cancellation.reason}`);
            if (cancellation.reason === CancellationReason.Error) {
                console.log(`CANCELADO: Código de Error=${cancellation.errorCode}`);
                console.log(`CANCELADO: Detalles del Error=[${cancellation.errorDetails}]`);
                console.log(`CANCELADO: ¿Has actualizado la información de la suscripción?`);
            }
        }
        synthesizer.close();
    },
    (error) => {
        console.error(`Error al sintetizar el texto: ${error}`);
        synthesizer.close();
    }
);
