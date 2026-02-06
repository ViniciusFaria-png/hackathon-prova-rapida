import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PGExamRepository } from "../../../repositories/pg/exam-repository";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { makeFindExamByIdUseCase } from "../../../use-cases/factories/make-find-exam-by-id-use-case";

export async function preview(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const querySchema = z.object({
    versionId: z.string().uuid().optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const { versionId } = querySchema.parse(request.query);

  let title: string;
  let subject: string;
  let versionLabel: string | null = null;
  let questions: Array<{
    id: string;
    statement: string;
    subject: string;
    position: number;
    alternatives: Array<{ id: string; text: string; is_correct: boolean }>;
  }>;

  if (versionId) {
    const examRepository = new PGExamRepository();
    const version = await examRepository.findVersionById(versionId);
    if (!version) throw new ResourceNotFoundError();

    const exam = await examRepository.findById(version.exam_id);
    if (!exam) throw new ResourceNotFoundError();

    title = exam.title;
    subject = exam.subject;
    versionLabel = version.version_name;
    questions = version.questions;
  } else {
    const findExamUseCase = makeFindExamByIdUseCase();
    const exam = await findExamUseCase.handler(id);
    title = exam.title;
    subject = exam.subject;
    questions = exam.questions;
  }

  const previewData = {
    title,
    subject,
    versionLabel,
    questions: questions.map((q, index) => ({
      number: index + 1,
      statement: q.statement,
      alternatives: q.alternatives.map((alt, altIndex) => ({
        letter: String.fromCharCode(65 + altIndex),
        text: alt.text,
      })),
    })),
  };

  return reply.status(200).send({
    success: true,
    data: previewData,
  });
}
