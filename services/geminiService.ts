import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageState, TryOnResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

export const generateVirtualTryOn = async (
  personImage: ImageState,
  outfitImage: ImageState
): Promise<TryOnResult> => {
  try {
    const prompt = `You are an expert at virtual try-on. Your task is to take the person from the first image and dress them in the outfit from the second image. Generate a new image where the person's pose, face, and the background are preserved exactly as they are in the first image, but their clothes are replaced with the outfit from the second image. The result should be a realistic image of the person wearing the new outfit. Do not include any text overlay on the generated image.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: personImage.base64,
              mimeType: personImage.mimeType,
            },
          },
          {
            inlineData: {
              data: outfitImage.base64,
              mimeType: outfitImage.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("The API did not return any candidates. The request may have been blocked.");
    }

    let resultImage: string | null = null;
    let resultText: string | null = null;

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        resultText = part.text;
      } else if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        resultImage = `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    if (!resultImage) {
        throw new Error("The model did not return an image. It might have refused the request.");
    }

    return { image: resultImage, text: resultText };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to generate image. Please try again. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
};
