import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateExamUseCase } from "../../../use-cases/factories/make-create-exam-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createExamSchema = z.object({
    title: z.string(),
    subject: z.string(),
  });

  const { title, subject } = createExamSchema.parse(request.body);
  const userId = request.user.sub;

  const createExamUseCase = makeCreateExamUseCase();
  const exam = await createExamUseCase.handler({ title, subject, userId });

  return reply.status(201).send(exam);
}
