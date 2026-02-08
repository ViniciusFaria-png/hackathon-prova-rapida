import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeBatchAddQuestionsToExamUseCase } from "../../../use-cases/factories/make-batch-add-questions-to-exam-use-case";
import { canEditExam, canUseQuestion } from "../../middleware/permissions";

export async function batchAddQuestions(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const bodySchema = z.object({
    questions: z.array(
      z.object({
        questionId: z.uuid(),
        position: z.number().int().positive(),
      })
    ).min(1),
  });

  const { id: examId } = paramsSchema.parse(request.params);
  const { questions } = bodySchema.parse(request.body);
  const userId = request.user.sub;

  await canEditExam(userId, examId);

  for (const { questionId } of questions) {
    await canUseQuestion(userId, questionId);
  }

  const useCase = makeBatchAddQuestionsToExamUseCase();
  await useCase.handler({ examId, questions });

  return reply.status(201).send({ success: true, added: questions.length });
}
