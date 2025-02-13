import OpenAI from "openai";
import { z } from "zod";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Get current date for validation
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

// Validation schema for fuel price response
const fuelPriceSchema = z.object({
  price: z.number().min(300).max(900), // Adjusted min value to accommodate current market prices
  location: z.string(),
  month: z.string(),
  year: z.number().min(currentYear).max(currentYear), // Must be current year
});

type FuelPriceResponse = z.infer<typeof fuelPriceSchema>;

export async function fetchMonthlyFuelPrice(): Promise<FuelPriceResponse> {
  try {
    console.log(`Fetching fuel price for ${currentMonth} ${currentYear}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a specialized assistant that provides VLSFO (Very Low Sulfur Fuel Oil) price data. Always return data in JSON format with price (number), location (string), month (string), and year (number). The data MUST be for ${currentMonth} ${currentYear}. If exact data isn't available, provide the most recent estimate for the current month.`
        },
        {
          role: "user",
          content: `What is the current monthly average price of Very Low Sulfur Fuel Oil (VLSFO) in Singapore according to Ship & Bunker for ${currentMonth} ${currentYear}?`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      console.error("No content received from OpenAI");
      throw new Error("No content received from OpenAI");
    }

    console.log("Raw OpenAI response:", content);

    const parsedContent = JSON.parse(content);
    console.log("Parsed response:", parsedContent);

    // Add validation logging
    try {
      const validatedData = fuelPriceSchema.parse(parsedContent);
      console.log("Validation successful:", validatedData);
      return validatedData;
    } catch (validationError) {
      console.error("Validation failed:", validationError);
      throw new Error(`Invalid response format: ${validationError.message}`);
    }
  } catch (error) {
    console.error("Error fetching fuel price:", error);
    throw new Error("Failed to fetch fuel price data");
  }
}