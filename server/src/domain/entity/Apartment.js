import { v4 as uuidv4 } from 'uuid';

class Apartment {
  constructor({ id = uuidv4(), propertyId, unitNumber, floorAreaSqm, bedrooms, status }) {
    this.id = id;
    this.propertyId = propertyId;
    this.unitNumber = unitNumber;
    this.floorAreaSqm = floorAreaSqm;
    this.bedrooms = bedrooms;
    this.status = status;
  }

  toJSON() {
    return {
      id: this.id,
      propertyId: this.propertyId,
      unitNumber: this.unitNumber,
      floorAreaSqm: this.floorAreaSqm,
      bedrooms: this.bedrooms,
      status: this.status,
    };
  }
}

export default Apartment;