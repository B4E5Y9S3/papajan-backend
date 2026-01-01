import mongoose from "mongoose";
import { env } from "./env.js";

async function connectdb() {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("Client connected to the database. :)");
  } catch (err) {
    console.error("Couldn't connect to the database. Error:", err);
    process.exit(1);
  }
}

export default connectdb;
