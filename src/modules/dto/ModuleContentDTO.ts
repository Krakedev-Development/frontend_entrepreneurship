export interface ModuleContentDTO {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  concepts: string[];
  exercises: ExerciseDTO[];
}

export interface ExerciseDTO {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FinancialRecordDTO {
  id: number;
  moduleId: number;
  concept: string;
  value: number;
  type: 'income' | 'expense';
  description: string;
}

export interface GetModuleContentDTO {
  moduleId: number;
}
