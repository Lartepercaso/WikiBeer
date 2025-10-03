
import { GoogleGenAI } from "@google/genai";
import { BeerPost } from '../types';

// IMPORTANT: This service requires a valid API key to be set in the environment variables.
// Fix: Initialize the GoogleGenAI client according to the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative beer description using the Gemini API.
 * @param beerInfo - Partial information about the beer.
 * @returns A promise that resolves to a string containing the description.
 */
export const generateBeerDescription = async (beerInfo: Partial<BeerPost>): Promise<string> => {
  // Fix: Replaced mock implementation with the actual Gemini API call.
  // REAL IMPLEMENTATION - using the actual Gemini API
  if (!process.env.API_KEY) {
    console.error("API_KEY is not set in environment variables.");
    return Promise.resolve("La generazione della descrizione non è disponibile al momento.");
  }

  const prompt = `
    Crea una descrizione breve, accattivante e da sommelier per una birra con le seguenti caratteristiche.
    Sii creativo e usa un linguaggio evocativo.
    
    Nome: ${beerInfo.name}
    Birrificio: ${beerInfo.brewery}
    Nazione: ${beerInfo.nation}
    Tipo: ${beerInfo.type}
    Grado Alcolico: ${beerInfo.abv}%
    
    Descrizione:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    // The `response.text` property directly contains the generated text.
    return response.text;
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Non è stato possibile generare una descrizione in questo momento.";
  }
};
