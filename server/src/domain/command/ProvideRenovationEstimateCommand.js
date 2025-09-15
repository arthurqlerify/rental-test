import db from '../../infrastructure/db/index.js';

class ProvideRenovationEstimateCommand {
  static async execute({ id, costGood, costBetter, costPremium, leadDaysGood, leadDaysBetter, leadDaysPremium, nextActorEmail }) {
    const existingCase = await db.findById('RenovationCase', id);

    if (!existingCase) {
      throw new Error(`Renovation Case with ID ${id} not found.`);
    }

    // According to GWT: "When the ConstrDept submits costs, lead times and assumptions for each renovation level"
    // This implies updating the RenovationCase with the provided estimate details.
    const updates = {
      costGood,
      costBetter,
      costPremium,
      leadDaysGood,
      leadDaysBetter,
      leadDaysPremium,
      nextActorEmail,
    };

    const updatedCase = await db.update('RenovationCase', id, updates);
    return updatedCase;
  }
}

export default ProvideRenovationEstimateCommand;