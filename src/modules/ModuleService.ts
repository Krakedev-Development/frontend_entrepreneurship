import { ModuleContent} from "./entities/ModuleContent";
import { FinancialRecord } from "./entities/FinancialRecord";

export class ModuleService {
  private static instance: ModuleService;
  
  private moduleContents: ModuleContent[] = [
    new ModuleContent(
      1,
      "Costos Fijos",
      "Aprende los conceptos básicos de costos empresariales",
      "https://www.youtube.com/embed/_ZQe_6JV4Ys?si=PkPXOObKR2CC7KXa",
    ),
    new ModuleContent(
      2,
      "Modulo 2",
      "Modulo 2",
      null,      
    )
  ];

  private financialRecords: FinancialRecord[] = [
    new FinancialRecord(1, 1, "Costo Fijo 1", 500),    
    new FinancialRecord(2, 1, "Alquiler", 900),
  ];

  private constructor() {}

  public static getInstance(): ModuleService {
    if (!ModuleService.instance) {
      ModuleService.instance = new ModuleService();
    }
    return ModuleService.instance;
  }

  async getModuleContent(moduleId: number): Promise<ModuleContent | null> {
    return this.moduleContents.find(content => content.id === moduleId) || null;
  }

  async getAllFinancialRecords(moduleId: number): Promise<FinancialRecord[]> {
    return this.financialRecords.filter(record => record.moduleId === moduleId);
  }

  async addFinancialRecord(record: Omit<FinancialRecord, 'id'>): Promise<FinancialRecord> {
    const newRecord = new FinancialRecord(
      Date.now(),
      record.moduleId,
      record.name,
      record.amount,
    );
    this.financialRecords.push(newRecord);
    return newRecord;
  }

  async updateFinancialRecord(id: number, updates: Partial<FinancialRecord>): Promise<FinancialRecord | null> {
    const recordIndex = this.financialRecords.findIndex(r => r.id === id);
    if (recordIndex !== -1) {
      this.financialRecords[recordIndex] = { ...this.financialRecords[recordIndex], ...updates };
      return this.financialRecords[recordIndex];
    }
    return null;
  }

  async deleteFinancialRecord(id: number): Promise<boolean> {
    const recordIndex = this.financialRecords.findIndex(r => r.id === id);
    if (recordIndex !== -1) {
      this.financialRecords.splice(recordIndex, 1);
      return true;
    }
    return false;
  }
}
