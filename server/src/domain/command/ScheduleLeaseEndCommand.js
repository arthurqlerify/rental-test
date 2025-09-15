import db from '../../infrastructure/db/index.js';
// The Lease entity is assumed to exist and its structure aligns with OpenAPI schema definitions.
// No explicit import of Lease entity class needed for db.update operation, as it directly manipulates stored data.

class ScheduleLeaseEndCommand {
  static async execute({ id, apartmentId, endDate, noticeDate, currentRent, propertyId, nextActorEmail }) {
    // GIVEN an active lease, WHEN PropertyMgr schedules the lease end
    const existingLease = await db.findById('Lease', id);

    if (!existingLease) {
      throw new Error(`Lease with ID ${id} not found.`);
    }

    // THEN Lease End Scheduled is recorded with leaseId, apartmentId and endDate
    // Update the existing lease with the provided details.
    const updatedLeaseData = {
      ...existingLease,
      apartmentId,
      endDate,
      noticeDate,
      currentRent,
      propertyId,
      nextActorEmail,
    };

    const result = await db.update('Lease', id, updatedLeaseData);

    if (!result) {
      throw new Error(`Failed to update Lease with ID ${id}.`);
    }

    // and next-step notifications are queued (this part is an external effect and not implemented here,
    // as per the rule to only implement logic described for the command's primary action).
    return result;
  }
}

export default ScheduleLeaseEndCommand;