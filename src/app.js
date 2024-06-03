// const express = require("express");
// const taskRoutes = require("./routes/taskRoutes");

// const app = express();

// app.use(express.json());

// app.use("/api", taskRoutes);

// module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(bodyParser.json());
app.use("/api", taskRoutes);

module.exports = app;

// const express = require("express");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const { sequelize } = require("./models"); // Import sequelize from models/index.js
// const taskRoutes = require("./routes/taskRoutes");

// // Load environment variables
// dotenv.config();

// const app = express();

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use("/api", taskRoutes);

// // Sync database
// sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log("Database & tables created!");
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   });

// module.exports = app;
