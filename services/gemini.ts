import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMockup = async (
  logoBase64: string,
  productType: string,
  style: string,
  additionalPrompt: string
): Promise<string> => {
  try {
    const prompt = `Generate a professional, high-quality product photography shot of a ${productType}. 
    The product MUST prominently feature the logo provided in the input image. 
    The logo should be realistically applied to the surface of the ${productType}, respecting lighting, shadows, and texture.
    Setting: ${style}.
    ${additionalPrompt ? `Additional details: ${additionalPrompt}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: logoBase64,
              mimeType: 'image/png', // Assuming PNG for logos, but flexible
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Mockup generation failed:", error);
    throw error;
  }
};

export const editImage = async (
  imageBase64: string,
  instruction: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: 'image/png',
            },
          },
          { text: instruction },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned from edit");
  } catch (error) {
    console.error("Image editing failed:", error);
    throw error;
  }
};

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio = '1:1'
): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (imageBytes) {
      return `data:image/jpeg;base64,${imageBytes}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
