export interface CreateExamDTO {
    title: string;
    subject: string;
    userId: string;
}

export interface UpdateExamDTO {
    title?: string;
    subject?: string;
}

export interface AddQuestionToExamDTO {
    examId: string;
    questionId: string;
    position: number;
}

export interface ExamWithQuestions {
    id: string;
    title: string;
    subject: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    questions: Array<{
        id: string;
        statement: string;
        subject: string;
        position: number;
        alternatives: Array<{
            id: string;
            text: string;
            is_correct: boolean;
        }>;
    }>;
}

export interface ExamVersion {
    id: string;
    exam_id: string;
    version_name: string;
    shuffle_seed: number;
    created_at: Date;
}

export interface IExamRepository {
    create(data: CreateExamDTO): Promise<{ id: string }>;
    findAllByUserId(userId: string): Promise<any[]>;
    findById(id: string): Promise<ExamWithQuestions | null>;
    update(id: string, data: UpdateExamDTO): Promise<void>;
    delete(id: string): Promise<void>;
    addQuestion(data: AddQuestionToExamDTO): Promise<void>;
    removeQuestion(examId: string, questionId: string): Promise<void>;
    reorderQuestions(examId: string, questionOrders: Array<{ questionId: string; position: number }>): Promise<void>;
    duplicate(examId: string, userId: string, newTitle: string): Promise<{ id: string }>;
    createVersion(examId: string, versionName: string, shuffleSeed: number, questionPositions: Array<{ questionId: string; position: number }>): Promise<{ id: string }>;
    findVersionsByExamId(examId: string): Promise<ExamVersion[]>;
}