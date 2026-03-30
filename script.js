let mode = "chat";
let currentLang = "en";

let questions = [
    "What is your name?",
    "Where do you live?",
    "What do you do?",
    "What is your favorite food?",
    "How are you today?"
];

let currentQuestion = 0;

// Enter key support
function handleKey(e) {
    if (e.key === "Enter") sendMessage();
}

// Typing animation
function typeMessage(text) {
    let chatbox = document.getElementById("chatbox");

    let div = document.createElement("div");
    div.className = "ai";
    chatbox.appendChild(div);

    let i = 0;
    let interval = setInterval(() => {
        div.innerHTML = `<span>SuhelGPT: ${text.substring(0, i)}</span>`;
        i++;
        chatbox.scrollTop = chatbox.scrollHeight;

        if (i > text.length) {
            clearInterval(interval);
            speak(text);
        }
    }, 20);
}

// Voice
function speak(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = currentLang === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(speech);
}

// Hinglish detection
function isHinglish(text) {
    let words = ["kya","kaise","nahi","mera","tum","hai"];
    return words.some(w => text.toLowerCase().includes(w));
}

// Smart replies
function getReply(text) {
    text = text.toLowerCase();

    if (text.includes("hello")) return "Hello! 😊";
    if (text.includes("name")) return "I am SuhelGPT";
    if (text.includes("how are you")) return "I am fine! How about you?";
    
    return "Tell me more 😊";
}

// Send message
function sendMessage() {
    let input = document.getElementById("userInput");
    let chatbox = document.getElementById("chatbox");

    let text = input.value;
    if (!text) return;

    chatbox.innerHTML += `<div class="user"><span>${text}</span></div>`;
    input.value = "";

    if (mode === "chat") {
        if (isHinglish(text)) {
            typeMessage("मैं आपकी मदद कर रहा हूँ 😊");
        } else {
            typeMessage(getReply(text));
        }
    } else {
        checkAnswer(text);
    }
}

// Tutor mode
function checkAnswer(ans) {
    if (!ans.toLowerCase().startsWith("i")) {
        typeMessage("Try starting with 'I'");
    } else {
        typeMessage("Good job!");
    }

    currentQuestion++;
    askQuestion();
}

function askQuestion() {
    if (currentQuestion < questions.length) {
        typeMessage(questions[currentQuestion]);
    }
}

// Voice input
function startListening() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = currentLang === "hi" ? "hi-IN" : "en-US";

    recognition.onresult = function(event) {
        document.getElementById("userInput").value = event.results[0][0].transcript;
        sendMessage();
    };

    recognition.start();
}
