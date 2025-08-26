import { ModuleService } from "../ModuleService";
import type { GetModuleContentDTO } from "../dto/ModuleContentDTO";

export class GetModuleContent {
  private moduleService: ModuleService;

  constructor(moduleService: ModuleService) {
    this.moduleService = moduleService;
  }

  async execute(data: GetModuleContentDTO) {
    return await this.moduleService.getModuleContent(data.moduleId);
  }
}
