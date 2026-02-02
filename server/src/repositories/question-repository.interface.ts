export interface CreateQuestionDTO {
    statement: string;
    subject: string;
    userId?: string; // null para questões públicas
    isPublic: boolean;
    alternatives: Array<{
        text: string;
        isCorrect: boolean;
    }>;
}

export interface UpdateQuestionDTO {
    statement?: string;
    subject?: string;
    isPublic?: boolean;
}

export interface QuestionWithAlternatives {
    id: string;
    statement: string;
    subject: string;
    user_id: string | null;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
    alternatives: Array<{
        id: string;
        text: string;
        is_correct: boolean;
    }>;
}

export interface FindQuestionsFilters {
    subject?: string;
    search?: string;
    userId?: string;
    isPublic?: boolean;
}

export interface IQuestionRepository {
    create(data: CreateQuestionDTO): Promise<{ id: string }>;
    findAll(filters: FindQuestionsFilters): Promise<QuestionWithAlternatives[]>;
    findById(id: string): Promise<QuestionWithAlternatives | null>;
    update(id: string, data: UpdateQuestionDTO): Promise<void>;
    delete(id: string): Promise<void>;
}
