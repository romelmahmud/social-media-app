const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/errorMiddleware");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();

const port = process.env.PORT || 8800;

// Connecting MongoDB
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Database connected");
});

// Moddleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is running...");
});
