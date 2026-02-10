import { FastifyInstance } from "fastify";
import { jwtAuth } from "../../middleware/jwt-auth";
import { create } from "./create";
import { remove } from "./delete";
import { update } from "./update";

export async function alternativeRoutes(app: FastifyInstance) {
  app.addHook('onRequest', jwtAuth);

  app.post("/questions/:questionId/alternatives", create);
  app.put("/alternatives/:id", update);
  app.delete("/alternatives/:id", remove);
}
