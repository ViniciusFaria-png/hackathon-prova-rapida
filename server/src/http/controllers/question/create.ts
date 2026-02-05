import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateQuestionUseCase } from "../../../use-cases/factories/make-create-question-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createQuestionSchema = z.object({
    statement: z.string(),
    subject: z.string(),
    isPublic: z.boolean().default(false),
    alternatives: z.array(z.object({
      text: z.string(),
      isCorrect: z.boolean(),
    })).min(1),
  });

  const data = createQuestionSchema.parse(request.body);
  const userId = request.user.sub;

  const createQuestionUseCase = makeCreateQuestionUseCase();
  const question = await createQuestionUseCase.handler({
    ...data,
    userId: data.isPublic ? undefined : userId,
  });

  return reply.status(201).send(question);
}
