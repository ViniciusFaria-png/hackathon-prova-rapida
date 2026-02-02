import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRemoveQuestionFromExamUseCase } from "../../../use-cases/factories/make-remove-question-from-exam-use-case";

export async function removeQuestion(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
    questionId: z.uuid(),
  });

  const { id: examId, questionId } = paramsSchema.parse(request.params);

  const removeQuestionUseCase = makeRemoveQuestionFromExamUseCase();
  await removeQuestionUseCase.handler(examId, questionId);

  return reply.status(204).send();
}
