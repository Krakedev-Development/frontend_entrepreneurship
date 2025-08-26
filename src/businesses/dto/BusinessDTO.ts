export interface BusinessDTO {
  id: number;
  userId: number;
  businessType: string;
  name: string;
  location: string;
  sizeId: number;
  createdAt: Date | null;
  icon: string;
  color: string;
  progress: number;
  totalModules?: number;
  completedModules?: number;
}

export interface CreateBusinessDTO {
  userId: number;
  businessType: string;
  name: string;
  location: string;
  sizeId: number;
  icon?: string;
  color?: string;
  totalModules?: number;
  completedModules?: number;
}
