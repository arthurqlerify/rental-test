import db from '../../infrastructure/db/index.js';

class GetAllInspectionsReadModel {
  static async query() {
    // The description "Get Inspection Findings" implies fetching all available inspection records.
    return await db.findAll('Inspection');
  }
}

export default GetAllInspectionsReadModel;