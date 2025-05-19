// Define custom configuration directly
const myCustomConfig = {
  // Logo and brand information
  LOGO_URL: "https://www.506.ai/app/uploads/2024/05/logo.svg",
  CHAT_TITLE: "CompanyGPT",
  CHAT_SUBTITLE: "Hier steht noch etwas Infotext",

  // Assistant-picker intro text (brandable)
  PICKER_GREETING: {
    LINE1: "Hallo 506 🚀",
    LINE2: "Wie können wir helfen?",
    DESCRIPTION:
      "Hier steht etwas Text bzgl. Auswahl Assistenten und so. Kann auch mehr Text sein.",
  },

  // Color scheme - Customizable colors
  COLORS: {
    primary: "#0062A2", // send-icon, floating button, input border
    botBg: "#EAF8FD", // LLM bubble background
    botText: "#253246", // LLM bubble text
    userBg: "#0195D5", // user bubble background
    userText: "#FFFFFF", // user bubble text
  },

  // UI text
  ERROR_MESSAGE: "Sorry, something went wrong. Please try again later.",
  INPUT_PLACEHOLDER: "Eine Frage stellen...",

  // API endpoint
  API_ENDPOINT: "http://127.0.0.1:5000/api/v1/private/chat",

  // Assistants configuration (1-5 assistants)
  ASSISTANTS: [
    {
      id: "HelpcenterHelper_1",
      name: "506 Helpcenter Agent",
      icon: "https://pbs.twimg.com/profile_images/1194735185625067522/iX2yq2mX_400x400.jpg",
      welcome:
        "Willkommen bei CompanyGPT! 🚀\nWie können wir dir heute weiterhelfen?",
      suggestedQuestions: [
        "Was ist im Enterprise Paket enthalten?",
        "Wie sieht es mit Datenschutz aus?",
        "Was sind die neuesten Funktionen?",
      ],
    },
    {
      id: "assistant-2",
      name: "Assistent Name 2",
      description: "Beschreibung Assistent",
      icon: "https://pbs.twimg.com/profile_images/1194735185625067522/iX2yq2mX_400x400.jpg",
      welcome: "Hallo, ich bin Assistent 2 – womit kann ich helfen?",
      suggestedQuestions: [],
    },
  ],
};

const myCustomConfig2 = {
  // Logo and brand information
  LOGO_URL:
    "https://i.etsystatic.com/52039034/r/il/16ca42/6052095256/il_794xN.6052095256_ltxd.jpg",
  CHAT_TITLE: "TestBot",
  CHAT_SUBTITLE: "Your test assistant",

  // Assistant-picker intro text
  PICKER_GREETING: {
    LINE1: "Hello tester! 👋",
    LINE2: "What would you like to test today?",
    DESCRIPTION:
      "This is a test configuration for the 506 chat widget. Select an assistant to begin testing.",
  },

  // Custom color scheme
  COLORS: {
    primary: "#FF6600", // Orange primary color
    botBg: "#FFF3E0", // Light orange background
    botText: "#333333", // Dark text for readability
    userBg: "#FF8C33", // Lighter orange for user bubbles
    userText: "#FFFFFF", // White text for contrast
  },

  // UI text
  ERROR_MESSAGE: "Test error: Something went wrong. Please try again.",
  INPUT_PLACEHOLDER: "Type your test message...",

  // Keep the original API endpoint
  //API_ENDPOINT: "http://127.0.0.1:5000/api/v1/public/chat",

  API_ENDPOINT: "https://chat-bot-prototype.vercel.app/api/v1/public/chat",

  // Test assistants
  ASSISTANTS: [
    {
      id: "test-assistant-1",
      name: "Test Assistant",
      icon: "https://cdn-icons-png.flaticon.com/512/1053/1053367.png",
      welcome:
        "Welcome to the test chat! 🧪\nI'm here to help you test the chat widget functionality.",
      suggestedQuestions: [
        "Test response formatting",
        "Test long messages",
        "Test error handling",
      ],
    },
    {
      id: "test-assistant-2",
      name: "Debug Helper",
      description: "For technical issues and debugging",
      icon: "https://cdn-icons-png.flaticon.com/512/2621/2621040.png",
      welcome: "Debug mode activated. What would you like to troubleshoot?",
      suggestedQuestions: [
        "Check API connection",
        "Test response timing",
        "Reset chat history",
      ],
    },
    {
      id: "DemoBot_1",
      name: "Demo Bot",
      description: "For technical issues and debugging",
      icon: "https://cdn-icons-png.flaticon.com/512/2621/2621040.png",
      welcome: "Demo Bot der Webpage?",
      suggestedQuestions: [
        "Was steht in dem File?",
        "Was ist deine Aufgabe",
        "Unterstütze mich bei der Demo ",
      ],
    },
  ],
};

