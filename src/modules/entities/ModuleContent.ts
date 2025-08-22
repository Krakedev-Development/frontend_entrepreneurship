export class ModuleContent {
  id: number;
  title: string;
  concept: string;
  resourceUrl: string;

  constructor(
    id: number,
    title: string,
    concept: string,
    resourceUrl: string
  ) {
    this.id = id;
    this.title = title;
    this.concept = concept;
    this.resourceUrl = resourceUrl;
  }
}