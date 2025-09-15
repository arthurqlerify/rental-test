import db from '../../infrastructure/db/index.js';

class GetAllWorkOrdersReadModel {
  static async query() {
    // The allDescriptions for this read model imply retrieving work order details.
    // For a "Get All" operation, without specific filters defined in the OpenAPI spec parameters
    // or further details in allDescriptions, we retrieve all records.
    return await db.findAll('WorkOrder');
  }
}

export default GetAllWorkOrdersReadModel;