import db from '../../infrastructure/db/index.js';

class RecordApartmentVacatedCommand {
  /**
   * Records an apartment as vacated by updating an existing Turnover record.
   *
   * @param {object} params - The parameters for recording apartment vacated.
   * @param {string} params.id - The ID of the Turnover record to update.
   * @param {string} params.apartmentId - The ID of the apartment being vacated.
   * @param {string} params.vacatedAt - The timestamp when the apartment was vacated.
   * @param {string} params.keysReturned - Indicates if keys were returned ('true' or 'false').
   * @param {string} params.notes - Any notes related to the apartment vacation.
   * @param {string} params.nextActorEmail - Email of the next actor to be notified.
   * @returns {Promise<object>} The updated Turnover record.
   * @throws {Error} If the Turnover record is not found or the update fails.
   */
  static async execute({ id, apartmentId, vacatedAt, keysReturned, notes, nextActorEmail }) {
    const existingTurnover = await db.findById('Turnover', id);

    if (!existingTurnover) {
      throw new Error(`Turnover with ID ${id} not found.`);
    }

    // The GWT description implies updating the vacated status.
    // The request body fields directly map to properties of the Turnover entity.
    const updates = {
      vacatedAt,
      keysReturned,
      notes,
      nextActorEmail,
      // apartmentId is provided in the request body for context,
      // but is typically a static identifier of the turnover and not updated by this command.
      // We are updating specific vacation-related fields.
    };

    const updatedTurnover = await db.update('Turnover', id, updates);

    if (!updatedTurnover) {
      throw new Error(`Failed to update Turnover with ID ${id}.`);
    }

    return updatedTurnover;
  }
}

export default RecordApartmentVacatedCommand;