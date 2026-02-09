
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { makeUpdateUserUseCase } from "../../../use-cases/factories/make-update-user-use-case";

const updateUserParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

const updateUserBodySchema = z
  .object({
    email: z.email("Invalid email format.").optional(),
    password: z.string().min(6, "Password must be at least 6 characters.").optional(),
  })
  .partial();

export async function update(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = updateUserParamsSchema.parse(request.params);
    const data = updateUserBodySchema.parse(request.body);
    const updateUserUseCase = makeUpdateUserUseCase();
    const { user } = await updateUserUseCase.execute({
      userId: id,
      ...data,
    });

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
