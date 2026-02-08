import type { IAlternative } from "./alternative";

export interface IQuestion {
  id: string;
  statement: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  user_id: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  alternatives: IAlternative[];
}

export interface CreateQuestionData {
  statement: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  isPublic: boolean;
  alternatives: { text: string; isCorrect: boolean }[];
}

export interface UpdateQuestionData {
  statement?: string;
  subject?: string;
  difficulty?: "easy" | "medium" | "hard";
  isPublic?: boolean;
}

export interface QuestionFilters {
  page?: number;
  limit?: number;
  subject?: string;
  difficulty?: string;
  search?: string;
  userId?: string;
  isPublic?: boolean;
  excludeUsedIn?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
