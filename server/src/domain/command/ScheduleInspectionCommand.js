import { v4 as uuidv4 } from 'uuid';
import Inspection from '../entity/Inspection.js';
import db from '../../infrastructure/db/index.js';

class ScheduleInspectionCommand {
  static async execute({ turnoverId, apartmentId, scheduledAt, assignedToEmail, locationNotes, nextActorEmail }) {
    // GIVEN an active turnover and available inspection slots before or at move-out
    // WHEN the PropertyMgr schedules the inspection with a date, time and inspector
    if (!turnoverId || !apartmentId || !scheduledAt || !assignedToEmail) {
      throw new Error('Missing required fields for scheduling an inspection: turnoverId, apartmentId, scheduledAt, assignedToEmail.');
    }

    const inspection = new Inspection({
      id: uuidv4(),
      turnoverId,
      apartmentId,
      scheduledAt,
      assignedToEmail,
      locationNotes,
      nextActorEmail,
    });

    // THEN Inspection Scheduled is recorded with the appointment details.
    await db.insert('Inspection', inspection.toJSON());
    return inspection.toJSON();
  }
}

export default ScheduleInspectionCommand;