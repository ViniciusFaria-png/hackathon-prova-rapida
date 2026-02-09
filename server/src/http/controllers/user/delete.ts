
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { makeDeleteUserUseCase } from "../../../use-cases/factories/make-delete-user-use-case";

const deleteUserParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = deleteUserParamsSchema.parse(request.params);

    const deleteUserUseCase = makeDeleteUserUseCase();
    await deleteUserUseCase.execute({ userId: id });

    return reply.status(204).send();
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
