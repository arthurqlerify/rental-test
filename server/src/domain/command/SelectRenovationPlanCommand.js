import RenovationCase from '../entity/RenovationCase.js'; // Assuming RenovationCase entity exists
import db from '../../infrastructure/db/index.js';

class SelectRenovationPlanCommand {
  static async execute({
    id,
    apartmentId, // Included for completeness but usually static for a case; not directly updated by this command logic.
    selectedLevel,
    budgetApproved,
    expectedCompletionDate,
    projectedRent,
    decisionReason,
    nextActorEmail,
  }) {
    // Find the existing RenovationCase
    const existingRenovationCase = await db.findById('RenovationCase', id);

    if (!existingRenovationCase) {
      throw new Error(`Renovation Case with ID ${id} not found.`);
    }

    // Prepare updates based on the selected plan
    const updates = {
      selectedLevel,
      budgetApproved,
      expectedCompletionDate,
      projectedRent,
      decisionReason,
      nextActorEmail,
    };

    // Update the RenovationCase in the database
    const updatedRenovationCase = await db.update('RenovationCase', id, updates);

    return updatedRenovationCase;
  }
}

export default SelectRenovationPlanCommand;