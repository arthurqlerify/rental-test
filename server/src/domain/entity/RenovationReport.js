import { v4 as uuidv4 } from 'uuid';

class RenovationReport {
  constructor({
    id = uuidv4(),
    turnoverId, // Expects an object conforming to Turnover schema
    inspectionId, // Expects an object conforming to Inspection schema
    apartmentId, // Expects an object conforming to Apartment schema
    damageSeverity,
    estimatedRepairCost,
    damageSummary,
    nextActorEmail,
  }) {
    this.id = id;
    this.turnoverId = turnoverId;
    this.inspectionId = inspectionId;
    this.apartmentId = apartmentId;
    this.damageSeverity = damageSeverity;
    this.estimatedRepairCost = estimatedRepairCost;
    this.damageSummary = damageSummary;
    this.nextActorEmail = nextActorEmail;
  }

  toJSON() {
    return {
      id: this.id,
      turnoverId: this.turnoverId,
      inspectionId: this.inspectionId,
      apartmentId: this.apartmentId,
      damageSeverity: this.damageSeverity,
      estimatedRepairCost: this.estimatedRepairCost,
      damageSummary: this.damageSummary,
      nextActorEmail: this.nextActorEmail,
    };
  }
}

export default RenovationReport;