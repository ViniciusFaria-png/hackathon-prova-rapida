import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindAllQuestionsUseCase } from "../../../use-cases/factories/make-find-all-questions-use-case";

export async function findAll(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    subject: z.string().optional(),
    difficulty: z.string().optional(),
    search: z.string().optional(),
    userId: z.string().uuid().optional(),
    isPublic: z.string().transform(val => val === 'true').optional(),
    excludeUsedIn: z.string().uuid().optional(),
  });

  const filters = querySchema.parse(request.query);
  const currentUserId = request.user.sub;

  const findAllQuestionsUseCase = makeFindAllQuestionsUseCase();
  const result = await findAllQuestionsUseCase.handler({ ...filters, currentUserId });

  return reply.status(200).send({
    success: true,
    ...result,
  });
}
