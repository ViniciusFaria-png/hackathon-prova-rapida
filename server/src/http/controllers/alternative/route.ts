import { FastifyInstance } from "fastify";
import {
    createAlternativeSchema,
    deleteAlternativeSchema,
    updateAlternativeSchema,
} from "../../../schemas/alternative/alternative.schemas";
import { jwtAuth } from "../../middleware/jwt-auth";
import { create } from "./create";
import { remove } from "./delete";
import { update } from "./update";

export async function alternativeRoutes(app: FastifyInstance) {
  app.addHook('onRequest', jwtAuth);

  app.post("/questions/:questionId/alternatives", { schema: createAlternativeSchema }, create);
  app.put("/alternatives/:id", { schema: updateAlternativeSchema }, update);
  app.delete("/alternatives/:id", { schema: deleteAlternativeSchema }, remove);
}
