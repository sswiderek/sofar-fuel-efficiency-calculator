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

      // Calculate voyages per year accounting for both sea and port time
      const daysPerVoyage = data.voyageLength + data.portTimePerVoyage;
      const voyagesPerYear = 365 / daysPerVoyage; // Allow fractional voyages
      const seaDaysPerYear = voyagesPerYear * data.voyageLength;
      const portDaysPerYear = voyagesPerYear * data.portTimePerVoyage;

      // Calculate sea and port fuel costs separately
      const seaFuelCost = data.fleetSize * seaDaysPerYear * data.fuelConsumption * data.fuelPrice;
      const portFuelCost = data.fleetSize * portDaysPerYear * data.portFuelConsumption * data.fuelPrice;
      const totalFuelCost = Math.round(seaFuelCost + portFuelCost);

      // Calculate savings based on estimated percentage
      const savingsPercent = data.estimatedSavings / 100;
      const annualFuelConsumption = data.fleetSize * seaDaysPerYear * data.fuelConsumption;
      const totalFuelCost = Math.round(annualFuelConsumption * data.fuelPrice);
      
      const estimatedSavings = totalFuelCost * savingsPercent;
      const fuelCostWithWayfinder = Math.round(totalFuelCost * (1 - savingsPercent));

      // Calculate CO2 reduction
      const fuelSaved = annualFuelConsumption * savingsPercent;
      const co2Reduction = fuelSaved * 3.15; // MT CO2 per MT fuel

      const totalFuelConsumption = annualFuelConsumption;
      
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