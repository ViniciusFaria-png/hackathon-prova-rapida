import type { IAlternative } from "./alternative";

export interface IExamQuestion {
  id: string;
  statement: string;
  subject: string;
  position: number;
  alternatives: IAlternative[];
}

export interface IExam {
  id: string;
  title: string;
  subject: string;
  user_id: string;
  is_finalized?: boolean;
  created_at: string;
  updated_at: string;
  questions: IExamQuestion[];
  versions?: IExamVersion[];
  questions_count?: number;
}

export interface IExamVersion {
  id: string;
  exam_id: string;
  version_name: string;
  shuffle_seed: number;
  status: "draft" | "finalized";
  created_at: string;
}

export interface ExamPreview {
  title: string;
  subject: string;
  versionLabel: string | null;
  questions: {
    number: number;
    statement: string;
    alternatives: { letter: string; text: string }[];
  }[];
}

export interface ExamStats {
  totalQuestions: number;
  totalVersions: number;
  subjects: string[];
  createdAt: string;
  lastModified: string;
}

export interface ExamFilters {
  page?: number;
  limit?: number;
  subject?: string;
  search?: string;
  status?: "draft" | "finalized";
}

export interface CreateExamData {
  title: string;
  subject: string;
}

export interface UpdateExamData {
  title?: string;
  subject?: string;
}
