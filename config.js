// Define custom configuration for LinzAG Power and Fitness
const myCustomConfig = {
  // Logo and brand information
  LOGO_URL:
    "https://scontent.flnz1-1.fna.fbcdn.net/v/t39.30808-6/357435960_586162237007022_724166053179017089_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pCphpwoRU8EQ7kNvwHrBr-r&_nc_oc=AdkM8wBw_ygypTp7vbMxLQJWn9j0tMC6CAUZvg1eoocZY3v61_bl7b-3FRnYEB0bO7A&_nc_zt=23&_nc_ht=scontent.flnz1-1.fna&_nc_gid=ygenS5pw_wHY0Fo6_FgEbA&oh=00_AfG1_9v22yWhJheDC41818MRaL5K05uIvMsE7AaKfQbq7Q&oe=6810ED36", // LinzAG logo (more professional)
  CHAT_TITLE: "FITNESS & POWER",
  CHAT_SUBTITLE: "Dein virtueller Assistent",

  // Assistant-picker intro text
  PICKER_GREETING: {
    LINE1: "Hallo Sportfreund! 💪",
    LINE2: "Wie können wir dir helfen?",
    DESCRIPTION:
      "Hier findest du Antworten zu unseren Angeboten, Kursen, Öffnungszeiten und allem rund um die Sektion Fitness & Power.",
  },

  // Color scheme - Customizable colors (blue and energetic)
  COLORS: {
    primary: "#005caa", // LinzAG blue
    botBg: "#EAF8FD", // Light blue background
    botText: "#253246", // Dark text for readability
    userBg: "#0195D5", // Slightly lighter blue for user bubbles
    userText: "#FFFFFF", // White text for contrast
  },

  // UI text
  ERROR_MESSAGE:
    "Entschuldigung, etwas ist schiefgelaufen. Bitte versuche es später noch einmal.",
  INPUT_PLACEHOLDER: "Stelle eine Frage zum Sport...",

  // API endpoint
  API_ENDPOINT: "http://127.0.0.1:5000/api/v1/private/chat",

  // Assistants configuration
  ASSISTANTS: [
    {
      id: "assistant-LinzAG-Sport",
      name: "AI Assistant",
      icon: "https://scontent.flnz1-1.fna.fbcdn.net/v/t39.30808-6/357435960_586162237007022_724166053179017089_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pCphpwoRU8EQ7kNvwHrBr-r&_nc_oc=AdkM8wBw_ygypTp7vbMxLQJWn9j0tMC6CAUZvg1eoocZY3v61_bl7b-3FRnYEB0bO7A&_nc_zt=23&_nc_ht=scontent.flnz1-1.fna&_nc_gid=ygenS5pw_wHY0Fo6_FgEbA&oh=00_AfG1_9v22yWhJheDC41818MRaL5K05uIvMsE7AaKfQbq7Q&oe=6810ED36", // Dumbbell icon
      welcome:
        "Willkommen bei der Sektion Fitness & Power der LinzAG! 💪\n\nIch bin dein virtueller Assistent und beantworte gerne deine Fragen zu unseren Angeboten, Öffnungszeiten und Mitgliedschaften. Wie kann ich dir heute helfen?",
      suggestedQuestions: [
        "Wann findet das Sommerfest statt?",
        "Wie kann ich der Sektion beitreten?",
        "Wie sind die Öffnungszeiten?",
      ],
    },
  ],
};
