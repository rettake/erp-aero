import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import router from "./router";

dotenv.config();

const app = express();
const port = process.env.PORT || 4200;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
