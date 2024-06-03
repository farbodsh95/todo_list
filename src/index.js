const app = require("./app");
const pool = require("./database");
require("dotenv").config();

const PORT = process.env.APP_RUNNING_PORT || 3000;

const startServer = async () => {
  try {
    // Check database connection
    await pool.query("SELECT 1");
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
