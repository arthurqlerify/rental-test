import RenovationReport from '../entity/RenovationReport.js';
import db from '../../infrastructure/db/index.js';
import { v4 as uuidv4 } from 'uuid';

class CreateRenovationReportCommand {
  static async execute({ turnoverId, inspectionId, apartmentId, damageSeverity, estimatedRepairCost, damageSummary, nextActorEmail }) {
    const id = uuidv4();
    const renovationReport = new RenovationReport({
      id,
      turnoverId,
      inspectionId,
      apartmentId,
      damageSeverity,
      estimatedRepairCost,
      damageSummary,
      nextActorEmail,
    });
    await db.insert('RenovationReport', renovationReport.toJSON());
    return renovationReport.toJSON();
  }
}

export default CreateRenovationReportCommand;