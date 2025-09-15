import { v4 as uuidv4 } from 'uuid';

class Lease {
  constructor({
    id = uuidv4(),
    apartmentId,
    endDate,
    noticeDate,
    currentRent,
    propertyId,
    nextActorEmail,
    moveOutConfirmedAt,
    turnoverId,
    tenantName,
  }) {
    this.id = id;
    this.apartmentId = apartmentId;
    this.endDate = endDate;
    this.noticeDate = noticeDate;
    this.currentRent = currentRent;
    this.propertyId = propertyId;
    this.nextActorEmail = nextActorEmail;
    this.moveOutConfirmedAt = moveOutConfirmedAt;
    this.turnoverId = turnoverId;
    this.tenantName = tenantName;
  }

  update({
    apartmentId,
    endDate,
    noticeDate,
    currentRent,
    propertyId,
    nextActorEmail,
    moveOutConfirmedAt,
    turnoverId,
    tenantName,
  }) {
    if (apartmentId !== undefined) this.apartmentId = apartmentId;
    if (endDate !== undefined) this.endDate = endDate;
    if (noticeDate !== undefined) this.noticeDate = noticeDate;
    if (currentRent !== undefined) this.currentRent = currentRent;
    if (propertyId !== undefined) this.propertyId = propertyId;
    if (nextActorEmail !== undefined) this.nextActorEmail = nextActorEmail;
    if (moveOutConfirmedAt !== undefined) this.moveOutConfirmedAt = moveOutConfirmedAt;
    if (turnoverId !== undefined) this.turnoverId = turnoverId;
    if (tenantName !== undefined) this.tenantName = tenantName;
  }

  toJSON() {
    return {
      id: this.id,
      apartmentId: this.apartmentId,
      endDate: this.endDate,
      noticeDate: this.noticeDate,
      currentRent: this.currentRent,
      propertyId: this.propertyId,
      nextActorEmail: this.nextActorEmail,
      moveOutConfirmedAt: this.moveOutConfirmedAt,
      turnoverId: this.turnoverId,
      tenantName: this.tenantName,
    };
  }
}

export default Lease;