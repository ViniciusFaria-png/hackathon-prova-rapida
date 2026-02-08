
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateUserUseCase } from "../../../use-cases/factories/make-create-user-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string()
  });

  const { email, password, name } = registerBodySchema.parse(request.body);

  const createUserUseCase = makeCreateUserUseCase();
  const user = await createUserUseCase.handler({ email, password, name });

  return reply.status(201).send({ id: user?.id, email: user?.email });
}