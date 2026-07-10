import dotenv from "dotenv";
import path from "path";
import type { StringValue } from "ms";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_urls: process.env.APP_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN as StringValue,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
  stripe_secret: process.env.STRIPE_SECRET as StringValue,
  website_url: process.env.WEBSITE_URL as StringValue,
};
