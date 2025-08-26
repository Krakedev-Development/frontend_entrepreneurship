export class ModuleContent {
  id: number;
  title: string;
  concept: string;
  resourceUrl: string | null;

  constructor(
    id: number,
    title: string,
    concept: string,
    resourceUrl: string | null
  ) {
    this.id = id;
    this.title = title;
    this.concept = concept;
    this.resourceUrl = resourceUrl;
  }
}