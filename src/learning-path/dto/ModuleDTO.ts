export interface ModuleDTO {
  id: number;
  title: string;
  description: string;
  status: string;
  order: number;
  businessId: number;
  estimatedTime: number;
  isCompleted: boolean;
}

export interface GetLearningPathDTO {
  businessId: number;
}
