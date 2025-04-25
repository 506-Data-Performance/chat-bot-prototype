// -----------------------------------------------------------
// 1) Initialization & Global Variables
// -----------------------------------------------------------
// Header
const HEADER_TEXT = "AI Genie"; // New variable for the header text
const HEADER_TEXT_COLOR = "#fff";

// Bot logo & welcome message
const BOT_LOGO_URL = "https://www.506.ai/app/uploads/2024/05/logo.svg";
const WELCOME_MESSAGE =
  "Hallo! Ich bin AI Genie, die KI dieser Webseite. Ich weiß (fast) alles – frag mich einfach! Na gut, vielleicht nicht alles, aber ich gebe mein Bestes. 😉";
const BOT_PLACEHOLDER_TEXT = "Thinking..."; // Placeholder text when bot is "thinking"

// ---- New variables for customizing bubble colors & text ----
const MAIN_COLOR = "#0078D7"; // Main brand color (used for header, buttons, etc.)
const BOT_BUBBLE_COLOR = "#f0f0f0"; // Bot's bubble background
const BOT_TEXT_COLOR = "#555"; // Bot's bubble text color
const USER_TEXT_COLOR = "#fff"; // User's bubble text color

// API endpoint for chatbot
const API_ENDPOINT_URL =
  "https://chat-bot-prototype-4ekf.vercel.app/api/v1/chat";

console.log("Initializing chatbot...");

// Chat history to maintain conversation context
const chatHistory = [];

// Track if the welcome message has already been displayed
let hasDisplayedWelcomeMessage = false;

// -----------------------------------------------------------
// 2) Create Chatbot Button (always visible)
// -----------------------------------------------------------
const chatbotButton = document.createElement("div");
chatbotButton.style.position = "fixed";
chatbotButton.style.bottom = "20px";
chatbotButton.style.right = "20px";
chatbotButton.style.width = "60px";
chatbotButton.style.height = "60px";
chatbotButton.style.background = MAIN_COLOR; // replaced #0078D7
chatbotButton.style.borderRadius = "50%";
chatbotButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
chatbotButton.style.display = "flex";
chatbotButton.style.alignItems = "center";
chatbotButton.style.justifyContent = "center";
chatbotButton.style.color = "#fff";
chatbotButton.style.fontSize = "24px";
chatbotButton.style.cursor = "pointer";
chatbotButton.style.zIndex = "9999";
chatbotButton.innerText = "💬";
chatbotButton.title = "Chat with us!";
document.body.appendChild(chatbotButton);

// -----------------------------------------------------------
// 3) Create Chatbot Container (initially hidden)
// -----------------------------------------------------------
const chatbotContainer = document.createElement("div");
chatbotContainer.style.position = "fixed";
chatbotContainer.style.bottom = "90px"; // Above the button
chatbotContainer.style.right = "20px";
chatbotContainer.style.width = "300px";
chatbotContainer.style.height = "400px";
chatbotContainer.style.background = "#fff";
chatbotContainer.style.border = "1px solid #ccc";
chatbotContainer.style.borderRadius = "10px";
chatbotContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
chatbotContainer.style.display = "none"; // Initially hidden
chatbotContainer.style.flexDirection = "column";
chatbotContainer.style.overflow = "hidden";
chatbotContainer.style.fontFamily = "Arial, sans-serif";
chatbotContainer.style.zIndex = "9999";
document.body.appendChild(chatbotContainer);

// -----------------------------------------------------------
// 4) Create Chatbot Header
// -----------------------------------------------------------
const chatbotHeader = document.createElement("div");
chatbotHeader.style.background = MAIN_COLOR;
chatbotHeader.style.color = HEADER_TEXT_COLOR; // replaced "#fff"
chatbotHeader.style.padding = "10px";
chatbotHeader.style.textAlign = "center";
chatbotHeader.style.cursor = "pointer";
chatbotHeader.style.display = "flex";
chatbotHeader.style.alignItems = "center";
chatbotHeader.style.justifyContent = "center";

// Add logo to header
const logo = document.createElement("img");
logo.src = BOT_LOGO_URL;
logo.style.height = "20px";
logo.style.marginRight = "10px";
chatbotHeader.appendChild(logo);

// Add text to header
const headerText = document.createElement("span");
headerText.innerText = HEADER_TEXT; // replaced "AI Genie"
chatbotHeader.appendChild(headerText);

