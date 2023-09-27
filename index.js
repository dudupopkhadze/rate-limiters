import app from "./src/app.js";

const port = 3000;

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
