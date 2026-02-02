import { app } from "./app";
import { env } from "./env";
import { db } from "./lib/db";

db.init().then(() => {
  app.listen({
    host: '0.0.0.0',
    port: env.PORT,
  }).then(() => {
    console.log(`🚀 HTTP Server Running on port ${env.PORT}`);
  });
});