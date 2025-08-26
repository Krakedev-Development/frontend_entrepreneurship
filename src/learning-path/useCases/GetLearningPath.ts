import { LearningPathService } from "../LearningPathService";
import { GetLearningPathDTO } from "../dto/ModuleDTO";

export class GetLearningPath {
  private learningPathService: LearningPathService;

  constructor(learningPathService: LearningPathService) {
    this.learningPathService = learningPathService;
  }

  async execute(data: GetLearningPathDTO) {
    return await this.learningPathService.getLearningPath(data.businessId);
  }
}
