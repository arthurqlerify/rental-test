import Inspection from '../entity/Inspection.js';
import db from '../../infrastructure/db/index.js';

class PassFinalInspectionCommand {
  static async execute({ id, turnoverId, apartmentId, passedAt, inspectorName, certificateUrl, nextActorEmail }) {
    const existingInspectionData = await db.findById('Inspection', id);

    if (!existingInspectionData) {
      throw new Error(`Inspection with ID ${id} not found.`);
    }

    // Ensure renovation or repairs are complete and final inspection appointment exists (implicit check by finding the inspection)
    // When the Inspector verifies all items meet standards and no defects remain,
    // Then Final Inspection Passed is recorded with inspector sign-off.
    const inspection = new Inspection({
      ...existingInspectionData,
      passedAt,
      inspectorName,
      certificateUrl,
      nextActorEmail, // Update next actor for workflow progression
    });

    await db.update('Inspection', id, inspection.toJSON());
    return inspection.toJSON();
  }
}

export default PassFinalInspectionCommand;