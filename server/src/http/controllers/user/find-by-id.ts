
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { makeFindUserByIdUseCase } from "../../../use-cases/factories/make-find-user-by-id-use-case";

const findUserByIdParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = findUserByIdParamsSchema.parse(request.params);

    const findUserByIdUseCase = makeFindUserByIdUseCase();
    const { user } = await findUserByIdUseCase.execute({ userId: id });

    return reply.status(200).send({ user });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Validation error.",
        issues: err.issues,
      });
    }
    throw err;
  }
}

