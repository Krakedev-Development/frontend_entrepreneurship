import { BusinessService } from "../BusinessService";
import type { CreateBusinessDTO } from "../dto/BusinessDTO";

export class CreateBusiness {
  private businessService: BusinessService;

  constructor(businessService: BusinessService) {
    this.businessService = businessService;
  }

  async execute(data: CreateBusinessDTO) {
    if (!data.name || !data.businessType) {
      throw new Error("El nombre y el tipo de negocio son obligatorios.");
    }
    console.log(data);
    return await this.businessService.createBusiness(data);
  }
}
