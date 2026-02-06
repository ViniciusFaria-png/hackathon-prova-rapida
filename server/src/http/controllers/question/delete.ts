import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PGQuestionRepository } from "../../../repositories/pg/question-repository";
import { DeleteQuestionUseCase } from "../../../use-cases/delete-question";
import { canDeleteQuestion } from "../../middleware/permissions";

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = paramsSchema.parse(request.params);
  const userId = request.user.sub;

  await canDeleteQuestion(userId, id);

  const questionRepository = new PGQuestionRepository();
  const deleteQuestionUseCase = new DeleteQuestionUseCase(questionRepository);
  await deleteQuestionUseCase.handler(id);

  return reply.status(204).send();
}
