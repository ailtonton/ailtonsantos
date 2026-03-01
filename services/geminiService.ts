
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async analyzeProductImage(base64Image: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: "Identifique este produto de ferramentas para comunicação visual. Retorne apenas o nome provável do item." }
          ]
        }
      });
      return response.text || "Produto não identificado";
    } catch (error) {
      console.error("Gemini Image Error:", error);
      return "Erro na identificação";
    }
  },

  async generateProductDescription(productName: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva uma descrição técnica B2B persuasiva para o produto: ${productName}. Foco em durabilidade e eficiência para o lojista.`,
      });
      return response.text || "";
    } catch (error) {
      console.error("Gemini Text Error:", error);
      return "Descrição indisponível.";
    }
  }
};
