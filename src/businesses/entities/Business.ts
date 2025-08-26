export class Business {
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

  constructor(
    id: number,
    userId: number,
    businessType: string,
    name: string,
    location: string,
    sizeId: number,
    createdAt: Date | null,
    icon: string = "",
    color: string = "",
    progress: number = 0,
    totalModules?: number,
    completedModules?: number
  ) {
    this.id = id;
    this.userId = userId;
    this.businessType = businessType;
    this.name = name;
    this.location = location;
    this.sizeId = sizeId;
    this.createdAt = createdAt;
    this.icon = icon;
    this.color = color;
    this.progress = progress;
    this.totalModules = totalModules;
    this.completedModules = completedModules;
  }

  updateProgress(completed: number, total: number): void {
    this.completedModules = completed;
    this.totalModules = total;
    this.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}
