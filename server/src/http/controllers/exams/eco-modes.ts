import { FastifyReply, FastifyRequest } from "fastify";
import { getAllPdfModes } from "../../../use-cases/pdf-layout-presets";

export async function ecoModes(_request: FastifyRequest, reply: FastifyReply) {
  const modes = getAllPdfModes();
  return reply.status(200).send({ modes });
}
