import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface VLSFOPrice {
  price: number | null;
  month: string;
  year: number;
  isError: boolean;
  errorMessage?: string;
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
          content: "You are a maritime fuel price expert. Provide the global monthly average price of Very Low Sulfur Fuel Oil (VLSFO) based on Ship & Bunker's Global 20 Ports Average data. Always return a numerical price value."
        },
        {
          role: "user",
          content: `What was the global monthly average price of Very Low Sulfur Fuel Oil (VLSFO) for ${monthName} ${year} according to Ship & Bunker's Global 20 Ports Average? Return only a JSON object with 'price' as a number in USD/MT.`
        }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error('No content in response');
    }

    const result = JSON.parse(response.choices[0].message.content);

    if (typeof result.price !== 'number') {
      throw new Error('Invalid price format in response');
    }

    return {
      price: result.price,
      month: monthName,
      year: year,
      isError: false
    };
  } catch (error) {
    console.error('Error fetching VLSFO price:', error);
    return {
      price: null,
      month: monthName,
      year: year,
      isError: true,
      errorMessage: 'Unable to fetch current VLSFO price'
    };
  }
}