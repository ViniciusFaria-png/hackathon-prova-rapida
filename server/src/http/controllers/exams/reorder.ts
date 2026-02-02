import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeReorderExamQuestionsUseCase } from "../../../use-cases/factories/make-reorder-exam-questions-use-case";

export async function reorder(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const bodySchema = z.object({
    questions: z.array(z.object({
      questionId: z.uuid(),
      position: z.number().int().positive(),
    })),
  });

  const { id: examId } = paramsSchema.parse(request.params);
  const { questions } = bodySchema.parse(request.body);

  const reorderUseCase = makeReorderExamQuestionsUseCase();
  await reorderUseCase.handler(examId, questions);

  return reply.status(204).send();
}
