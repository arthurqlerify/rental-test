import { v4 as uuidv4 } from 'uuid';
import RenovationCase from '../entity/RenovationCase.js';
import db from '../../infrastructure/db/index.js';

class RequestRenovationEstimateCommand {
  static async execute({ turnoverId, apartmentId, requestedLevels, scopeNotes, targetReadyDate, nextActorEmail }) {
    // Generate a new ID for the Renovation Case
    const id = uuidv4();

    const renovationCase = new RenovationCase({
      id,
      turnoverId,
      apartmentId,
      requestedLevels,
      scopeNotes,
      targetReadyDate,
      nextActorEmail,
    });

    await db.insert('RenovationCase', renovationCase.toJSON());

    // The GWT implies recording the estimate and notifying the construction department.
    // In this scope, "recording" means persisting the RenovationCase entity.
    // "Notifying the construction department" is represented by setting nextActorEmail.
    return renovationCase.toJSON();
  }
}

export default RequestRenovationEstimateCommand;