import express from "express";

const app = express();
const port = 3000;

app.get("/limited", (req, res) => {
  // Your limited route logic
  res.send("Limited Access");
});

app.get("/unlimited", (req, res) => {
  // Your unlimited route logic
  res.send("Unlimited Access");
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const gracefulShutdown = () => {
  console.log("\nShutting down gracefully...");
  server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Could not close connections in time, forcing shutdown");
    process.exit(1);
  }, 10000);
};

// Listen for exit signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
