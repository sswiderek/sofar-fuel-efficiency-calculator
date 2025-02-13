import type { Express } from "express";
import { createServer, type Server } from "http";
import { calculatorInputSchema, type CalculationResult } from "@shared/schema";
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export function registerRoutes(app: Express): Server {
  app.post("/api/calculate", (req, res) => {
    try {
      console.log("Received calculation request:", req.body);
      const data = calculatorInputSchema.parse(req.body);

      // Calculate total fuel cost
      const totalFuelCost = data.fleetSize * data.voyageLength * data.fuelConsumption * data.fuelPrice;

      // Calculate savings based on estimated percentage
      const savingsPercent = data.estimatedSavings / 100;
      const estimatedSavings = totalFuelCost * savingsPercent;

      // Calculate fuel cost with Wayfinder
      const fuelCostWithWayfinder = totalFuelCost - estimatedSavings;

      // Calculate CO2 reduction (assuming 3.15 MT of CO2 per MT of fuel)
      const fuelSaved = (data.fleetSize * data.voyageLength * data.fuelConsumption) * savingsPercent;
      const co2Reduction = fuelSaved * 3.15;

      const results: CalculationResult = {
        totalFuelCost,
        estimatedSavings,
        fuelCostWithWayfinder,
        co2Reduction
      };

      res.json(results);
    } catch (error) {
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.get("/api/fuel-price", async (req, res) => {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a maritime fuel price expert. Go to Ship & Bunker's website (https://shipandbunker.com/prices/av/global/av-g20-global-20-ports-average) and report the current VLSFO price. Respond only with the number."
          },
          {
            role: "user",
            content: "What is the current Ship & Bunker Global 20 Ports Average VLSFO price in USD/mt? Respond with just the number."
          }
        ],
        model: "gpt-3.5-turbo",
      });

      const content = completion.choices[0].message.content;
      const price = parseFloat(content.replace(/[^0-9.]/g, ''));
      
      if (isNaN(price)) {
        throw new Error('Invalid price format received');
      }
      
      res.json({ price });
    } catch (error) {
      console.error("Failed to fetch fuel price:", error);
      res.status(500).json({ error: "Failed to fetch fuel price" });
    }
  });

  return createServer(app);
}