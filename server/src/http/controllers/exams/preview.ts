import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindExamByIdUseCase } from "../../../use-cases/factories/make-find-exam-by-id-use-case";

export async function preview(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const findExamUseCase = makeFindExamByIdUseCase();
  const exam = await findExamUseCase.handler(id);

  // Formatar para preview (pode ser customizado conforme necessidade)
  const previewData = {
    title: exam.title,
    subject: exam.subject,
    questions: exam.questions.map((q, index) => ({
      number: index + 1,
      statement: q.statement,
      alternatives: q.alternatives.map((alt, altIndex) => ({
        letter: String.fromCharCode(65 + altIndex), // A, B, C, D...
        text: alt.text,
      })),
    })),
  };

  return reply.status(200).send(previewData);
}
