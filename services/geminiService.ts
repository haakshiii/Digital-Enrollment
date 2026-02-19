
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeODDocument = async (base64Image: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: "Analyze this document for an On-Duty (OD) pass application. Check if it contains signs of a Mentor, HOD, and if it's a participation certificate or a formal letter. Return a JSON report." },
            { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            detectedSignatures: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            documentType: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["isValid", "detectedSignatures", "documentType", "summary"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { isValid: false, summary: "Could not analyze document at this time.", detectedSignatures: [], documentType: "Unknown" };
  }
};

export const getAttendanceInsights = async (attendanceRate: number) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `My current attendance is ${attendanceRate}%. Give me 3 short professional tips to maintain or improve it for my academic record.`
    });
    return response.text;
  } catch (error) {
    return "Keep showing up consistently to maintain your academic performance!";
  }
};
