import db from '../../infrastructure/db/index.js';

class GetAllRenovationCasesReadModel {
  static async query() {
    return await db.findAll('RenovationCase');
  }
}

export default GetAllRenovationCasesReadModel;