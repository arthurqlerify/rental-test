import WorkOrder from '../entity/WorkOrder.js';
import db from '../../infrastructure/db/index.js';

class CompleteWorkOrderCommand {
  static async execute({ id, apartmentId, actualStartDate, actualEndDate, completionNotes, photosUrl, varianceNotes, nextActorEmail }) {
    const existingWorkOrder = await db.findById('WorkOrder', id);

    if (!existingWorkOrder) {
      throw new Error('Work Order not found.');
    }

    // The GWT description implies updating an existing work order with completion details.
    // The incoming 'apartmentId' is likely for context or validation, but the GWT focuses on the completion details.
    // Assuming 'apartmentId' is already part of the existingWorkOrder and doesn't change on completion.
    // The only fields updated are the completion-specific ones and the nextActorEmail.
    const updatedWorkOrderData = {
      actualStartDate,
      actualEndDate,
      completionNotes,
      photosUrl,
      varianceNotes,
      nextActorEmail,
    };

    // Use the WorkOrder entity to ensure consistency, though db.update merges data directly.
    // The entity class itself doesn't need to be instantiated for an update,
    // as we are merging data into an existing record.
    const updatedWorkOrder = await db.update('WorkOrder', id, updatedWorkOrderData);

    return updatedWorkOrder;
  }
}

export default CompleteWorkOrderCommand;