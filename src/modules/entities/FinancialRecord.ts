export class FinancialRecord {
  id: number;
  moduleId: number;
  name: string;
  amount: number;

  constructor(
    id: number,
    moduleId: number,
    name: string,
    amount: number,
  ) {
    this.id = id;
    this.moduleId = moduleId;
    this.name = name;
    this.amount = amount;
  }
}
