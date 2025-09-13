import * as dotenv from "dotenv";
dotenv.config();

import type { CapacitorConfig } from "@capacitor/cli";

const isDev = process.env.NODE_ENV === "development";

const config: CapacitorConfig = {
  appId: process.env.APP_ID || "com.example.Campus Care",
  appName: process.env.APP_NAME || "Campus Care",
  webDir: "out",
  server: isDev
    ? {
        url: process.env.SERVER_URL, // Your local dev server IP
        cleartext: true,
      }
    : undefined,
};

export default config;
