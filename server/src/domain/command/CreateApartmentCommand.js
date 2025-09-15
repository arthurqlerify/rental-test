import Apartment from '../entity/Apartment.js';
import db from '../../infrastructure/db/index.js';

class CreateApartmentCommand {
  static async execute({ propertyId, unitNumber, floorAreaSqm, bedrooms, status }) {
    const newApartment = new Apartment({ propertyId, unitNumber, floorAreaSqm, bedrooms, status });
    await db.insert('Apartment', newApartment.toJSON());
    return newApartment.toJSON();
  }
}

export default CreateApartmentCommand;