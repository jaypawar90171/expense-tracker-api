import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoute.js";
import { initDB } from "./config/db.js";
import job from "./config/cron.js";

dotenv.config();
const app = express();

if(process.env.NODE_ENV === "production") job.start()
//built-in middleware
app.use(express.json());
app.use(rateLimiter);

const port = process.env.PORT || 5001;

app.get('/api/health', (req, res) => {
  res.status(200).json({status: pk})
})
app.use("/api/transaction", transactionRoutes);
initDB().then(() => {
  app.listen(port, () => {
    console.log(`server is running on the port ${port}`);
  });
});
