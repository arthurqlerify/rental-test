import db from '../../infrastructure/db/index.js';

class CompleteTurnoverCommand {
  static async execute({ id, readyToRentDate, marketingEmail, notes }) {
    // 1. Load the Turnover entity using the provided id.
    const turnover = await db.findById('Turnover', id);

    if (!turnover) {
      throw new Error(`Turnover with ID ${id} not found.`);
    }

    // 2. Implement business logic from GWT descriptions:
    // "Given the final inspection has passed and there are no open work orders"
    if (!turnover.finalInspectionPassedAt) {
      throw new Error('Final inspection has not passed for this turnover.');
    }

    if (turnover.openWorkOrdersCount !== '0') {
      throw new Error(`There are ${turnover.openWorkOrdersCount} open work orders for this turnover.`);
    }

    // "When Automation completes the turnover case, Then Turnover Completed is recorded
    // and the apartment status becomes ready to rent and marketing is notified."
    const updates = {
      readyToRentDate: readyToRentDate,
      // As per GWT "apartment status becomes ready to rent", listingReady must be 'true'.
      listingReady: 'true',
      marketingEmail: marketingEmail,
      notes: notes,
      // The 'apartmentId' from the input is not used here to update other entities,
      // respecting the rule "Do not touch entities, read models, queries, or any other domains."
    };

    // 3. Update the Turnover entity in the database.
    const updatedTurnover = await db.update('Turnover', id, updates);

    if (!updatedTurnover) {
      throw new Error(`Failed to update Turnover with ID ${id}.`);
    }

    return updatedTurnover;
  }
}

export default CompleteTurnoverCommand;