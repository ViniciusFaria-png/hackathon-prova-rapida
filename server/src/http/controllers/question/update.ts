import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateQuestionUseCase } from "../../../use-cases/factories/make-update-question-use-case";
import { canEditQuestion } from "../../middleware/permissions";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const bodySchema = z.object({
    statement: z.string().optional(),
    subject: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    isPublic: z.boolean().optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const data = bodySchema.parse(request.body);
  const userId = request.user.sub;

  await canEditQuestion(userId, id);

  const updateQuestionUseCase = makeUpdateQuestionUseCase();
  await updateQuestionUseCase.handler(id, data);

  return reply.status(204).send();
}
