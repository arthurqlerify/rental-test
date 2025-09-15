import db from '../../infrastructure/db/index.js';

class GetLeaseByIdReadModel {
  static async query(id) {
    // The business logic for 'Get Lease Details' implies fetching a single lease by its ID.
    // The 'id' dataField is marked as 'filter', confirming the lookup by ID.
    // The entity name 'Lease' is derived from the Related Entity Information.
    const lease = await db.findById('Lease', id);
    return lease;
  }
}

export default GetLeaseByIdReadModel;