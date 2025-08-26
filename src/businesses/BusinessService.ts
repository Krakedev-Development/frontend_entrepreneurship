import { Business } from "./entities/Business";
import type { CreateBusinessDTO } from "./dto/BusinessDTO";

export class BusinessService {
  private static instance: BusinessService;
  private businesses: Business[] = [];

  private constructor() {}

  public static getInstance(): BusinessService {
    if (!BusinessService.instance) {
      BusinessService.instance = new BusinessService();
    }
    return BusinessService.instance;
  }

  async createBusiness(data: CreateBusinessDTO): Promise<Business> {
    const newBusiness = new Business(
      this.businesses.length + 1,
      data.userId,
      data.businessType,
      data.name,
      data.location,
      data.sizeId,
      new Date(),
      data.icon || "",
      data.color || "",
      0,
      data.totalModules ?? 10,
      data.completedModules ?? 0
    );
    
    this.businesses.push(newBusiness);
    console.log('Businesses after creation:', this.businesses);
    return newBusiness;
  }

  async getAllBusinesses(): Promise<Business[]> {
    return this.businesses;
  }

  async getBusinessById(id: number): Promise<Business | null> {
    return this.businesses.find(b => b.id === id) || null;
  }

  async updateBusinessProgress(id: number, completed: number, total: number): Promise<Business | null> {
    const business = this.businesses.find(b => b.id === id);
    if (business) {
      business.updateProgress(completed, total);
      return business;
    }
    return null;
  }
}
