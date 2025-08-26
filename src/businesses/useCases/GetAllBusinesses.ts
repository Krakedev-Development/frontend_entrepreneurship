import { BusinessService } from "../BusinessService";

export class GetAllBusinesses {
  private businessService: BusinessService;

  constructor(businessService: BusinessService) {
    this.businessService = businessService;
  }

  async execute() {
    return await this.businessService.getAllBusinesses();
  }
}
