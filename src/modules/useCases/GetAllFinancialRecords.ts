import { ModuleService } from "../ModuleService";

export class GetAllFinancialRecords {
  private moduleService: ModuleService;

  constructor(moduleService: ModuleService) {
    this.moduleService = moduleService;
  }

  async execute(moduleId: number) {
    return await this.moduleService.getAllFinancialRecords(moduleId);
  }
}
