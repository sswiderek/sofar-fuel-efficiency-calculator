
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}
const openai = new OpenAI({ apiKey });

// Cache structure with timestamp to ensure monthly consistency
interface CachedPrice {
  price: number;
  timestamp: number;
}

const priceCache: Record<string, CachedPrice> = {};

function isValidCache(cache: CachedPrice, targetMonth: Date): boolean {
  const cacheDate = new Date(cache.timestamp);
  return cacheDate.getMonth() === targetMonth.getMonth() 
    && cacheDate.getFullYear() === targetMonth.getFullYear();
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
  const cacheKey = `${monthName}-${year}`;

  try {
    // Check cache with timestamp validation
    const cachedData = priceCache[cacheKey];
    if (cachedData && isValidCache(cachedData, previousMonth)) {
      return {
        price: cachedData.price,
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
    const roundedPrice = Math.round(result.price);

    if (roundedPrice < 400 || roundedPrice > 999) {
      throw new Error('Price outside expected range');
    }

    // Cache with timestamp
    priceCache[cacheKey] = {
      price: roundedPrice,
      timestamp: Date.now()
    };

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