// Close the chatbot when clicking on header (optional)
chatbotHeader.onclick = () => {
  chatbotContainer.style.display = "none";
};
chatbotContainer.appendChild(chatbotHeader);

// -----------------------------------------------------------
// 5) Create Messages Container
// -----------------------------------------------------------
const messagesContainer = document.createElement("div");
messagesContainer.style.flex = "1";
messagesContainer.style.padding = "10px";
messagesContainer.style.overflowY = "auto";
chatbotContainer.appendChild(messagesContainer);

// -----------------------------------------------------------
// 6) Function to display welcome message (only once)
// -----------------------------------------------------------
const displayWelcomeMessage = () => {
  if (!hasDisplayedWelcomeMessage) {
    const welcomeMessageElem = document.createElement("div");
    welcomeMessageElem.style.display = "flex";
    welcomeMessageElem.style.alignItems = "flex-start";
    welcomeMessageElem.style.margin = "5px 0";

    const botIcon = document.createElement("div");
    botIcon.style.width = "30px";
    botIcon.style.height = "30px";
    botIcon.style.background = MAIN_COLOR;
    botIcon.style.color = "#fff";
    botIcon.style.display = "flex";
    botIcon.style.alignItems = "center";
    botIcon.style.justifyContent = "center";
    botIcon.style.borderRadius = "50%";
    botIcon.style.marginRight = "10px";
    botIcon.innerText = "🤖";

    const botMessageText = document.createElement("div");
    botMessageText.style.color = BOT_TEXT_COLOR; // replaced #555
    botMessageText.style.padding = "5px 10px";
    botMessageText.style.background = BOT_BUBBLE_COLOR; // replaced #f0f0f0
    botMessageText.style.borderRadius = "10px";
    botMessageText.innerText = WELCOME_MESSAGE;

    welcomeMessageElem.appendChild(botIcon);
    welcomeMessageElem.appendChild(botMessageText);

    messagesContainer.appendChild(welcomeMessageElem);
    hasDisplayedWelcomeMessage = true; // Mark welcome message as displayed
  }
};

// -----------------------------------------------------------
// 7) Utility function to convert Markdown links to HTML links
// -----------------------------------------------------------
function formatMessageWithLinks(input) {
  // Regex explanation:
  // \[([^\]]+)\] - captures the link text
  // \(([^)]+)\)  - captures the link URL
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

  return input.replace(
    markdownLinkPattern,
    (match, text, url) => `<a href="${url}" style="color: blue;">${text}</a>`
  );
}

// -----------------------------------------------------------
// 8) Example of the link format function (just a test in console)
// -----------------------------------------------------------
const testInput =
  "Here is [OpenAI](https://openai.com) and [GitHub](https://github.com).";
//console.log(formatMessageWithLinks(testInput));

// -----------------------------------------------------------
// 9) Create input bar (user input & send button)
// -----------------------------------------------------------
const inputBar = document.createElement("div");
inputBar.style.display = "flex";
inputBar.style.padding = "10px";
chatbotContainer.appendChild(inputBar);

const inputField = document.createElement("input");
inputField.style.flex = "1";
inputField.style.padding = "5px";
inputField.style.border = "1px solid #ccc";
inputField.style.borderRadius = "5px";
inputField.placeholder = "Type a message...";
inputBar.appendChild(inputField);

const sendButton = document.createElement("button");
sendButton.innerText = "Send";
sendButton.style.marginLeft = "10px";
sendButton.style.padding = "5px 10px";
sendButton.style.background = MAIN_COLOR;
sendButton.style.color = "#fff";
sendButton.style.border = "none";
sendButton.style.borderRadius = "5px";
sendButton.style.cursor = "pointer";
inputBar.appendChild(sendButton);

// -----------------------------------------------------------
// 10) Typing effect for bot responses
// -----------------------------------------------------------
const simulateTypingInBubble = (message, botMessageElem) => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < message.length) {
      botMessageElem.innerText = message.slice(0, index + 1);
      index++;
      // Scroll to bottom on each character
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } else {
      clearInterval(interval);
    }
  }, 50);
};

