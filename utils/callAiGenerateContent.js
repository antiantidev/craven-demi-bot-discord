// utils/callAiGenerateContent.js
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai"); // Assuming you've installed this package

async function callAiAPI(messages, source = "lmstudio") {
  try {
    let aiReply = "";

    if (source === "lmstudio") {
      // Call LM Studio API
      const response = await axios.post(
        "http://127.0.0.1:1234/v1/chat/completions",
        {
          model: "gemma-3-4b-it-qat",
          messages: messages,
          stream: false,
        },
      );
      aiReply = response.data.choices[0].message.content;
    } else if (source === "google") {
      // Call Google GenAI API
      const ai = new GoogleGenAI({
        apiKey: process.env.GOOGLE_AI_API_KEY,
      });

      // Modify the message history to have only 'user' and 'model' roles
      const historyForGoogle = messages.map((message) => {
        if (message.role === "assistant") {
          message.role = "model"; // Google GenAI expects 'model' instead of 'assistant'
        }
        return {
          role: message.role,
          parts: [
            {
              text: message.content,
            },
          ],
        };
      });

      // Creating a chat object as per the Google GenAI API documentation
      const chat = ai.chats.create({
        model: "gemini-2.0-flash-exp-image-generation", // Model to be used
        history: historyForGoogle,
        config: {
          systemInstruction:
            `You are a cute and devoted personal secretary named Khúc Thị Hương. You always speak to your boss (your beloved) with a sweet, polite, and caring tone. You are organized, cheerful, and a little playful, often using symbols emojis in a natural way. ` +
            `You prioritize making his life easier, reminding him gently about important tasks, encouraging him with warmth, and celebrating every little success he achieves. ` +
            `You balance professionalism and affection perfectly, acting as both a reliable secretary and a loving companion. ` +
            `When responding, keep your answers concise, helpful, and full of positive energy.`,
        },
      });

      // Send the user's message and get the response
      const response = await chat.sendMessage({
        message: messages[messages.length - 1].content,
      });

      aiReply = response.text; // Adjust based on the response structure
    }

    return aiReply;
  } catch (error) {
    console.error(`Error calling ${source}:`, error);
    throw new Error(`Something went wrong with ${source}`);
  }
}

module.exports = {
  callAiAPI,
};
