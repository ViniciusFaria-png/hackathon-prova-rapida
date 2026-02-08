export interface IAlternative {
  id: string;
  text: string;
  is_correct: boolean;
  question_id: string;
}

export interface CreateAlternativeData {
  text: string;
  isCorrect: boolean;
}

export interface UpdateAlternativeData {
  text?: string;
  isCorrect?: boolean;
}
