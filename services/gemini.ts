
import { GoogleGenAI, Modality, Type } from "@google/genai";

export class GeminiService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }

  async generateTTS(text: string): Promise<string> {
    try {
      if (!text) throw new Error("No text provided for TTS");
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("API returned no audio data");
      return `data:audio/pcm;base64,${base64Audio}`;
    } catch (error: any) {
      console.error("TTS Service Error:", error);
      throw new Error(error.message || "Failed to generate audio.");
    }
  }

  async generateSketch(subject: string, type: 'word' | 'picture'): Promise<string> {
    try {
      const ai = this.getClient();
      // Refined prompt to match the physical cards provided in the user's photo
      const prompt = `A single, bold, minimalist black-and-white ink line drawing of a "${subject}". 
      STYLE: Thick felt-tip marker lines, high contrast, hand-drawn sketch feel, strictly NO shading, NO colors, NO background (pure white background). 
      Format: Iconographic and simple, similar to official Goethe-Zertifikat A1 Sprechen exam cards. 
      Do not include any text or words in the image.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data found in response");
    } catch (error) {
      console.error("Sketch generation failed:", error);
      return "";
    }
  }

  async gradeWriting(task: string, input: string): Promise<{ score: number; feedback: string }> {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: `You are an official Goethe A1 examiner. Grade the following student writing.
        Task: ${task}
        Student Input: ${input}
        Provide JSON: 'score' (0-10) and 'feedback' (English and German).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING }
            },
            required: ["score", "feedback"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      return { score: 0, feedback: "Grading failed." };
    }
  }

  async getWritingAnalysis(task: string, input: string, example: string): Promise<string> {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: `Analyze German A1 writing: Task: ${task}, Example: ${example}, Student: ${input}. Provide English/German tips.`,
      });
      return response.text || "No analysis.";
    } catch (error) {
      return "Analysis unavailable.";
    }
  }
}

export const gemini = new GeminiService();
