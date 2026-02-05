import { FastifyInstance } from "fastify";
import { jwtAuth } from "../../middleware/jwt-auth";
import { create } from "./create";
import { remove } from "./delete";
import { findAll } from "./find-all";
import { findById } from "./find-by-id";
import { update } from "./update";

export async function questionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', jwtAuth);

  app.post("/questions", create);
  app.get("/questions", findAll);
  app.get("/questions/:id", findById);
  app.put("/questions/:id", update);
  app.delete("/questions/:id", remove);
}
