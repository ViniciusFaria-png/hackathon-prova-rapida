import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PGExamRepository } from "../../../repositories/pg/exam-repository";
import { makeFindExamByIdUseCase } from "../../../use-cases/factories/make-find-exam-by-id-use-case";

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  const findByIdParamsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = findByIdParamsSchema.parse(request.params);

  const findExamByIdUseCase = makeFindExamByIdUseCase();
  const exam = await findExamByIdUseCase.handler(id);

  const examRepo = new PGExamRepository();
  const versions = await examRepo.findVersionsByExamId(id);

  return reply.status(200).send({ ...exam, versions });
}
