import { v4 as uuid } from 'uuid';
import Turnover from '../entity/Turnover.js';
import db from '../../infrastructure/db/index.js';

class CreateTurnoverCommand {
  static async execute({ leaseId, apartmentId, targetReadyDate, propertyId, nextActorEmail }) {
    // GWT: "Given a lease has an end date scheduled and no turnover exists for that lease"
    // This implies a check for an existing turnover with the same leaseId.
    const existingTurnovers = await db.findAll('Turnover');
    const turnoverExistsForLease = existingTurnovers.some(
      (turnover) => turnover.leaseId === leaseId
    );

    if (turnoverExistsForLease) {
      throw new Error('A turnover already exists for this lease.');
    }

    const id = uuid(); // Generate unique ID for the new Turnover
    const newTurnover = new Turnover({
      id,
      leaseId,
      apartmentId,
      targetReadyDate,
      propertyId,
      nextActorEmail,
    });

    await db.insert('Turnover', newTurnover.toJSON());

    // GWT: "Then Turnover Created is recorded linking the lease, apartment and target dates."
    return newTurnover.toJSON();
  }
}

export default CreateTurnoverCommand;