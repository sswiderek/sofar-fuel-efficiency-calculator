import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
console.log('API Key present:', !!process.env.OPENAI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// In-memory cache for prices
const priceCache: Record<string, number> = {};

async function getCachedPrice(key: string): Promise<number | null> {
  return priceCache[key] || null;
}

async function setCachedPrice(key: string, price: number): Promise<void> {
  priceCache[key] = price;
}

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
    // Check if we have a cached price
    const cacheKey = `${monthName}-${year}`;
    const cachedPrice = await getCachedPrice(cacheKey);
    if (cachedPrice) {
      return {
        price: cachedPrice,
        month: monthName,
        year: year,
        isError: false
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
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
      ]
    });

    if (!response.choices[0].message.content) {
      throw new Error('No content in response');
    }

    const result = JSON.parse(response.choices[0].message.content);

    if (typeof result.price !== 'number') {
      throw new Error('Invalid price format in response');
    }

    // Validate price is within reasonable range and round to whole number
    const roundedPrice = Math.round(result.price);
    if (roundedPrice < 400 || roundedPrice > 999) {
      throw new Error('Price outside expected range');
    }

    // Cache the price before returning
    await setCachedPrice(`${monthName}-${year}`, roundedPrice);

    return {
      price: roundedPrice,
      month: monthName,
      year: year,
      isError: false
    };
  } catch (error) {
    console.error('Error fetching VLSFO price:', error);
    const errorMessage = !process.env.OPENAI_API_KEY 
      ? 'OpenAI API key is missing'
      : 'Unable to fetch current VLSFO price';
    return {
      price: null,
      month: monthName,
      year: year,
      isError: true,
      errorMessage
    };
  }
}