const GEMINI_API_KEY = "AIzaSyDQ8LQjnqDJ7FVGaiSIbGNf_Gf7sfc14V4";

window.onload = function () {
    sendMessage();
    showLoader();
};

// Function to handle dropdown results
function sendDropdownResults() {
    const topic = document.getElementById("topicDropdown").value;
    const framework = document.getElementById("frameworkDropdown").value;
    const language = document.getElementById("languageDropdown").value;

    const message = `Selected values:\n1. ${topic}\n2. ${framework}\n3. ${language}`;
    displayMessage("User", message);

    fetchGeminiResponse(message);
}

// Function to send a text message
function sendMessage() {
    // fetchGeminiResponse("salam khan details");
    const message = document.getElementById("messageInput").value;
    if (message) {
        displayMessage("User", message);

        document.getElementById("messageInput").value = "";
    }
}

// Function to open file picker and send image
function openFilePicker() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                displayMessage("User", `File: ${file.name}`);
                fetchGeminiResponse("Describe this picture", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    fileInput.click();
}

// Function to display messages in chat
function displayMessage(user, text) {
    const messages = document.getElementById("messages");

    // Create a new div to contain the message
    const messageDiv = document.createElement("div");

    // Create a heading element for the user
    const userHeading = document.createElement("h3");
    userHeading.textContent = user;

    // Create a paragraph element for the message text
    const messageParagraph = document.createElement("p");
    messageParagraph.textContent = text;

    // Append the heading and paragraph to the message div
    messageDiv.appendChild(userHeading);
    messageDiv.appendChild(messageParagraph);

    // Append the message div to the messages container
    messages.appendChild(messageDiv);

    // Scroll to the bottom of the messages container
    messages.scrollTop = messages.scrollHeight;
}

async function fetchGeminiResponse(question) {
    try {
        showLoader();

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: question }]
                }]
            })
        });

        const data = await response.json();

        const geminiResponse = data.candidates[0].content.parts[0].text;
        displayMessage("Gemini", geminiResponse);

    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        displayMessage("Gemini", "Error: Unable to get a response.");
    } finally {
        hideLoader();
    }
}

// Show loader
function showLoader() {
    document.getElementById("loader").style.display = "block";
}

// Hide loader
function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
