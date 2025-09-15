import Lease from '../entity/Lease.js';
import db from '../../infrastructure/db/index.js';

class MarkLeaseEndedCommand {
  static async execute({ id, apartmentId, endDate, moveOutConfirmedAt, turnoverId, nextActorEmail }) {
    // 1. Fetch existing Lease
    const existingLeaseData = await db.findById('Lease', id);
    if (!existingLeaseData) {
      throw new Error(`Lease with ID ${id} not found.`);
    }

    // 2. GWT Validation: "Given today matches the scheduled lease end date"
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    if (existingLeaseData.endDate !== today) {
      throw new Error(`Lease end date (${existingLeaseData.endDate}) does not match today's date (${today}).`);
    }

    // 3. GWT Validation: "and the lease is still active" (interpreted as moveOutConfirmedAt not yet set)
    if (existingLeaseData.moveOutConfirmedAt) {
      throw new Error('Lease is already marked as ended.');
    }

    // 4. "Then Lease Ended is recorded"
    // Update the lease with the provided fields from the request body.
    // `moveOutConfirmedAt` is the core field for marking the lease as ended.
    const updates = {
      apartmentId,
      endDate,
      moveOutConfirmedAt,
      turnoverId,
      nextActorEmail,
    };

    const updatedLease = await db.update('Lease', id, updates);

    // GWT: "and the associated turnover moves to awaiting vacancy confirmation."
    // This part cannot be implemented as per the rules:
    // - No Turnover schema with a 'status' field is defined in OpenAPI.
    // - Restricted from modifying other domain entities or inventing logic/fields not in OpenAPI.

    return updatedLease;
  }
}

export default MarkLeaseEndedCommand;