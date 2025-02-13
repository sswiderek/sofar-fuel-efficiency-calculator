
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const currentDate = new Date();
// Get last month's date
const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
const year = lastMonth.getFullYear();
const month = lastMonth.toLocaleString('default', { month: 'long' });

const fuelPriceSchema = z.object({
  price: z.number().min(300).max(900),
  location: z.string(),
  month: z.string(),
  year: z.number().min(year).max(year),
});

type FuelPriceResponse = z.infer<typeof fuelPriceSchema>;

let cachedPrice: FuelPriceResponse | null = null;
let cacheMonth = '';

export async function fetchMonthlyFuelPrice(): Promise<FuelPriceResponse> {
  // Return cached price if it's from the same month
  if (cachedPrice && cacheMonth === month) {
    return cachedPrice;
  }

  try {
    console.log(`Fetching fuel price for ${month} ${year}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a specialized assistant that provides VLSFO (Very Low Sulfur Fuel Oil) price data. Always return data in JSON format with price (number), location (string), month (string), and year (number). The data MUST be for ${currentMonth} ${currentYear}. If exact data isn't available, provide the most recent estimate for the current month.`
        },
        {
          role: "user",
          content: `What was the monthly average price of Very Low Sulfur Fuel Oil (VLSFO) in Singapore according to Ship & Bunker for ${month} ${year}?`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsedContent = JSON.parse(content);
    const validatedData = fuelPriceSchema.parse(parsedContent);
    
    // Cache the result
    cachedPrice = validatedData;
    cacheMonth = currentMonth;
    
    return validatedData;
  } catch (error) {
    console.error("Error fetching fuel price:", error);
    throw new Error("Failed to fetch fuel price data");
  }
}
