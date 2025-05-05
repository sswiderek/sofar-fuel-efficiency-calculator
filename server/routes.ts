import type { Express } from "express";
import { createServer, type Server } from "http";
import { calculatorInputSchema, contactFormSchema, type CalculationResult } from "@shared/schema";
import { getVLSFOPrice } from "./services/openai";
import { initializeSendGrid, sendContactFormEmail } from "./services/sendgrid";

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

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      console.log("Received contact form submission:", req.body);
      
      // Validate the form data
      const contactData = contactFormSchema.parse(req.body);
      
      // Initialize SendGrid when first contact form is submitted
      // Note: We do this lazily on demand to avoid errors at startup if API key isn't available
      const emailSent = await sendContactFormEmail(contactData);
      
      if (emailSent) {
        res.json({ success: true, message: "Contact form submitted successfully" });
      } else {
        // This handles the case where SendGrid is properly initialized but email sending fails
        res.status(500).json({ success: false, message: "Failed to send contact information. Please try again later." });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      res.status(400).json({ success: false, message: "Invalid contact form data" });
    }
  });

  return createServer(app);
}