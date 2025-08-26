import { Module } from "./entities/Module";
import { ModuleStatus } from "./entities/ModuleStatus";

export class LearningPathService {
  private static instance: LearningPathService;

  private modules: Module[] = [
    new Module(1, "Costos Fijos", "Aprende los conceptos básicos de costos", ModuleStatus.InProgress, 1, 1, 30, true),
    new Module(2, "Modulo 2", "Profundiza en costos variables", ModuleStatus.Locked, 2, 1, 45, false),
    new Module(3, "Modulo 3", "Entiende los costos fijos", ModuleStatus.Locked, 3, 1, 60, false),
    new Module(6, "Modulo 6", "Calcula el punto de equilibrio", ModuleStatus.Locked, 6, 1, 90, false),
    new Module(5, "Modulo 5", "Calcula el punto de equilibrio", ModuleStatus.Locked, 5, 1, 90, false),
    new Module(4, "Modulo 4", "Calcula el punto de equilibrio", ModuleStatus.Locked, 4, 1, 90, false),
    new Module(7, "Modulo 7", "Calcula el punto de equilibrio", ModuleStatus.Locked, 7, 1, 90, false),
    new Module(8, "Modulo 8", "Calcula el punto de equilibrio", ModuleStatus.Locked, 8, 1, 90, false),
    new Module(9, "Modulo 9", "Calcula el punto de equilibrio", ModuleStatus.Locked, 9, 1, 90, false),
  ];

  private constructor() {}

  public static getInstance(): LearningPathService {
    if (!LearningPathService.instance) {
      LearningPathService.instance = new LearningPathService();
    }
    return LearningPathService.instance;
  }

  async getLearningPath(businessId: number): Promise<Module[]> {
    return this.modules.filter(() => businessId === businessId);
  }

  async getModuleById(id: number): Promise<Module | null> {
    return this.modules.find(module => module.id === id) || null;
  }

  async markModuleAsCompleted(id: number): Promise<Module | null> {
    const module = this.modules.find(m => m.id === id);
    if (module) {
      module.markAsCompleted();
      return module;
    }
    return null;
  }

  async markModuleAsInProgress(id: number): Promise<Module | null> {
    const module = this.modules.find(m => m.id === id);
    if (module) {
      module.markAsInProgress();
      return module;
    }
    return null;
  }
}
