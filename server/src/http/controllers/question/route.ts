import { FastifyInstance } from "fastify";
import {
    createQuestionSchema,
    deleteQuestionSchema,
    findAllQuestionsSchema,
    findQuestionByIdSchema,
    updateQuestionSchema,
} from "../../../schemas/question/question.schemas";
import { jwtAuth } from "../../middleware/jwt-auth";
import { create } from "./create";
import { remove } from "./delete";
import { findAll } from "./find-all";
import { findById } from "./find-by-id";
import { update } from "./update";

export async function questionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', jwtAuth);

  app.post("/questions", { schema: createQuestionSchema }, create);
  app.get("/questions", { schema: findAllQuestionsSchema }, findAll);
  app.get("/questions/:id", { schema: findQuestionByIdSchema }, findById);
  app.put("/questions/:id", { schema: updateQuestionSchema }, update);
  app.delete("/questions/:id", { schema: deleteQuestionSchema }, remove);
}
