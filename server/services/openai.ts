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
          content: `You are a maritime fuel price expert focused specifically on VLSFO pricing data. 
            You have access to Ship & Bunker's Global 20 Ports Average data.
            Provide only the actual global monthly average VLSFO price, which typically ranges between $500-650/MT.
            Always respond with a JSON object containing only a 'price' field with a numeric value representing USD/MT.
            Example response: { "price": 590.50 }
            Do not include any commentary or additional information.`
        },
        {
          role: "user",
          content: `What was the global monthly average price of Very Low Sulfur Fuel Oil (VLSFO) for ${monthName} ${year} according to Ship & Bunker's Global 20 Ports Average?`
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

    // Validate price is within reasonable range
    if (result.price < 400 || result.price > 800) {
      throw new Error('Price outside expected range');
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