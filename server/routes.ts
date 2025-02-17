import type { Express } from "express";
import { createServer, type Server } from "http";
import { calculatorInputSchema, type CalculationResult } from "@shared/schema";
import { getVLSFOPrice } from "./services/openai";

export function registerRoutes(app: Express): Server {
  app.get("/api/vlsfo-price", async (req, res) => {
    try {
      const price = await getVLSFOPrice();
      res.json(price);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch VLSFO price" });
    }
  });

  app.post("/api/calculate", (req, res) => {
    try {
      console.log("Received calculation request:", req.body);
      const data = calculatorInputSchema.parse(req.body);

      // Calculate total operational days accounting for port time
      const totalDaysPerVoyage = data.voyageLength + data.portTimePerVoyage;
      const operationalDays = data.voyageLength; // Only count days at sea for fuel consumption

      // Calculate total fuel cost (only consuming fuel during sea days)
      const totalFuelCost = data.fleetSize * operationalDays * data.fuelConsumption * data.fuelPrice;

      // Calculate savings based on estimated percentage
      const savingsPercent = data.estimatedSavings / 100;
      const estimatedSavings = totalFuelCost * savingsPercent;

      // Calculate fuel cost with Wayfinder
      const fuelCostWithWayfinder = totalFuelCost - estimatedSavings;

      // Calculate CO2 reduction (assuming 3.15 MT of CO2 per MT of fuel)
      const fuelSaved = (data.fleetSize * data.voyageLength * data.fuelConsumption) * savingsPercent;
      const co2Reduction = fuelSaved * 3.15;

      const totalFuelConsumption = data.fleetSize * data.voyageLength * data.fuelConsumption;
      
      const results: CalculationResult = {
        totalFuelCost,
        estimatedSavings,
        fuelCostWithWayfinder,
        co2Reduction,
        totalFuelConsumption
      };

      res.json(results);
    } catch (error) {
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  return createServer(app);
}