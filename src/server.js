import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoute.js";
import { initDB } from "./config/db.js";

dotenv.config();
const app = express();
//built-in middleware
app.use(express.json());
app.use(rateLimiter);

const port = process.env.PORT || 5001;

app.use("/api/transaction", transactionRoutes);
initDB().then(() => {
  app.listen(port, () => {
    console.log(`server is running on the port ${port}`);
  });
});
