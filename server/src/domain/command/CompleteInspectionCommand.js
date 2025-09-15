import Inspection from '../entity/Inspection.js';
import db from '../../infrastructure/db/index.js';

class CompleteInspectionCommand {
  static async execute({ id, turnoverId, apartmentId, completedAt, findingsSummary, hasDamages, photosUrl, nextActorEmail }) {
    // Given an inspection appointment exists for the turnover
    const existingInspection = await db.findById('Inspection', id);

    if (!existingInspection) {
      throw new Error(`Inspection with ID ${id} not found.`);
    }

    // When the Inspector records findings and marks the inspection complete
    // Then Inspection Completed is recorded with a summary of results.
    const updatedInspectionData = {
      ...existingInspection,
      turnoverId, // Include turnoverId from request as it's part of the context
      apartmentId, // Include apartmentId from request as it's part of the context
      completedAt,
      findingsSummary,
      hasDamages,
      photosUrl,
      nextActorEmail,
    };

    const updatedInspection = await db.update('Inspection', id, updatedInspectionData);

    return updatedInspection;
  }
}

export default CompleteInspectionCommand;