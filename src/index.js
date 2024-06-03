// const app = require("./app");
// const sequelize = require("./database");
// require("dotenv").config();

// const PORT = process.env.PORT || 3000;

// const startServer = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connection has been established successfully.");
//     await sequelize.sync();
//     console.log("Database synchronized.");
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// startServer();

// require("dotenv").config();
// const app = require("./app");

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

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

// const app = require("./app");

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
