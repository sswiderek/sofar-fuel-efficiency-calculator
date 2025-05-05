
import path from 'path';
import * as fs from 'fs';

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static('public/images', {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Serve static files
    app.use(express.static('dist/public'));
    
    // Use a middleware to handle all non-API routes with the SPA
    app.use((req, res, next) => {
      // Skip API routes, assets, and static files
      if (req.path.startsWith('/api') || 
          req.path.includes('.') || 
          req.path.startsWith('/assets/')) {
        return next();
      }
      
      // Try to send the index.html file
      try {
        const indexPath = path.resolve(__dirname, '../dist/public/index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          // If file doesn't exist at the expected path, try an alternate path
          const altPath = path.resolve('dist/public/index.html');
          if (fs.existsSync(altPath)) {
            res.sendFile(altPath);
          } else {
            log(`Index file not found at ${indexPath} or ${altPath}`);
            res.status(500).send('Configuration error: index.html not found');
          }
        }
      } catch (error) {
        log(`Error serving index.html: ${error}`);
        next(error);
      }
    });
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen(PORT, () => {
    log(`serving on port ${PORT} in ${app.get("env")} mode`);
  });
})();