// -----------------------------------------------------------
// 11) Function to handle sending messages
// -----------------------------------------------------------
async function handleSendMessage() {
  const userMessage = inputField.value.trim();
  if (userMessage) {
    // 1. Add user's message to chat history
    chatHistory.push({
      role: "user",
      content: userMessage,
      references: [],
      sources: [],
    });

    // 2. Display the user's message with a human icon
    const userMessageWrapper = document.createElement("div");
    userMessageWrapper.style.display = "flex";
    userMessageWrapper.style.alignItems = "flex-start";
    userMessageWrapper.style.justifyContent = "flex-end"; // Align right
    userMessageWrapper.style.margin = "5px 0";

    const userMessageBubble = document.createElement("div");
    userMessageBubble.style.color = USER_TEXT_COLOR; // replaced #fff
    userMessageBubble.style.padding = "5px 10px";
    userMessageBubble.style.background = MAIN_COLOR; // main user bubble color
    userMessageBubble.style.borderRadius = "10px";
    userMessageBubble.style.display = "inline-block";
    userMessageBubble.style.marginLeft = "10px"; // space for icon
    userMessageBubble.innerText = userMessage;

    const userIcon = document.createElement("div");
    userIcon.style.width = "30px";
    userIcon.style.height = "30px";
    userIcon.style.background = MAIN_COLOR;
    userIcon.style.color = "#fff";
    userIcon.style.display = "flex";
    userIcon.style.alignItems = "center";
    userIcon.style.justifyContent = "center";
    userIcon.style.borderRadius = "50%";
    userIcon.style.marginRight = "10px";
    userIcon.innerText = "👱";

    userMessageWrapper.appendChild(userMessageBubble);
    userMessageWrapper.appendChild(userIcon); // icon on right
    messagesContainer.appendChild(userMessageWrapper);

    // 3. Create the bot's message container with bubble and icon
    const botMessageWrapper = document.createElement("div");
    botMessageWrapper.style.display = "flex";
    botMessageWrapper.style.alignItems = "flex-start";
    botMessageWrapper.style.justifyContent = "flex-start"; // Align left
    botMessageWrapper.style.margin = "5px 0";

    const botMessageBubble = document.createElement("div");
    botMessageBubble.style.color = BOT_TEXT_COLOR; // replaced #555
    botMessageBubble.style.padding = "5px 10px";
    botMessageBubble.style.background = BOT_BUBBLE_COLOR; // replaced #f0f0f0
    botMessageBubble.style.borderRadius = "10px";
    botMessageBubble.style.display = "inline-block";
    botMessageBubble.style.marginRight = "10px"; // space for icon
    botMessageBubble.innerText = BOT_PLACEHOLDER_TEXT; // replaced "Thinking..."

    const botIcon = document.createElement("div");
    botIcon.style.width = "30px";
    botIcon.style.height = "30px";
    botIcon.style.background = MAIN_COLOR;
    botIcon.style.color = "#fff";
    botIcon.style.display = "flex";
    botIcon.style.alignItems = "center";
    botIcon.style.justifyContent = "center";
    botIcon.style.borderRadius = "50%";
    botIcon.style.marginLeft = "10px";
    botIcon.innerText = "🤖";

    botMessageWrapper.appendChild(botIcon);
    botMessageWrapper.appendChild(botMessageBubble);
    messagesContainer.appendChild(botMessageWrapper);

    // Scroll to show placeholder
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 4. Make API call to your chatbot
    try {
      const response = await fetch(API_ENDPOINT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();

      // 4a. Typing effect
      simulateTypingInBubble(data.response, botMessageBubble);
      setTimeout(() => {
        botMessageBubble.innerHTML = formatMessageWithLinks(data.response);
      }, data.response.length * 50 + 100);

      // 4b. Add bot's response to chat history
      chatHistory.push({
        role: "bot",
        content: data.response,
      });
    } catch (error) {
      botMessageBubble.innerText =
        "Sorry, something went wrong. Please try again later.";
    }

    // 5. Clear input & scroll
    inputField.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// -----------------------------------------------------------
// 12) Wire up the "Send" button & "Enter" key
// -----------------------------------------------------------
sendButton.onclick = handleSendMessage;

inputField.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSendMessage();
  }
});

// -----------------------------------------------------------
// 13) Show/Hide Chat on Button Click
// -----------------------------------------------------------
chatbotButton.onclick = () => {
  if (chatbotContainer.style.display === "none") {
    chatbotContainer.style.display = "flex";
    displayWelcomeMessage();
  } else {
    chatbotContainer.style.display = "none";
  }
};

console.log("Chatbot setup complete.");
