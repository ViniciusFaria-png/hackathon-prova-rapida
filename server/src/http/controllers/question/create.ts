import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateQuestionUseCase } from "../../../use-cases/factories/make-create-question-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createQuestionSchema = z.object({
    statement: z.string(),
    subject: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    isPublic: z.boolean().default(false),
    alternatives: z.array(z.object({
      text: z.string(),
      isCorrect: z.boolean(),
    })).min(2, "É necessário pelo menos 2 alternativas.")
      .refine(
        (alts) => alts.some(a => a.isCorrect),
        "É necessário pelo menos uma alternativa correta."
      ),
  });

  const data = createQuestionSchema.parse(request.body);
  const userId = request.user.sub;

  const createQuestionUseCase = makeCreateQuestionUseCase();
  const question = await createQuestionUseCase.handler({
    ...data,
    userId,
  });

  return reply.status(201).send({
    success: true,
    data: question,
  });
}
