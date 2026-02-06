import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeValidateExamUseCase } from "../../../use-cases/factories/make-validate-exam-use-case";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id: examId } = paramsSchema.parse(request.params);

  const validateUseCase = makeValidateExamUseCase();
  const result = await validateUseCase.handler(examId);

  return reply.status(200).send({
    success: true,
    data: result,
  });
}
