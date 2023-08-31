import express from "express";
import dotenv from 'dotenv'
import cors from "cors";
import expenseRoutes from './routes/expenseRoutes.js'
import userRoutes from "./routes/userRoutes.js";
import connectDb from './config/db.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(cors());

app.use("/api/expense", expenseRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello")
});

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

start();
  
