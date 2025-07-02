import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  name: 'connect.sid', // Explicitly set cookie name
  secret: "your-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true if using HTTPS
    sameSite: "lax", // or "none" if using HTTPS and cross-origin
    maxAge: 24 * 60 * 60 * 1000 // 24 hours (optional)
  }
}));

app.use(cors({
  origin: "http://localhost:3000", // or your frontend URL
  credentials: true,
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


app.post("/api/auth/login", (req, res) => {
  // ...validate credentials...
  // Example:
  // const user = { id: 1, username: "admin" };
  // req.session.admin = user;

  // Replace with your actual validation logic:
  if (req.body.username === "admin" && req.body.password === "admin123")  {
    req.session.admin = { username: "admin" }; // <-- Set session here
    res.json({ success: true });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  const port = 3000;
  const httpServer = app.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });

  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }
})();
