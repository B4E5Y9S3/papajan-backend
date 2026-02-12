import dotenv from "dotenv";
import { z } from "zod";
dotenv.config({ quiet: true });
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string(),
  CLIENT_URL: z.url().optional().default("http://localhost:5000/"),
  JWT_SECRET: z.string(),
  REFRESH_SECRET: z.string(),
});
const env = envSchema.parse(process.env);

export { env };
