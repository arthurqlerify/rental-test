import { v4 as uuidv4 } from 'uuid';
import WorkOrder from '../entity/WorkOrder.js';
import db from '../../infrastructure/db/index.js';

class CreateWorkOrderCommand {
  static async execute({
    renovationCaseId,
    turnoverId,
    apartmentId,
    scopeSummary,
    accessDetails,
    materialsList,
    nextActorEmail,
  }) {
    const id = uuidv4();

    const workOrder = new WorkOrder({
      id,
      renovationCaseId,
      turnoverId,
      apartmentId,
      scopeSummary,
      accessDetails,
      materialsList,
      nextActorEmail,
    });

    await db.insert('WorkOrder', workOrder.toJSON());

    return workOrder.toJSON();
  }
}

export default CreateWorkOrderCommand;