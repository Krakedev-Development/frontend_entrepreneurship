export class Module {
  id: number;
  title: string;
  description: string;
  status: string;
  order: number;
  businessId: number;
  estimatedTime: number;
  isCompleted: boolean;

  constructor(
    id: number,
    title: string,
    description: string,
    status: string,
    order: number,
    businessId: number,
    estimatedTime: number,
    isCompleted: boolean = false
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.order = order;
    this.businessId = businessId;
    this.estimatedTime = estimatedTime;
    this.isCompleted = isCompleted;
  }

  markAsCompleted(): void {
    this.isCompleted = true;
    this.status = "COMPLETED";
  }

  markAsInProgress(): void {
    this.status = "IN_PROGRESS";
  }
}
