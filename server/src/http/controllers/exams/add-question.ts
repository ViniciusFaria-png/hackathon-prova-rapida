import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeAddQuestionToExamUseCase } from "../../../use-cases/factories/make-add-question-to-exam-use-case";
import { canEditExam, canUseQuestion } from "../../middleware/permissions";

export async function addQuestion(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid()
  });

  const bodySchema = z.object({
    questionId: z.uuid(),
    position: z.number().int().positive(),
  });

  const { id: examId } = paramsSchema.parse(request.params);
  const { questionId, position } = bodySchema.parse(request.body);
  const userId = request.user.sub;

  await canEditExam(userId, examId);
  await canUseQuestion(userId, questionId);

  const addQuestionUseCase = makeAddQuestionToExamUseCase();
  await addQuestionUseCase.handler(examId, questionId, position);

  return reply.status(201).send({ success: true });
}
