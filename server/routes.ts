import type { Express } from "express";
import { createServer, type Server } from "http";
import { calculatorInputSchema, type CalculationResult } from "@shared/schema";
import { getVLSFOPrice } from "./services/openai";
import fs from 'fs';
import path from 'path';

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

      // Calculate annual fuel consumption using total sea days
      const annualFuelConsumption = data.vessels.reduce((total, vessel) => {
        return total + (vessel.count * vessel.seaDaysPerYear * vessel.fuelConsumption);
      }, 0);
      const totalFuelCost = Math.round(annualFuelConsumption * data.fuelPrice);

      // Calculate savings based on estimated percentage
      const savingsPercent = data.estimatedSavings / 100;

      const estimatedSavings = Math.round(totalFuelCost * savingsPercent);
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
        totalFuelConsumption,
        fuelPrice: data.fuelPrice,
        vessels: data.vessels
      };

      res.json(results);
    } catch (error) {
      console.error("Calculation error:", error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  // Track demo button clicks
  app.post("/api/track-demo-click", (req, res) => {
    try {
      const clickData = req.body;
      const timestamp = new Date().toISOString();
      
      // Add timestamp and IP info (if available)
      const logData = {
        ...clickData,
        timestamp,
        ip: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown'
      };
      
      console.log('Demo click tracked:', logData);
      
      // In ES modules, __dirname is not available directly
      // We'll just log to console in this implementation
      // A production app would store in a database
      console.log('Demo click data logged to server console');
      
      // In a real application, this data would be stored in a database
      // For this demo, we're just logging to the console and using localStorage on the client
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error tracking demo click:', error);
      res.status(500).json({ error: 'Failed to track demo click' });
    }
  });

  return createServer(app);
}