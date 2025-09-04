import * as dotenv from "dotenv";
dotenv.config();

import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: process.env.APP_ID || "com.example.mindmates",
  appName: process.env.APP_NAME || "mindmates",
  webDir: "out",
  server: {
    url: process.env.SERVER_URL || "http://localhost:3000",
    cleartext: true,
  },
};

export default config;
