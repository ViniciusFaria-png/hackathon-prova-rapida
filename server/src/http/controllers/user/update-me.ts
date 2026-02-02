import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateUserUseCase } from "../../../use-cases/factories/make-update-user-use-case";

export async function updateMe(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
  });

  const data = bodySchema.parse(request.body);
  const userId = request.user.sub;

  const updateUserUseCase = makeUpdateUserUseCase();
  await updateUserUseCase.execute({ userId, ...data });

  return reply.status(200).send({ message: "Perfil atualizado com sucesso" });
}

