import dotenv from "dotenv";
dotenv.config();

import zod from "zod";

const envSchema = zod.object({
    PORT: zod.string().default(3000),
    MONGO_URI: zod.string(),
    JWT_SECRET: zod.string(),
    CLOUD_NAME: zod.string(),
    CLOUD_API_KEY: zod.string(),
    CLOUD_API_SECRET: zod.string(),
    OPENWEATHER_API_KEY: zod.string(),
    EMAIL_USER: zod.string(),
    EMAIL_PASS: zod.string(),
    CROP_HEALTH_ENDPOINT: zod.string(),
    CROP_HEALTH_API_KEY: zod.string(),
    HF_TOKEN: zod.string(),
});

const paresdEnv = envSchema.safeParse(process.env);

if (!paresdEnv.success) {
    console.error("Invalid environment variables:", paresdEnv.error.format());
    process.exit(1);
}

export const env = paresdEnv.data;
