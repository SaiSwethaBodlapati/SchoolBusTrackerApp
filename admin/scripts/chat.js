
const socket = io("http://localhost:8000", {
    auth: {
        id: localStorage.getItem('email'),
        role: "admin"
    }
});

socket.onopen = function () {
    console.log("Connected to WebSocket server");
};

socket.on("receiveMessage", ({ from, message }) => {
    console.log(`Private message received from ${from}: ${message}`);
    displayMessage(message, "bot");
});

function sendMessage() {
    const inputField = document.getElementById("input");
    const message = inputField.value.trim();

    if (message && recipientId && recipientRole) {
        displayMessage(message, "user");
        socket.emit('sendMessage', { recipientId, recipientRole, message });
        inputField.value = "";
    }
}

function displayMessage(message, sender) {
    const messageSection = document.getElementById("message-section");
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", sender);
    messageDiv.textContent = message;
    messageSection.appendChild(messageDiv);
    messageSection.scrollTop = messageSection.scrollHeight;
}


function closeChat() {
    document.getElementById("chat-container").style.display = "none";
}
