import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindQuestionByIdUseCase } from "../../../use-cases/factories/make-find-question-by-id-use-case";

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const findQuestionByIdUseCase = makeFindQuestionByIdUseCase();
  const question = await findQuestionByIdUseCase.handler(id);

  return reply.status(200).send(question);
}
