export interface CreateAlternativeDTO {
    text: string;
    isCorrect: boolean;
    questionId: string;
}

export interface UpdateAlternativeDTO {
    text?: string;
    isCorrect?: boolean;
}

export interface IAlternativeRepository {
    create(data: CreateAlternativeDTO): Promise<{ id: string }>;
    update(id: string, data: UpdateAlternativeDTO): Promise<void>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<any>;
}
