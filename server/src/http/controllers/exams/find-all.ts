import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindAllExamsUseCase } from "../../../use-cases/factories/make-find-all-exams-use-case";

export async function findAll(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    subject: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(['draft', 'finalized']).optional(),
  });

  const filters = querySchema.parse(request.query);
  const userId = request.user.sub;

  const findAllExamsUseCase = makeFindAllExamsUseCase();
  const result = await findAllExamsUseCase.handler(userId, filters);

  return reply.status(200).send({
    success: true,
    ...result,
  });
}
