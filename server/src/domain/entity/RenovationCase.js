import { v4 as uuidv4 } from 'uuid';

class RenovationCase {
  constructor({
    id = uuidv4(),
    turnoverId = null,
    apartmentId = null,
    requestedLevels = null,
    scopeNotes = null,
    targetReadyDate = null,
    nextActorEmail = null,
    costGood = null,
    costBetter = null,
    costPremium = null,
    leadDaysGood = null,
    leadDaysBetter = null,
    leadDaysPremium = null,
    selectedLevel = null,
    budgetApproved = null,
    expectedCompletionDate = null,
    currentRent = null,
    projectedRent = null,
    decisionReason = null,
  }) {
    this.id = id;
    this.turnoverId = turnoverId;
    this.apartmentId = apartmentId;
    this.requestedLevels = requestedLevels;
    this.scopeNotes = scopeNotes;
    this.targetReadyDate = targetReadyDate;
    this.nextActorEmail = nextActorEmail;
    this.costGood = costGood;
    this.costBetter = costBetter;
    this.costPremium = costPremium;
    this.leadDaysGood = leadDaysGood;
    this.leadDaysBetter = leadDaysBetter;
    this.leadDaysPremium = leadDaysPremium;
    this.selectedLevel = selectedLevel;
    this.budgetApproved = budgetApproved;
    this.expectedCompletionDate = expectedCompletionDate;
    this.currentRent = currentRent;
    this.projectedRent = projectedRent;
    this.decisionReason = decisionReason;
  }

  toJSON() {
    return {
      id: this.id,
      turnoverId: this.turnoverId,
      apartmentId: this.apartmentId,
      requestedLevels: this.requestedLevels,
      scopeNotes: this.scopeNotes,
      targetReadyDate: this.targetReadyDate,
      nextActorEmail: this.nextActorEmail,
      costGood: this.costGood,
      costBetter: this.costBetter,
      costPremium: this.costPremium,
      leadDaysGood: this.leadDaysGood,
      leadDaysBetter: this.leadDaysBetter,
      leadDaysPremium: this.leadDaysPremium,
      selectedLevel: this.selectedLevel,
      budgetApproved: this.budgetApproved,
      expectedCompletionDate: this.expectedCompletionDate,
      currentRent: this.currentRent,
      projectedRent: this.projectedRent,
      decisionReason: this.decisionReason,
    };
  }
}

export default RenovationCase;