import { FastifyInstance } from "fastify";
import {
    addQuestionToExamSchema,
    answerKeySchema,
    batchAddQuestionsSchema,
    createExamSchema,
    deleteExamSchema,
    duplicateExamSchema,
    ecoModesSchema,
    examStatsSchema,
    exportPdfSchema,
    finalizeExamSchema,
    findAllExamsSchema,
    findExamByIdSchema,
    generateVersionsSchema,
    previewExamSchema,
    removeQuestionFromExamSchema,
    reorderExamQuestionsSchema,
    shuffleExamSchema,
    updateExamSchema,
    validateExamSchema,
} from "../../../schemas/exam/exam.schemas";
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

  app.post("/exams", { schema: createExamSchema }, create);
  app.get("/exams", { schema: findAllExamsSchema }, findAll);
  app.get("/exams/:id", { schema: findExamByIdSchema }, findById);
  app.put("/exams/:id", { schema: updateExamSchema }, update);
  app.delete("/exams/:id", { schema: deleteExamSchema }, remove);

  app.post("/exams/:id/questions", { schema: addQuestionToExamSchema }, addQuestion);
  app.post("/exams/:id/questions/batch", { schema: batchAddQuestionsSchema }, batchAddQuestions);
  app.delete("/exams/:id/questions/:questionId", { schema: removeQuestionFromExamSchema }, removeQuestion);
  app.put("/exams/:id/questions/reorder", { schema: reorderExamQuestionsSchema }, reorder);

  app.post("/exams/:id/shuffle", { schema: shuffleExamSchema }, shuffle);
  app.get("/exams/:id/preview", { schema: previewExamSchema }, preview);
  app.post("/exams/:id/duplicate", { schema: duplicateExamSchema }, duplicate);

  app.get("/exams/:id/export", { schema: exportPdfSchema }, exportPdf);
  app.get("/exams/:id/answer-key", { schema: answerKeySchema }, answerKey);

  app.post("/exams/:id/finalize", { schema: finalizeExamSchema }, finalize);
  app.post("/exams/:id/generate-versions", { schema: generateVersionsSchema }, generateVersions);

  app.get("/exams/:id/stats", { schema: examStatsSchema }, stats);
  app.post("/exams/:id/validate", { schema: validateExamSchema }, validate);

  app.get("/exams/eco-modes", { schema: ecoModesSchema }, ecoModes);
}
