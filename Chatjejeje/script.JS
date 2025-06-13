let preguntaCount = 0;
const maxPreguntas = 3;
const chatOutput = document.getElementById('chat-output');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const resetButton = document.getElementById('reset-button');

const respuestasGGG = [
    "Pero mira la boludez que preguntas, ¿no tenes algo mas interesante para preguntar?",
    "dale che, esforzate un poco mas, ¿no te mandaron a la escuela cuando eras chiquito?",
    "Ayy Diosss por favor, que manera de prguntar pelotudeces, dejá seguí con lo tuyo nomas"
];

// Función para añadir mensajes al chat
function addMessage(text, type = 'system') {
    const p = document.createElement('p');
    p.classList.add(type + '-message');
    p.textContent = text;
    chatOutput.appendChild(p);
    chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll
}

// Función principal para procesar la pregunta
function procesarPregunta() {
    const pregunta = userInput.value.trim(); // .trim() para quitar espacios al inicio/final

    if (pregunta === "") {
        addMessage("¡No preguntes vacio!", 'system');
        return; // No hagas nada si la pregunta está vacía
    }

    if (preguntaCount < maxPreguntas) {
        addMessage(`Haga su pregunta número ${preguntaCount + 1}:`, 'system'); // Mensaje de sistema
        addMessage(`Tu pregunta fue: "${pregunta}"`, 'user'); // La pregunta del usuario

        const respuesta = respuestasGGG[preguntaCount];
        addMessage(respuesta, 'ai'); // La respuesta de la IA

        preguntaCount++;
        userInput.value = ''; // Limpia el input

        if (preguntaCount === maxPreguntas) {
            addMessage("¡Haz agotado tus preguntas! Presiona Reiniciar Chat para empezar de nuevo.", 'system');
            sendButton.disabled = true;
            userInput.disabled = true;
            userInput.classList.add('disabled-input');
            resetButton.style.display = 'block'; // Muestra el botón de reiniciar
        }
    } else {
        addMessage("Ya has hecho las 3 preguntas. Por favor, reinicia el chat.", 'system');
    }
}

// Función para reiniciar el chat
function resetChat() {
    preguntaCount = 0;
    chatOutput.innerHTML = ''; // Limpia el contenido del chat
    userInput.value = '';
    sendButton.disabled = false;
    userInput.disabled = false;
    userInput.classList.remove('disabled-input');
    resetButton.style.display = 'none'; // Oculta el botón de reiniciar
    addMessage("Chat Reiniciado. ¡Haz tus 3 preguntas nuevamente!", 'system');
}

// Asignar eventos a los botones y al input
sendButton.addEventListener('click', procesarPregunta);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        procesarPregunta();
    }
});
resetButton.addEventListener('click', resetChat);

// Mensaje inicial al cargar la página
addMessage("Bienvenido a Chat jejeje. ¡Haz tu primera pregunta!", 'system');