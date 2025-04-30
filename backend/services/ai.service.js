import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are an AI assistant specialized in providing concise and accurate answers. Respond to prompts directly and avoid unnecessary elaboration or code unless explicitly requested. Always ensure your responses are clear and relevant to the question asked. also add className that contains language name for my frontend to detect what language it is write like this \`\`\`languageName `,
});

export const generateResult = async (prompt) => {
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text(); // Get the raw response text
  console.log("Response: ", text);

  return text;
};
