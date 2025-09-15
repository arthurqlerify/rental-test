import { v4 as uuidv4 } from 'uuid';

class Property {
  constructor({ id = uuidv4(), name, address, managerName, managerEmail, unitsCount }) {
    if (!name) throw new Error('Property name is required');
    if (!address) new Error('Property address is required');
    if (!managerName) throw new Error('Property manager name is required');
    if (!managerEmail) throw new Error('Property manager email is required');
    if (!unitsCount) throw new Error('Property units count is required');

    this.id = id;
    this.name = name;
    this.address = address;
    this.managerName = managerName;
    this.managerEmail = managerEmail;
    this.unitsCount = unitsCount;
  }

  update({ name, address, managerName, managerEmail, unitsCount }) {
    if (name !== undefined) this.name = name;
    if (address !== undefined) this.address = address;
    if (managerName !== undefined) this.managerName = managerName;
    if (managerEmail !== undefined) this.managerEmail = managerEmail;
    if (unitsCount !== undefined) this.unitsCount = unitsCount;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      managerName: this.managerName,
      managerEmail: this.managerEmail,
      unitsCount: this.unitsCount,
    };
  }
}

export default Property;