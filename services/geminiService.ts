
import { GoogleGenAI } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWorkflowAdvice = async (stage: string, context: string) => {
  const prompt = `You are a senior Interior Design Consultant specializing in the Kenyan market. 
  The user is currently at the stage: "${stage}".
  User context/question: "${context}"
  
  Please provide professional advice tailored to Kenya (mentioning things like local suppliers, NCA regulations, Nairobi/Mombasa/Kisumu logistics, or specific Kenyan material preferences like Mazeras stone or cypress wood) if relevant.
  Keep it concise, actionable, and professional.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm sorry, I couldn't generate advice right now. Please check your connection and try again.";
  }
};

export const generateProjectProposal = async (projectDetails: { name: string, client: string, location: string }) => {
  const prompt = `Act as a world-class senior interior designer. Create a comprehensive project proposal for:
  Project: ${projectDetails.name}
  Client: ${projectDetails.client}
  Location: ${projectDetails.location}
  
  Follow this specific structure:
  1. Identify the top 5 most important stakeholders for this specific project in the Kenyan context.
  2. Detail current problems (assumed for this type of project), what we aim to achieve (goals), and a projected timeline (in weeks).
  3. A presentation plan to the stakeholders including setting up the next meeting.
  
  Use professional language and format with Markdown. Highlight Kenyan-specific considerations.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Proposal Error:", error);
    return "Failed to generate proposal. Please try again.";
  }
};
