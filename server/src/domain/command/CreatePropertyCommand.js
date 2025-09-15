import Property from '../entity/Property.js';
import db from '../../infrastructure/db/index.js';
import { v4 as uuidv4 } from 'uuid';

class CreatePropertyCommand {
  static async execute({ name, address, managerName, managerEmail, unitsCount }) {
    const propertyId = uuidv4();
    const property = new Property({
      id: propertyId,
      name,
      address,
      managerName,
      managerEmail,
      unitsCount,
    });
    await db.insert('Property', property.toJSON());
    return property.toJSON();
  }
}

export default CreatePropertyCommand;