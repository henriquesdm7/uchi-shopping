import {GoogleGenerativeAI} from "@google/generative-ai";

let genAI: GoogleGenerativeAI | undefined;

export function useGemini() {
  if (!genAI) {
    const config = useRuntimeConfig();
    const apiKey = config.geminiApiKey;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: 'GEMINI_API_KEY is not configured',
      });
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export const GEMINI_MODEL = "gemini-2.5-flash";

export async function processReceiptImage(imageBuffer: Buffer, mimeType: string, existingCategories: string[] = [], existingProducts: string[] = []) {
  const ai = useGemini();
  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const categoriesContext = existingCategories.length
    ? `Available Categories: ${JSON.stringify(existingCategories)}. Use one of these if applicable, otherwise suggest a new logical category.`
    : `Infer a simple category for the item (e.g., "Food", "Cleaning", "Drinks", "Hygiene", "Others").`;

  const productsContext = existingProducts.length
    ? `Known Product Names: ${JSON.stringify(existingProducts)}. If the item matches one of these (even with minor variations), use the known name.`
    : '';

  const prompt = `
    Analyze this Brazilian receipt (NF-e/NFC-e) and extract the following information in JSON format:
    - marketName: The name of the store/market.
    - date: The date of purchase (ISO 8601 format YYYY-MM-DDTHH:mm:ss if possible, or just YYYY-MM-DD).
    - total: The total amount paid (number).
    - items: An array of objects, each containing:
      - description: The product name/description.
      - quantity: The quantity purchased (number).
      - unitPrice: The price per unit (number).
      - totalPrice: The total price for this item (quantity * unitPrice) (number).
      - category: The category of the item.

    CONTEXT:
    ${categoriesContext}
    ${productsContext}

    Please clean up the product descriptions (remove codes like "001", "UN", etc. if they are just identifiers).
    Return ONLY the JSON object.
  `;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: mimeType,
      },
    },
  ]);

  const usage = result.response.usageMetadata;
  const responseText = result.response.text();

  try {
    return {
      data: JSON.parse(responseText),
      usage: {
        inputTokens: usage?.promptTokenCount ?? 0,
        outputTokens: usage?.candidatesTokenCount ?? 0,
        totalTokens: usage?.totalTokenCount ?? 0,
      }
    };
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", responseText);
    throw createError({
      statusCode: 500,
      message: 'Failed to process receipt with AI',
    });
  }
}

export async function listGeminiModels() {
  try {
    const config = useRuntimeConfig();
    const apiKey = config.geminiApiKey;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
      console.error('Failed to list models:', await response.text());
      return [];
    }
    const data = await response.json();
    return data.models || [];
  } catch (e) {
    console.error('Error listing models:', e);
    return [];
  }
}
