import db from '../../infrastructure/db/index.js';

class GetAllTurnoversReadModel {
  static async query() {
    // The OpenAPI specification for /get-all-turnovers defines no parameters,
    // indicating a simple retrieval of all turnovers.
    // The descriptions "Get Turnover Overview", "Get Move-out Checklist",
    // and "Get Ready-to-Rent Turnovers" imply specific filters or views,
    // but without corresponding path parameters in the OpenAPI spec for this
    // particular endpoint, no filtering logic can be applied here.
    return await db.findAll('Turnover');
  }
}

export default GetAllTurnoversReadModel;