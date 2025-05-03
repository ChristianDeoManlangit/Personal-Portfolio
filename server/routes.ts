import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files directly from the root directory
  app.use(express.static(path.join(process.cwd())));

  // Routes for HTML pages
  app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
  });

  app.get('/works', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'works.html'));
  });

  app.get('/about', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'about.html'));
  });

  app.get('/project-pages', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'project-pages.html'));
  });

  const httpServer = createServer(app);
  return httpServer;
}
