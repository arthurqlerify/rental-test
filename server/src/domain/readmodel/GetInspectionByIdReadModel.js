import db from '../../infrastructure/db/index.js';

class GetInspectionByIdReadModel {
  static async query(id) {
    const inspection = await db.findById('Inspection', id);

    if (!inspection) {
      return null;
    }

    // Filter fields to strictly match the OpenAPI specification's 200 response schema
    const filteredInspection = {
      id: inspection.id,
      turnoverId: inspection.turnoverId,
      apartmentId: inspection.apartmentId,
      scheduledAt: inspection.scheduledAt,
      assignedToEmail: inspection.assignedToEmail,
      locationNotes: inspection.locationNotes,
      inspectorName: inspection.inspectorName,
      checklist: inspection.checklist,
    };

    return filteredInspection;
  }
}

export default GetInspectionByIdReadModel;