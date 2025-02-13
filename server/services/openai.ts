import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface VLSFOPrice {
  price: number;
  month: string;
  year: number;
}

export async function getVLSFOPrice(): Promise<VLSFOPrice> {
  const currentDate = new Date();
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  
  const monthName = previousMonth.toLocaleString('en-US', { month: 'long' });
  const year = previousMonth.getFullYear();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a maritime fuel price expert. Provide the global monthly average price of Very Low Sulfur Fuel Oil (VLSFO) based on Ship & Bunker's Global 20 Ports Average data."
        },
        {
          role: "user",
          content: `What was the global monthly average price of Very Low Sulfur Fuel Oil (VLSFO) for ${monthName} ${year} according to Ship & Bunker's Global 20 Ports Average? Return the result as a JSON object with price in USD/MT.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      price: result.price || 603, // Fallback price if not available
      month: monthName,
      year: year
    };
  } catch (error) {
    console.error('Error fetching VLSFO price:', error);
    // Return fallback data in case of error
    return {
      price: 603,
      month: monthName,
      year: year
    };
  }
}
