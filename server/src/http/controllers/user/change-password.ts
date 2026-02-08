import bcrypt from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserRepository } from "../../../repositories/pg/user-repository";

export async function changePassword(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
  });

  const { currentPassword, newPassword } = bodySchema.parse(request.body);
  const userId = request.user.sub;

  const userRepository = new UserRepository();
  const user = await userRepository.findById(userId);

  if (!user) {
    return reply.status(404).send({ message: "Usuário não encontrado" });
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    return reply.status(400).send({ message: "Senha atual incorreta" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await userRepository.update(userId, { password: hashedPassword });

  return reply.status(200).send({ message: "Senha alterada com sucesso" });
}

