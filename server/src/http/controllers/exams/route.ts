import { FastifyInstance } from "fastify";
import { jwtAuth } from "../../middleware/jwt-auth";
import { addQuestion } from "./add-question";
import { answerKey } from "./answer-key";
import { batchAddQuestions } from "./batch-add-questions";
import { create } from "./create";
import { remove } from "./delete";
import { duplicate } from "./duplicate";
import { ecoModes } from "./eco-modes";
import { exportPdf } from "./export-pdf";
import { finalize } from "./finalize";
import { findAll } from "./find-all";
import { findById } from "./find-by-id";
import { generateVersions } from "./generate-versions";
import { preview } from "./preview";
import { removeQuestion } from "./remove-question";
import { reorder } from "./reorder";
import { shuffle } from "./shuffle";
import { stats } from "./stats";
import { update } from "./update";
import { validate } from "./validate";

export async function examRoutes(app: FastifyInstance) {
  app.addHook('onRequest', jwtAuth);

  app.post("/exams", create);
  app.get("/exams", findAll);
  app.get("/exams/:id", findById);
  app.put("/exams/:id", update);
  app.delete("/exams/:id", remove);
  
  app.post("/exams/:id/questions", addQuestion);
  app.post("/exams/:id/questions/batch", batchAddQuestions);
  app.delete("/exams/:id/questions/:questionId", removeQuestion);
  app.put("/exams/:id/questions/reorder", reorder);
  
  app.post("/exams/:id/shuffle", shuffle);
  app.get("/exams/:id/preview", preview);
  app.post("/exams/:id/duplicate", duplicate);

  app.get("/exams/:id/export", exportPdf);
  app.get("/exams/:id/answer-key", answerKey);

  app.post("/exams/:id/finalize", finalize);
  app.post("/exams/:id/generate-versions", generateVersions);

  app.get("/exams/:id/stats", stats);
  app.post("/exams/:id/validate", validate);

  // Eco mode — lista os modos de economia disponíveis
  app.get("/exams/eco-modes", ecoModes);
}
