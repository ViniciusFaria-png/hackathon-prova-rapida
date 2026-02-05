import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindAllQuestionsUseCase } from "../../../use-cases/factories/make-find-all-questions-use-case";

export async function findAll(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    subject: z.string().optional(),
    search: z.string().optional(),
    userId: z.string().uuid().optional(),
    isPublic: z.string().transform(val => val === 'true').optional(),
  });

  const filters = querySchema.parse(request.query);

  const findAllQuestionsUseCase = makeFindAllQuestionsUseCase();
  const questions = await findAllQuestionsUseCase.handler(filters);

  return reply.status(200).send(questions);
}
