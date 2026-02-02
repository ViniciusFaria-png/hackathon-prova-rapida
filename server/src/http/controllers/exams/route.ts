import { FastifyInstance } from "fastify";
import { jwtAuth } from "../../middleware/jwt-auth";
import { addQuestion } from "./add-question";
import { create } from "./create";
import { remove } from "./delete";
import { duplicate } from "./duplicate";
import { findAll } from "./find-all";
import { findById } from "./find-by-id";
import { preview } from "./preview";
import { removeQuestion } from "./remove-question";
import { reorder } from "./reorder";
import { shuffle } from "./shuffle";
import { update } from "./update";

export async function examRoutes(app: FastifyInstance) {
  app.addHook('onRequest', jwtAuth);

  app.post("/exams", create);
  app.get("/exams", findAll);
  app.get("/exams/:id", findById);
  app.put("/exams/:id", update);
  app.delete("/exams/:id", remove);
  
  app.post("/exams/:id/questions", addQuestion);
  app.delete("/exams/:id/questions/:questionId", removeQuestion);
  app.put("/exams/:id/questions/reorder", reorder);
  
  app.post("/exams/:id/shuffle", shuffle);
  app.get("/exams/:id/preview", preview);
  app.post("/exams/:id/duplicate", duplicate);
}
