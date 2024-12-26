const express = require("express");
const sequelize = require("./config/database");
const config = require("./config/config");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Initialize database
sequelize
  .sync()
  .then(() => console.log("Database synchronized"))
  .catch((err) => console.error("Database sync error:", err));

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
