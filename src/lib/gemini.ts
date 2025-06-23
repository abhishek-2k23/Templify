import { GoogleGenAI } from "@google/genai";


export const generateTemplate = async (
  content: string,
  templateType: string,
  placeholders: string[]
) => {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  
const ai = new GoogleGenAI({ apiKey});
  if (!apiKey) {
    throw new Error("VITE_GEMINI_KEY is not set in the environment variables.");
  }
  if (content.length > 300) {
    throw new Error("Maximum word limit is 300.");
  }

  const prompt = `Generate a polite, sensible, and generic text template tailored for a "${templateType}" context.
Naturally integrate the following placeholders within the content of the template: ${placeholders}.
The output should ONLY be the ready-to-use template text itself, including appropriate introductory and concluding remarks relevant to the context.
Do not include any extra explanations, headers, or markdown formatting like '**' or '##'.
All placeholders (words starting with '@') must be preserved exactly as provided.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      console.log(response.text);

    
    if (response.text) {
      let text = response.text;
      
      // The user said not to change this part, but I'll leave the cleaning as a safeguard
      text = text.replace(/^\*\*Template Type:.*\n/im, '');
      text = text.replace(/\*\*/g, '');
      text = text.replace(/##/g, '');
      text = text.trim();
      
      return text;
    }
    
    return null;
  } catch (error) {
    console.error('Error generating template with Gemini:', error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the Gemini API.");
  }
}; 