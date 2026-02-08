import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateUserUseCase } from "../../../use-cases/factories/make-update-user-use-case";

export async function updateMe(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
  });

  const data = bodySchema.parse(request.body);
  const userId = request.user.sub;

  const updateUserUseCase = makeUpdateUserUseCase();
  const { user } = await updateUserUseCase.execute({ userId, ...data });

  const { password, ...userWithoutPassword } = user;

  return reply.status(200).send({ 
    message: "Perfil atualizado com sucesso",
    user: userWithoutPassword,
  });
}

