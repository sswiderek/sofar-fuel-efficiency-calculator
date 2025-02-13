import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Validation schema for fuel price response
const fuelPriceSchema = z.object({
  price: z.number().min(400).max(900),
  location: z.string(),
  month: z.string(),
  year: z.number(),
});

type FuelPriceResponse = z.infer<typeof fuelPriceSchema>;

export async function fetchMonthlyFuelPrice(): Promise<FuelPriceResponse> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a specialized assistant that provides VLSFO (Very Low Sulfur Fuel Oil) price data. Always return data in JSON format with price (number), location (string), month (string), and year (number)."
        },
        {
          role: "user",
          content: "What is the current monthly average price of Very Low Sulfur Fuel Oil (VLSFO) in Singapore according to Ship & Bunker?"
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const result = JSON.parse(content);
    return fuelPriceSchema.parse(result);
  } catch (error) {
    console.error("Error fetching fuel price:", error);
    throw new Error("Failed to fetch fuel price data");
  }
}