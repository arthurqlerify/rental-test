import db from '../../infrastructure/db/index.js';
import WorkOrder from '../entity/WorkOrder.js'; // Assuming WorkOrder entity exists for type consistency

class ScheduleWorkOrderCommand {
  static async execute({ id, apartmentId, startDate, endDate, crewName, assignedToEmail, materialsReady, nextActorEmail }) {
    // Given a work order exists
    const existingWorkOrder = await db.findById('WorkOrder', id);
    if (!existingWorkOrder) {
      throw new Error(`Work Order with ID ${id} not found.`);
    }

    // When the ConstrDept assigns a crew and sets start and end dates
    // Then Work Order Scheduled is recorded with dates and assigned team.
    const updatedFields = {
      apartmentId, // Included from OpenAPI request body
      startDate,
      endDate,
      crewName,
      assignedToEmail,
      materialsReady, // Included from OpenAPI request body
      nextActorEmail, // Included from OpenAPI request body
    };

    const updatedWorkOrder = await db.update('WorkOrder', id, updatedFields);

    return updatedWorkOrder;
  }
}

export default ScheduleWorkOrderCommand;