// Immediately-invoked function expression with configurable options
(function (customConfig) {
  // Make sure customConfig is at least an empty object
  customConfig = customConfig || {};

  // ===============================================
  // FIXED CONFIGURATION - Same for all customers
  // ===============================================
  const FIXED_CONFIG = {
    // Fixed colors
    COLORS: {
      darkText: "#253246", // Default text color
      white: "#FFFFFF",
      borderColor: "#E5E5E5", // Border color
      neuIndicatorColor: "#F65071", // Color for the "Neu" indicator
    },

    // UI dimensions
    UI: {
      logoSize: { width: "48px", height: "48px" },
      chatIconSize: { width: "24px", height: "24px" },
      chatBubbleWidth: "289px",
      chatBubbleRadius: "16px",
      inputFieldWidth: "368px",
      inputFieldHeight: "52px",
      inputFieldRadius: "32px",
      chatButtonSize: "48px",
    },

    // Font settings
    FONTS: {
      defaultFont: "Inter, Arial, sans-serif",
      agentNameSize: "13px",
      agentNameWeight: "700",
      agentNameLineHeight: "18px",
      agentNameSpacing: "0.3px",
      messageTextSize: "14px",
      messageTextWeight: "400",
      messageTextLineHeight: "20px",
      messageTextSpacing: "0px",
      neuIndicatorSize: "16px",
      neuIndicatorWeight: "400",
    },
  };

  // Deep merge helper function to safely merge configs
  function deepMerge(target, source) {
    if (!source) return target;
    const output = Object.assign({}, target);

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  // ===============================================
  // MERGE CONFIGURATIONS - Create a complete config
  // ===============================================
  const CONFIG = {
    ...customConfig,
    COLORS: {
      ...customConfig.COLORS,
      ...FIXED_CONFIG.COLORS,
    },
    UI: FIXED_CONFIG.UI,
    FONTS: FIXED_CONFIG.FONTS,
  };

  // ===============================================
  // SVG ICONS - Centralized to avoid duplication
  // ===============================================
  const ICONS = {
    chatBubble: `
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.94906 23.8429H21.7624L25.2732 27V7.22248C25.2732 5.99798 24.2752 4.99998 23.0507 4.99998H4.94906C3.72456 4.99998 2.72656 5.99798 2.72656 7.22248V21.6204C2.72656 22.8449 3.72456 23.8429 4.94906 23.8429ZM14.1316 19.7381C17.2879 19.7381 20.138 18.9215 21.7564 17.5542C21.9993 17.3486 22.0274 16.9878 21.8199 16.7485C21.6112 16.5092 21.245 16.4815 21.0021 16.6872C19.6082 17.8645 16.9768 18.5956 14.1316 18.5956C11.2879 18.5956 8.65627 17.8645 7.26239 16.6872C7.01948 16.4815 6.65333 16.5092 6.44461 16.7485C6.23589 16.9878 6.26396 17.3486 6.50686 17.5542C8.12512 18.9216 10.9754 19.7381 14.1316 19.7381Z" fill="${CONFIG.COLORS.white}"/>
        </svg>
      `,
    downArrow: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="${CONFIG.COLORS.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
    send: `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3L8 13" stroke="${CONFIG.COLORS.white}" stroke-width="2" stroke-linecap="round"/>
          <path d="M3 8L8 3L13 8" stroke="${CONFIG.COLORS.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
    scrollDown: `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4L6 8L9 4" stroke="${CONFIG.COLORS.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
    chevronLeft: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0867 5.41077C15.4121 5.73619 15.4121 6.26382 15.0867 6.58925L10.6759 11L15.0867 15.4108C15.4121 15.7362 15.4121 16.2638 15.0867 16.5893C14.7613 16.9147 14.2336 16.9147 13.9082 16.5893L8.90817 11.5893C8.58275 11.2638 8.58275 10.7362 8.90817 10.4108L13.9082 5.41077C14.2336 5.08534 14.7613 5.08534 15.0867 5.41077Z" fill="#253246"/>
      </svg>
      `,
    trashIcon: `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.66406 11C7.66406 10.5398 8.03716 10.1667 8.4974 10.1667H23.4974C23.9576 10.1667 24.3307 10.5398 24.3307 11C24.3307 11.4603 23.9576 11.8334 23.4974 11.8334H8.4974C8.03716 11.8334 7.66406 11.4603 7.66406 11Z" fill="#253246"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1693 10.1667C10.6295 10.1667 11.0026 10.5398 11.0026 11V22.6667C11.0026 22.8123 11.0838 23.0277 11.2794 23.2233C11.4749 23.4188 11.6903 23.5 11.8359 23.5H20.1693C20.3149 23.5 20.5303 23.4188 20.7258 23.2233C20.9214 23.0277 21.0026 22.8123 21.0026 22.6667V11C21.0026 10.5398 21.3757 10.1667 21.8359 10.1667C22.2962 10.1667 22.6693 10.5398 22.6693 11V22.6667C22.6693 23.3544 22.3338 23.9723 21.9044 24.4018C21.4749 24.8312 20.857 25.1667 20.1693 25.1667H11.8359C11.1482 25.1667 10.5303 24.8312 10.1008 24.4018C9.67139 23.9723 9.33594 23.3544 9.33594 22.6667V11C9.33594 10.5398 9.70903 10.1667 10.1693 10.1667Z" fill="#253246"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7794 8.77674C13.5838 8.97228 13.5026 9.18767 13.5026 9.33331V11C13.5026 11.4602 13.1295 11.8333 12.6693 11.8333C12.209 11.8333 11.8359 11.4602 11.8359 11V9.33331C11.8359 8.64562 12.1714 8.02768 12.6008 7.59822C13.0303 7.16877 13.6482 6.83331 14.3359 6.83331H17.6693C18.357 6.83331 18.9749 7.16877 19.4044 7.59822C19.8338 8.02768 20.1693 8.64562 20.1693 9.33331V11C20.1693 11.4602 19.7962 11.8333 19.3359 11.8333C18.8757 11.8333 18.5026 11.4602 18.5026 11V9.33331C18.5026 9.18767 18.4214 8.97228 18.2258 8.77674C18.0303 8.58119 17.8149 8.49998 17.6693 8.49998H14.3359C14.1903 8.49998 13.9749 8.58119 13.7794 8.77674Z" fill="#253246"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3333 14.3333C14.7936 14.3333 15.1667 14.7064 15.1667 15.1666V20.1666C15.1667 20.6269 14.7936 21 14.3333 21C13.8731 21 13.5 20.6269 13.5 20.1666V15.1666C13.5 14.7064 13.8731 14.3333 14.3333 14.3333Z" fill="#253246"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.6693 14.3333C18.1295 14.3333 18.5026 14.7064 18.5026 15.1666V20.1666C18.5026 20.6269 18.1295 21 17.6693 21C17.209 21 16.8359 20.6269 16.8359 20.1666V15.1666C16.8359 14.7064 17.209 14.3333 17.6693 14.3333Z" fill="#253246"/>
      </svg>
    `,
  };

  // ===============================================
  // SHADOW DOM SETUP
  // ===============================================
  // Create the root container for our widget
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "506-chat-widget-container";

  // Attach Shadow DOM to the container
  const shadow = widgetContainer.attachShadow({ mode: "open" });

  // ===============================================
  // STYLES - Centralized CSS to avoid inline styles
  // ===============================================
  const styleElement = document.createElement("style");
  styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      @keyframes typingBlink {
        0% { opacity: 0.2; }
        20% { opacity: 1; }
        100% { opacity: 0.2; }
      }
      
      .typing-indicator {
        display: flex;
        padding: 5px 0;
      }
      
      .typing-indicator span {
        height: 8px;
        width: 8px;
        margin: 0 2px;
        background-color: ${CONFIG.COLORS.primary};
        display: block;
        border-radius: 50%;
      }
      
      .typing-indicator span:nth-of-type(1) {
        animation: typingBlink 1s infinite 0.3333s;
      }
      
      .typing-indicator span:nth-of-type(2) {
        animation: typingBlink 1s infinite 0.6666s;
      }
      
      .typing-indicator span:nth-of-type(3) {
        animation: typingBlink 1s infinite 0.9999s;
      }
      
      .neu-divider {
        display: flex;
        align-items: center;
        margin: 16px 0;
      }
      
      .neu-divider::before {
        content: "";
        flex: 0 0 48px;
        height: 1px;
        background: ${CONFIG.COLORS.neuIndicatorColor};
      }
      
      .neu-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: ${CONFIG.COLORS.neuIndicatorColor};
      }
      
      .neu-divider-text {
        margin: 0 12px;
        font-family: ${CONFIG.FONTS.defaultFont};
        font-size: 12px;
        line-height: 18px;
        letter-spacing: 0;
        font-weight: 400;
        color: ${CONFIG.COLORS.neuIndicatorColor};
      }
      
      .chat-button {
        width: ${CONFIG.UI.chatButtonSize};
        height: ${CONFIG.UI.chatButtonSize};
        background: ${CONFIG.COLORS.primary};
        border-radius: 24px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${CONFIG.COLORS.white};
        cursor: pointer;
        z-index: 1000000;
        position: fixed;
        bottom: 20px;
        right: 20px;
        transition: transform 0.2s ease-in-out;
      }
      
      .chat-button:hover {
        transform: scale(1.05);
      }
      
      .chat-container {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 400px;
        height: 682px;
        background: ${CONFIG.COLORS.white};
        border: 1px solid ${CONFIG.COLORS.borderColor};
        border-radius: 16px;
        box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: ${CONFIG.FONTS.defaultFont};
        z-index: 1000000;
      }
      
      .chat-header {
        display: flex;
        width: 100%;
        height: 64px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        border-bottom: 1px solid ${CONFIG.COLORS.borderColor};
        background: ${CONFIG.COLORS.white};
        justify-content: space-between;
        padding: 8px 16px;
      }
      
      .header-left {
        display: flex;
        flex: 1;
        align-items: center;
        height: 100%;
      }
      
      .header-logo {
        height: ${CONFIG.UI.logoSize.height};
        width: ${CONFIG.UI.logoSize.width};
      }
      
      .header-text {
        display: flex;
        flex-direction: column;
        margin-left: 16px;
      }
      
      .header-title {
        font-family: ${CONFIG.FONTS.defaultFont};
        font-weight: 700;
        font-size: 16px;
        line-height: 16px;
        letter-spacing: 0.3px;
        color: ${CONFIG.COLORS.darkText};
      }
      
      .header-subtitle {
        font-family: ${CONFIG.FONTS.defaultFont};
        font-weight: 400;
        font-size: 12px;
        line-height: 12px;
        letter-spacing: 0px;
        color: ${CONFIG.COLORS.darkText};
        margin-top: 4px;
      }
  
      .header-back-button {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 8px;
      }
  
      .header-back-button:hover {
        opacity: 0.8;
      }
      
      .close-button {
        font-size: 28px;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #000;
        width: 24px;
        height: 24px;
        margin-right: 0;
      }
  
      .reset-button {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 12px;
      }
  
      .reset-button:hover {
        opacity: 0.8;
      }
  
  
      .tooltip {
        visibility: hidden;
        width: auto;
        min-width: 126px; /* Match your image width */
        max-width: 126px; /* Ensure fixed width */
        background-color: ${CONFIG.COLORS.userBg};
        color: ${CONFIG.COLORS.userText};
        text-align: center;
        border-radius: 6px;
        padding: 8px 12px;
        position: absolute;
        z-index: 1;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
        font-family: ${CONFIG.FONTS.defaultFont};
        font-size: 14px;
        font-weight: 400;
        white-space: nowrap; /* Prevent wrapping to multiple lines */
        overflow: hidden;    /* Hide any overflow */
        text-overflow: ellipsis; /* Add ellipsis if text is too long */
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        pointer-events: none; /* Ensures tooltip doesn't interfere with clicks */
      }
  
      .tooltip::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent ${CONFIG.COLORS.userBg} transparent;
    }
  
      .tooltip-container {
        position: relative;
        display: inline-block;
        height: 32px; /* Match your button height */
      }
      .tooltip-container:hover .tooltip {
        visibility: visible;
        opacity: 1;
      }
  
      .header-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
      }
  
      
      .messages-container {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: thin;
        scrollbar-color: ${CONFIG.COLORS.botBg} transparent;
      }
      
      .messages-container::-webkit-scrollbar {
        width: 5px;
      }
      
      .messages-container::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .messages-container::-webkit-scrollbar-thumb {
        background: ${CONFIG.COLORS.botBg};
        border-radius: 4px;
        min-height: 47px;
      }
      
      .messages-container::-webkit-scrollbar-button {
        display: none !important;
        width: 0;
        height: 0;
      }
      
      .input-bar {
        display: flex;
        padding: 16px;
      }
      
      .input-field-container {
        display: flex;
        flex: 1;
        align-items: center;
        border: 2px solid ${CONFIG.COLORS.primary};
        border-radius: ${CONFIG.UI.inputFieldRadius};
        padding: 0 16px;
        position: relative;
        height: ${CONFIG.UI.inputFieldHeight};
        width: ${CONFIG.UI.inputFieldWidth};
      }
      
      .input-field {
        flex: 1;
        padding: 0;
        margin-right: 32px;
        border: none;
        outline: none;
        font-size: ${CONFIG.FONTS.messageTextSize};
        font-family: ${CONFIG.FONTS.defaultFont};
        font-weight: ${CONFIG.FONTS.messageTextWeight};
        line-height: ${CONFIG.FONTS.messageTextLineHeight};
        letter-spacing: ${CONFIG.FONTS.messageTextSpacing};
        color: ${CONFIG.COLORS.darkText};
        background: transparent;
      }
  
      // Suggested questions styles
    .suggested-questions-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 16px 0;
      gap: 8px;
    }
  
    .suggested-question-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      width: 100%;
    }
  
    .suggested-question-bubble {
      display: inline-block;
      padding: 8px 16px;
      background: #FFFFFF;
      border: 1px solid ${CONFIG.COLORS.primary};
      border-radius: 18px;
      color: ${CONFIG.COLORS.primary};
      font-family: ${CONFIG.FONTS.defaultFont};
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      white-space: nowrap;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
  .suggested-question-bubble:hover {
    background: ${CONFIG.COLORS.botBg};
    transform: translateY(-1px);
  }
  
  
      .back-button {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${CONFIG.COLORS.primary};
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        left: 10px;
        top: 10px;
        transition: transform 0.1s ease-in-out;
      }
    
      .back-button:hover {
        transform: scale(1.1);
      }
    
      .input-field {
        padding-left: 16px; /* Change from 40px */
      }
      
      .send-button {
        width: 32px;
        height: 32px;
        display: none;
        align-items: center;
        justify-content: center;
        background: ${CONFIG.COLORS.primary};
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
        transition: transform 0.1s ease-in-out;
      }
      
      .send-button:hover {
        transform: scale(1.1);
      }
      
      .user-message-container {
        display: flex;
        justify-content: flex-end;
        margin: 16px 0;
      }
      
      .user-message {
        max-width: ${CONFIG.UI.chatBubbleWidth};
        padding: 12px 16px;
        color: ${CONFIG.COLORS.userText};
        background: ${CONFIG.COLORS.userBg};  
        border-radius: ${CONFIG.UI.chatBubbleRadius};
        display: inline-block;
        font-family: ${CONFIG.FONTS.defaultFont};
        font-size: ${CONFIG.FONTS.messageTextSize};
        font-weight: ${CONFIG.FONTS.messageTextWeight};
        line-height: ${CONFIG.FONTS.messageTextLineHeight};
        letter-spacing: ${CONFIG.FONTS.messageTextSpacing};
      }
      
      .bot-message-wrapper {
        margin: 16px 0;
      }
      
      .bot-message-bubble {
        width: ${CONFIG.UI.chatBubbleWidth};
        padding: 12px 16px;
        background: ${CONFIG.COLORS.botBg};
        border-radius: ${CONFIG.UI.chatBubbleRadius};
        color: ${CONFIG.COLORS.botText};
        font-family: ${CONFIG.FONTS.defaultFont};
        font-size: ${CONFIG.FONTS.messageTextSize};
        font-weight: ${CONFIG.FONTS.messageTextWeight};
        line-height: ${CONFIG.FONTS.messageTextLineHeight};
        letter-spacing: ${CONFIG.FONTS.messageTextSpacing};
      }
      
      .agent-info-container {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .agent-image {
        width: ${CONFIG.UI.chatIconSize.width};
        height: ${CONFIG.UI.chatIconSize.height};
        border-radius: 50%;
        margin-right: 8px;
      }
      
      .agent-text {
        width: auto;
        flex-shrink: 0;
        font-family: ${CONFIG.FONTS.defaultFont};
        font-weight: ${CONFIG.FONTS.agentNameWeight};
        font-size: ${CONFIG.FONTS.agentNameSize};
        line-height: ${CONFIG.FONTS.agentNameLineHeight};
        letter-spacing: ${CONFIG.FONTS.agentNameSpacing};
        vertical-align: middle;
        color: ${CONFIG.COLORS.darkText};
      }
      
      .scroll-down-btn {
        position: absolute;
        bottom: calc(52px + 16px + 8px);
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 32px;
        border: 1px solid ${CONFIG.COLORS.primary};
        border-radius: 50%;
        background: #FFFFFF;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 2;
        transition: transform 0.1s ease-in-out;
      }
      
      .scroll-down-btn:hover {
        transform: translateX(-50%) scale(1.1);
      }
      
      a {
        color: ${CONFIG.COLORS.primary};
        text-decoration: underline;
        cursor: pointer;
        word-break: break-word;
      }
  
      a:hover {
        text-decoration: none;
        opacity: 0.9;
      }
  
      .bot-message-bubble a {
        color: ${CONFIG.COLORS.primary};
      }
  
      .user-message a {
        color: ${CONFIG.COLORS.white};
        text-decoration: underline;
      }
      
      /* Assistant Picker Styles */
      .assistant-picker {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0 16px 24px;
        position: relative;
        background: ${CONFIG.COLORS.white};
      }
      
      .assistant-picker-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 8px 0;
      }
      
      .intro-container {
        width: 368px;
        margin: 40px 0 24px;
      }
      
      .intro-line1 {
        font-family: ${CONFIG.FONTS.defaultFont};
        font-weight: 600;
        font-size: 28px;
        line-height: 36px;
        letter-spacing: 0px;
        color: #677690;
      }
      
      .intro-line2 {
        font-family: ${CONFIG.FONTS.defaultFont};
        font-weight: 600;
        font-size: 28px;
        line-height: 36px;
        letter-spacing: 0px;
        color: ${CONFIG.COLORS.darkText};
      }
      
      .intro-copy {
        font-family: ${CONFIG.FONTS.defaultFont};
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        margin-top: 8px;
        color: ${CONFIG.COLORS.darkText};
      }
      
      .assistant-card {
        width: 368px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid ${CONFIG.COLORS.borderColor};
        box-shadow: 0px 2px 4px 0px #86868633;
        margin-bottom: 12px;
        cursor: pointer;
        min-height: 71px;
        transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
      }
      
      .assistant-card:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px 0px #86868633;
      }
      
      .assistant-card-left {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .assistant-card-top {
        display: flex;
        align-items: center;
      }
      
      .assistant-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 12px;
      }
      
      .assistant-name {
        font-family: ${CONFIG.FONTS.defaultFont};
        font-weight: 700;
        font-size: 13px;
        line-height: 18px;
        letter-spacing: 0.3px;
        color: ${CONFIG.COLORS.darkText};
      }
      
      .assistant-description {
        font-family: ${CONFIG.FONTS.defaultFont};
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: ${CONFIG.COLORS.darkText};
      }
      
      /* Accessibility */
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
  
      @media (max-height: 700px) and (min-width: 481px) {
        .chat-container {
          height: 80vh; /* Limit height to 80% of viewport height */
          max-height: 600px; /* Set a maximum height */
          bottom: 70px; /* Adjust bottom position to keep it above the chat button */
        }
      }
  
      @media (max-height: 500px) and (min-width: 481px) {
        .chat-container {
          height: 70vh; /* Even smaller height percentage */
          bottom: 60px; /* Move slightly higher */
        }
      }
      
      @media (max-width: 480px) {
        .chat-container {
          width: 100%;
          height: 100%;
          bottom: 0;
          right: 0;
          border-radius: 0;
        }
        
        .chat-header {
          border-radius: 0;
        }
      }
    `;

  shadow.appendChild(styleElement);

  // ===============================================
  // CREATE UI ELEMENTS & STATE MANAGEMENT
  // ===============================================
  // State management
  const state = {
    chatHistory: [],
    hasDisplayedWelcomeMessage: false,
    selectedAssistant: null,
    isOnAssistantScreen: true,
  };

  // Create UI elements
  // Chat button (always visible)
  const chatbotButton = document.createElement("div");
  chatbotButton.className = "chat-button";
  chatbotButton.setAttribute("role", "button");
  chatbotButton.setAttribute("aria-label", "Open chat");
  chatbotButton.innerHTML = ICONS.chatBubble;
  shadow.appendChild(chatbotButton);

  // Chat container (hidden by default)
  const chatbotContainer = document.createElement("div");
  chatbotContainer.className = "chat-container";
  shadow.appendChild(chatbotContainer);

  // Assistant picker container
  const assistantPicker = document.createElement("div");
  assistantPicker.className = "assistant-picker";
  assistantPicker.style.display = "none"; // hidden until opened
  chatbotContainer.appendChild(assistantPicker);

  // Create header
  const header = document.createElement("div");
  header.className = "chat-header";

  // Left section with logo and text
  const leftSection = document.createElement("div");
  leftSection.className = "header-left";

  // Back button (chevron)
  const headerBackButton = document.createElement("div");
  headerBackButton.className = "header-back-button";
  headerBackButton.setAttribute("role", "button");
  headerBackButton.setAttribute("aria-label", "Back to assistant selection");
  headerBackButton.innerHTML = ICONS.chevronLeft;

  // Logo
  const logo = document.createElement("img");
  logo.className = "header-logo";
  logo.src = CONFIG.LOGO_URL || "";
  logo.alt = "Company Logo";
  logo.onerror = () => {
    console.warn("Logo failed to load:", CONFIG.LOGO_URL);
    logo.style.display = "none";
  };

  // Text container
  const textContainer = document.createElement("div");
  textContainer.className = "header-text";

  // Title
  const title = document.createElement("div");
  title.className = "header-title";
  title.innerText = CONFIG.CHAT_TITLE || "Chat";

  // Subtitle
  const subtitle = document.createElement("div");
  subtitle.className = "header-subtitle";
  subtitle.innerText = CONFIG.CHAT_SUBTITLE || "";

  // Right section with reset and close buttons
  const rightSection = document.createElement("div");
  rightSection.className = "header-actions";

  // Reset button (trash icon)
  const resetBtnContainer = document.createElement("div");
  resetBtnContainer.className = "tooltip-container";

  // Create the reset button
  const resetBtn = document.createElement("div");
  resetBtn.className = "reset-button";
  resetBtn.innerHTML = ICONS.trashIcon;
  resetBtn.setAttribute("role", "button");
  resetBtn.setAttribute("aria-label", "Reset chat");

  // Create the tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = "Verlauf löschen";

  // Assemble the tooltip container
  resetBtnContainer.appendChild(resetBtn);
  resetBtnContainer.appendChild(tooltip);

  // Close button
  const closeBtn = document.createElement("div");
  closeBtn.className = "close-button";
  closeBtn.innerHTML = "×";
  closeBtn.setAttribute("role", "button");
  closeBtn.setAttribute("aria-label", "Close chat");

  // Assemble header
  textContainer.appendChild(title);
  textContainer.appendChild(subtitle);
  leftSection.appendChild(headerBackButton);
  leftSection.appendChild(logo);
  leftSection.appendChild(textContainer);
  rightSection.appendChild(resetBtnContainer);
  rightSection.appendChild(closeBtn);
  header.appendChild(leftSection);
  header.appendChild(rightSection);
  chatbotContainer.appendChild(header);

  // Create a messages container
  const messagesContainer = document.createElement("div");
  messagesContainer.className = "messages-container";
  chatbotContainer.appendChild(messagesContainer);

  // Scroll to bottom button
  const scrollDownBtn = document.createElement("div");
  scrollDownBtn.className = "scroll-down-btn";
  scrollDownBtn.innerHTML = ICONS.scrollDown;
  scrollDownBtn.setAttribute("role", "button");
  scrollDownBtn.setAttribute("aria-label", "Scroll to bottom");
  chatbotContainer.appendChild(scrollDownBtn);

  // Create an input bar
  const inputBar = document.createElement("div");
  inputBar.className = "input-bar";
  chatbotContainer.appendChild(inputBar);

  // Input container with rounded borders
  const inputFieldContainer = document.createElement("div");
  inputFieldContainer.className = "input-field-container";
  inputBar.appendChild(inputFieldContainer);

  // Input field
  const inputField = document.createElement("input");
  inputField.className = "input-field";
  inputField.placeholder = CONFIG.INPUT_PLACEHOLDER;
  inputField.setAttribute("aria-label", "Message input");
  inputFieldContainer.appendChild(inputField);

  // Send button
  const sendButton = document.createElement("div");
  sendButton.className = "send-button";
  sendButton.setAttribute("role", "button");
  sendButton.setAttribute("aria-label", "Send message");
  sendButton.innerHTML = ICONS.send;
  inputFieldContainer.appendChild(sendButton);

  // ===============================================
  // HELPER FUNCTIONS - UI ELEMENT CREATION
  // ===============================================
  // Create agent header with image and name
  function createAgentHeader() {
    if (!state.selectedAssistant) {
      const defaultHeader = document.createElement("div");
      defaultHeader.className = "agent-info-container";
      const defaultText = document.createElement("div");
      defaultText.className = "agent-text";
      defaultText.textContent = "Assistant";
      defaultHeader.appendChild(defaultText);
      return defaultHeader;
    }

    const agentInfoContainer = document.createElement("div");
    agentInfoContainer.className = "agent-info-container";

    const agentImage = document.createElement("img");
    agentImage.className = "agent-image";
    agentImage.src = state.selectedAssistant.icon || "";
    agentImage.alt = `${state.selectedAssistant.name || "Assistant"} avatar`;
    agentImage.onerror = () => {
      // Fallback to a default icon
      agentImage.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230062A2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M12 16v-4'%3E%3C/path%3E%3Cpath d='M12 8h.01'%3E%3C/path%3E%3C/svg%3E";
    };

    const agentText = document.createElement("div");
    agentText.className = "agent-text";
    agentText.textContent = state.selectedAssistant.name || "Assistant";

    agentInfoContainer.appendChild(agentImage);
    agentInfoContainer.appendChild(agentText);

    return agentInfoContainer;
  }

  // Create typing indicator
  function createTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    indicator.setAttribute("aria-label", "Assistant is typing");

    // Add three dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span");
      indicator.appendChild(dot);
    }

    return indicator;
  }

  // Add the "Neu" divider
  function addNeuDivider() {
    // Remove any existing "Neu" dividers first
    const existingDividers = messagesContainer.querySelectorAll(".neu-divider");
    existingDividers.forEach((divider) => {
      divider.remove();
    });

    // Create the divider container
    const divider = document.createElement("div");
    divider.className = "neu-divider";

    // Create the "Neu" text element
    const neuText = document.createElement("span");
    neuText.className = "neu-divider-text";
    neuText.innerText = "Neu";

    // Add the text to the divider
    divider.appendChild(neuText);

    return divider;
  }

  // Create assistant card for the picker
  function createAssistantCard(assistant) {
    if (!assistant) return document.createElement("div"); // Return empty div if assistant is undefined

    // Card frame
    const card = document.createElement("div");
    card.className = "assistant-card";
    card.addEventListener("click", () => chooseAssistant(assistant));

    // Left side: icon + name row
    const leftSide = document.createElement("div");
    leftSide.className = "assistant-card-left";

    // Top row with icon and name
    const topRow = document.createElement("div");
    topRow.className = "assistant-card-top";

    // Avatar
    const avatar = document.createElement("img");
    avatar.className = "assistant-avatar";
    avatar.src = assistant.icon || "";
    avatar.alt = `${assistant.name || "Assistant"} avatar`;
    avatar.onerror = () => {
      console.warn("Assistant icon failed to load:", assistant.icon);
      // Use a fallback icon or hide
      avatar.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230062A2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M12 16v-4'%3E%3C/path%3E%3Cpath d='M12 8h.01'%3E%3C/path%3E%3C/svg%3E";
    };

    // Name
    const name = document.createElement("div");
    name.className = "assistant-name";
    name.textContent = assistant.name || "Assistant";

    topRow.appendChild(avatar);
    topRow.appendChild(name);

    // Description
    const description = document.createElement("div");
    description.className = "assistant-description";

    if (assistant.description) {
      description.textContent = assistant.description;
    } else {
      description.style.height = "20px"; // Empty space for consistency
    }

    leftSide.appendChild(topRow);
    leftSide.appendChild(description);

    // Right side: arrow button
    const arrowBtn = document.createElement("div");
    arrowBtn.className = "assistant-card-arrow";

    arrowBtn.innerHTML = `
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 8C0 3.58172 3.58172 0 8 0H36C40.4183 0 44 3.58172 44 8V36C44 40.4183 40.4183 44 36 44H8C3.58172 44 0 40.4183 0 36V8Z" fill="white"/>
          <g clip-path="url(#clip0_10099_105064)">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M30.9252 13.0774C31.1516 13.3038 31.2282 13.6398 31.1225 13.942L25.2892 30.6086C25.1763 30.9311 24.878 31.1521 24.5366 31.166C24.1952 31.1799 23.8799 30.984 23.7411 30.6718L20.5379 23.4647L13.3308 20.2615C13.0186 20.1227 12.8227 19.8074 12.8366 19.466C12.8506 19.1246 13.0715 18.8263 13.394 18.7135L30.0606 12.8801C30.3628 12.7744 30.6988 12.851 30.9252 13.0774ZM15.9285 19.5922L21.5077 22.0718C21.6963 22.1556 21.847 22.3064 21.9308 22.4949L24.4104 28.0741L28.9776 15.025L15.9285 19.5922Z"
                  fill="#0195D5"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M30.9252 13.0774C31.2506 13.4029 31.2506 13.9305 30.9252 14.2559L21.7585 23.4226C21.4331 23.748 20.9055 23.748 20.58 23.4226C20.2546 23.0972 20.2546 22.5695 20.58 22.2441L29.7467 13.0774C30.0721 12.752 30.5998 12.752 30.9252 13.0774Z"
                  fill="#0195D5"/>
          </g>
          <defs>
            <clipPath id="clip0_10099_105064">
              <rect width="20" height="20" fill="white" transform="translate(12 12)"/>
            </clipPath>
          </defs>
        </svg>
      `;

    // Assemble card
    card.appendChild(leftSide);
    card.appendChild(arrowBtn);

    return card;
  }

  // Build the assistant picker interface
  function buildAssistantPicker() {
    assistantPicker.innerHTML = "";

    // Custom logo-only header
    const header = document.createElement("div");
    header.className = "assistant-picker-header";

    const logoImg = document.createElement("img");
    logoImg.src = CONFIG.LOGO_URL || "";
    logoImg.className = "header-logo";
    logoImg.alt = "Company Logo";
    logoImg.onerror = () => {
      console.warn("Logo failed to load:", CONFIG.LOGO_URL);
      // Use a fallback logo or hide
      logoImg.style.display = "none";
    };

    header.appendChild(logoImg);
    assistantPicker.appendChild(header);

    // Intro text
    const introContainer = document.createElement("div");
    introContainer.className = "intro-container";

    // Check if PICKER_GREETING and its properties exist before using them
    const pickerGreeting = CONFIG.PICKER_GREETING || {};

    // First line
    const line1 = document.createElement("div");
    line1.className = "intro-line1";
    line1.textContent = pickerGreeting.LINE1 || "Hallo 🚀";

    // Second line
    const line2 = document.createElement("div");
    line2.className = "intro-line2";
    line2.textContent = pickerGreeting.LINE2 || "Wie können wir helfen?";

    // Body copy
    const introCopy = document.createElement("div");
    introCopy.className = "intro-copy";
    introCopy.textContent =
      pickerGreeting.DESCRIPTION || "Bitte wählen Sie einen Assistenten.";

    // Assemble intro
    introContainer.appendChild(line1);
    introContainer.appendChild(line2);
    introContainer.appendChild(introCopy);
    assistantPicker.appendChild(introContainer);

    // Add assistant cards
    (CONFIG.ASSISTANTS || []).forEach((assistant) => {
      assistantPicker.appendChild(createAssistantCard(assistant));
    });
  }

  // ===============================================
  // HELPER FUNCTIONS - UI STATES
  // ===============================================
  // Switch to assistant picker screen
  function enterAssistantScreen() {
    state.isOnAssistantScreen = true;
    assistantPicker.style.display = "block";
    header.style.display = "none";
    messagesContainer.style.display = "none";
    inputBar.style.display = "none";

    // Hide scroll down button when in assistant picker screen
    scrollDownBtn.style.display = "none";
  }

  // Switch to chat screen
  function enterChatScreen() {
    state.isOnAssistantScreen = false;
    assistantPicker.style.display = "none";
    header.style.display = "flex";
    messagesContainer.style.display = "block";
    inputBar.style.display = "flex";
    displayWelcomeMessage();
  }

  // Choose assistant and enter chat
  function chooseAssistant(assistant) {
    // Clear any existing chat history
    state.chatHistory = [];

    // Clear any existing messages in the UI
    messagesContainer.innerHTML = "";

    // Reset welcome message flag
    state.hasDisplayedWelcomeMessage = false;

    // Set the selected assistant
    state.selectedAssistant = assistant;

    // Enter chat screen with fresh history
    enterChatScreen();
  }

  function parseMarkdown(text) {
    if (!text) return "";

    // Step 1: Handle Markdown-style links [text](url) - keeping your existing logic
    const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let processedText = text.replace(
      markdownRegex,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Step 2: Handle plain URLs not already in HTML tags
    const urlRegex = /(?<!href="|">)(https?:\/\/[^\s]+)(?!<\/a>)/g;
    let finalText;
    try {
      finalText = processedText.replace(
        urlRegex,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
    } catch (e) {
      // Fallback for browsers without negative lookbehind support
      const simpleUrlRegex = /(https?:\/\/[^\s]+)(?!\)|">)/g;
      finalText = processedText.replace(
        simpleUrlRegex,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
    }

    // Step 3: Handle bold text with double asterisks or double underscores
    finalText = finalText.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    finalText = finalText.replace(/__([^_]+)__/g, "<strong>$1</strong>");

    // Step 4: Handle italic text with single asterisks or single underscores
    finalText = finalText.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    finalText = finalText.replace(/_([^_]+)_/g, "<em>$1</em>");

    // Step 5: Handle numbered lists - look for patterns like "1. " at the start of lines
    finalText = finalText.replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>");
    // Wrap consecutive list items in <ol> tags
    finalText = finalText.replace(/(<li>.+<\/li>\n?)+/g, "<ol>$&</ol>");

    // Step 6: Handle bullet lists - look for patterns like "- " at the start of lines
    finalText = finalText.replace(/^[\-\*]\s(.+)$/gm, "<li>$1</li>");
    // Wrap consecutive list items in <ul> tags
    finalText = finalText.replace(/(<li>.+<\/li>\n?)+/g, function (match) {
      // Only wrap in <ul> if not already wrapped in <ol>
      if (!match.includes("<ol>")) {
        return "<ul>" + match + "</ul>";
      }
      return match;
    });

    // Step 7: Convert newlines to <br> tags (except within lists)
    finalText = finalText.replace(/(?<!\<\/li\>)\n/g, "<br>");

    return finalText;
  }

  // Simulate typing effect for bot responses
  const simulateTypingInBubble = (message, messageContentElement) => {
    // For typing animation, we'll work with plain text
    let plainText = message;
    let index = 0;
    const typingSpeed = 10; // ms per character

    const interval = setInterval(() => {
      if (index < plainText.length) {
        // During typing animation, show plain text version
        messageContentElement.innerText = plainText.slice(0, index + 1);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        index++;
      } else {
        // When typing is complete, replace with HTML version containing links
        messageContentElement.innerHTML = parseMarkdown(message);
        clearInterval(interval);
        scrollDownBtn.style.display = "none";
      }
    }, typingSpeed);
  };

  // Add the function to create suggested questions UI
  function displaySuggestedQuestions() {
    // Only show suggested questions if we have a selected assistant with questions
    if (
      !state.selectedAssistant ||
      !state.selectedAssistant.suggestedQuestions ||
      state.selectedAssistant.suggestedQuestions.length === 0
    ) {
      return;
    }

    // Create container for suggested questions
    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.className = "suggested-questions-container";
    suggestionsContainer.id = "suggested-questions-container";

    // Group questions into rows (optional, can be adjusted)
    const questions = state.selectedAssistant.suggestedQuestions;

    // Create a single row for all questions
    const questionRow = document.createElement("div");
    questionRow.className = "suggested-question-row";

    // Add each question as a bubble
    questions.forEach((question) => {
      const bubble = document.createElement("div");
      bubble.className = "suggested-question-bubble";
      bubble.textContent = question;
      bubble.setAttribute("role", "button");
      bubble.setAttribute("tabindex", "0");

      // Add click event to handle selection
      bubble.addEventListener("click", () => {
        handleSuggestedQuestionClick(question);
      });

      // Add keyboard accessibility
      bubble.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSuggestedQuestionClick(question);
        }
      });

      questionRow.appendChild(bubble);
    });

    suggestionsContainer.appendChild(questionRow);

    // Add the suggestions to the messages container
    messagesContainer.appendChild(suggestionsContainer);

    // Scroll to make sure suggestions are visible
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Handle when a suggested question is clicked
  function handleSuggestedQuestionClick(question) {
    // Fill the input field with the selected question
    inputField.value = question;

    // Send the message
    handleSendMessage();

    // Remove all suggested questions from the UI
    removeSuggestedQuestions();
  }

  // Function to remove suggested questions
  function removeSuggestedQuestions() {
    const suggestionsContainer = shadow.getElementById(
      "suggested-questions-container"
    );
    if (suggestionsContainer && suggestionsContainer.parentNode) {
      suggestionsContainer.parentNode.removeChild(suggestionsContainer);
    }
  }

  // Display welcome message
  const displayWelcomeMessage = () => {
    if (state.hasDisplayedWelcomeMessage) return;

    const wrapper = document.createElement("div");
    wrapper.className = "bot-message-wrapper";

    const bubble = document.createElement("div");
    bubble.className = "bot-message-bubble";

    // Add agent header
    bubble.appendChild(createAgentHeader());

    // Create and add the message body with HTML links
    const body = document.createElement("div");
    body.innerHTML = parseMarkdown(state.selectedAssistant.welcome);
    bubble.appendChild(body);

    wrapper.appendChild(bubble);
    messagesContainer.appendChild(wrapper);

    state.hasDisplayedWelcomeMessage = true;

    // Add welcome message to chat history
    state.chatHistory.push({
      role: "bot",
      content: state.selectedAssistant.welcome,
    });

    // Display suggested questions after welcome message
    displaySuggestedQuestions();
  };

  // ===============================================
  // API and Message Handling
  // ===============================================
  // Send message to API and handle response
  const sendMessageToAPI = async (userMessage) => {
    try {
      // Get the current assistant ID
      const assistantId = state.selectedAssistant
        ? state.selectedAssistant.id
        : null;

      // Prepare the data to send
      const requestData = {
        messages: state.chatHistory,
        assistantId: assistantId, // Add the assistant ID to the request
      };

      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      return data.response || CONFIG.ERROR_MESSAGE;
    } catch (error) {
      console.error("API Error:", error.message);
      return CONFIG.ERROR_MESSAGE;
    }
  };

  // Handle sending user message and getting response
  const handleSendMessage = async () => {
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    // Remove any suggested questions when user sends a message
    removeSuggestedQuestions();

    // Remove any existing "Neu" dividers
    const existingDividers = shadow.querySelectorAll(".neu-divider");
    existingDividers.forEach((divider) => {
      divider.remove();
    });

    // Add user's message to chat history
    state.chatHistory.push({
      role: "user",
      content: userMessage,
      references: [],
      sources: [],
    });

    // Display the user's message
    const userMessageContainer = document.createElement("div");
    userMessageContainer.className = "user-message-container";

    const userMessageElem = document.createElement("div");
    userMessageElem.className = "user-message";
    userMessageElem.innerText = userMessage;

    userMessageContainer.appendChild(userMessageElem);
    messagesContainer.appendChild(userMessageContainer);

    // Create the bot's message container with typing indicator
    const botMessageWrapper = document.createElement("div");
    botMessageWrapper.className = "bot-message-wrapper";

    // Bot message bubble
    const botMessageBubble = document.createElement("div");
    botMessageBubble.className = "bot-message-bubble";

    // Add agent header
    const agentInfoContainer = createAgentHeader();

    // Create typing indicator
    const typingContainer = document.createElement("div");
    typingContainer.appendChild(createTypingIndicator());

    // Add agent info and typing indicator to the bubble
    botMessageBubble.appendChild(agentInfoContainer);
    botMessageBubble.appendChild(typingContainer);

    // Add the message bubble to the wrapper
    botMessageWrapper.appendChild(botMessageBubble);
    messagesContainer.appendChild(botMessageWrapper);

    // Clear input field and hide send button
    inputField.value = "";
    sendButton.style.display = "none";

    // Scroll to the bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    scrollDownBtn.style.display = "none";

    // Get API response
    const responseText = await sendMessageToAPI(userMessage);

    // Create Neu divider
    const neuDivider = addNeuDivider();

    // Replace typing indicator with actual message content
    const messageContent = document.createElement("div");

    // Remove typing indicator
    if (typingContainer && typingContainer.parentNode === botMessageBubble) {
      botMessageBubble.removeChild(typingContainer);
    }

    // Add the neu divider before the bot message
    messagesContainer.insertBefore(neuDivider, botMessageWrapper);

    // Add message content placeholder
    botMessageBubble.appendChild(messageContent);

    // Simulate typing effect
    simulateTypingInBubble(responseText, messageContent);

    // Add bot's response to chat history
    state.chatHistory.push({
      role: "bot",
      content: responseText,
    });
  };

  // ===============================================
  // EVENT LISTENERS
  // ===============================================
  // Show/hide send button based on input
  inputField.addEventListener("input", () => {
    sendButton.style.display = inputField.value.trim() ? "flex" : "none";
  });

  // Send message on button click
  sendButton.addEventListener("click", handleSendMessage);

  // Send message on Enter key
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Toggle chat visibility on button click
  chatbotButton.addEventListener("click", () => {
    const isVisible = chatbotContainer.style.display === "flex";

    if (!isVisible) {
      chatbotContainer.style.display = "flex";

      // If an assistant is already selected, return to chat screen
      if (state.selectedAssistant) {
        enterChatScreen();
      } else if (CONFIG.ASSISTANTS.length === 1) {
        // If only one assistant, auto-select it
        state.selectedAssistant = CONFIG.ASSISTANTS[0];
        enterChatScreen();
      } else {
        // Otherwise show assistant picker
        buildAssistantPicker();
        enterAssistantScreen();
      }

      chatbotButton.innerHTML = ICONS.downArrow;
      chatbotButton.setAttribute("aria-label", "Close chat");
    } else {
      chatbotContainer.style.display = "none";
      chatbotButton.innerHTML = ICONS.chatBubble;
      chatbotButton.setAttribute("aria-label", "Open chat");
    }
  });

  // Handle close button click
  closeBtn.addEventListener("click", () => {
    chatbotContainer.style.display = "none";
    chatbotButton.innerHTML = ICONS.chatBubble;
    chatbotButton.setAttribute("aria-label", "Open chat");
    // We don't reset selectedAssistant here to maintain the current chat state
  });

  resetBtn.addEventListener("click", () => {
    // Clear chat history
    state.chatHistory = [];

    // Clear messages container
    messagesContainer.innerHTML = "";

    // Reset welcome message flag
    state.hasDisplayedWelcomeMessage = false;

    // Display welcome message again
    displayWelcomeMessage();
  });

  // Scroll to bottom button click
  scrollDownBtn.addEventListener("click", () => {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: "smooth",
    });
  });

  // Show/hide scroll button based on scroll position
  messagesContainer.addEventListener("scroll", () => {
    const atBottom =
      messagesContainer.scrollHeight - messagesContainer.scrollTop <=
      messagesContainer.clientHeight + 40;

    scrollDownBtn.style.display = atBottom ? "none" : "flex";
  });

  // 5. Add event listener to handle going back to assistant picker
  headerBackButton.addEventListener("click", () => {
    // Clear chat history
    state.chatHistory = [];
    // Clear selected assistant
    state.selectedAssistant = null;
    // Reset welcome message flag
    state.hasDisplayedWelcomeMessage = false;
    // Clear messages container
    messagesContainer.innerHTML = "";
    // Show assistant picker
    buildAssistantPicker();
    enterAssistantScreen();
  });

  // Optional: Add a function to toggle the back button visibility
  function toggleBackButton(show) {
    // Show or hide the back button
    headerBackButton.style.display = show ? "flex" : "none";

    // Adjust the input field padding based on back button visibility
    /*if (show) {
        inputField.style.paddingLeft = "40px";
      } else {
        inputField.style.paddingLeft = "0";
      }*/
  }

  // Optional: Initially hide back button if there's only one assistant
  if (CONFIG.ASSISTANTS.length <= 1) {
    toggleBackButton(false);
  } else {
    toggleBackButton(true);
  }

  // Check for responsive design adjustments
  const checkResponsive = () => {
    if (window.innerWidth <= 480) {
      chatbotContainer.style.borderRadius = "0";
      header.style.borderRadius = "0";
    } else {
      chatbotContainer.style.borderRadius = "16px";
      header.style.borderTopLeftRadius = "16px";
      header.style.borderTopRightRadius = "16px";
    }
  };

  window.addEventListener("resize", checkResponsive);
  checkResponsive();

  // ===============================================
  // INITIALIZATION
  // ===============================================
  // Build the assistant picker
  buildAssistantPicker();

  // Add the widget container to the document body
  document.body.appendChild(widgetContainer);

  console.log("Improved 506.ai Shadow DOM Chatbot initialized!");
})(myCustomConfig);
