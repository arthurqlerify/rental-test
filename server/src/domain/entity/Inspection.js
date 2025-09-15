class Inspection {
  constructor({
    id,
    turnoverId,
    apartmentId,
    scheduledAt,
    assignedToEmail,
    inspectorName = '',
    locationNotes = '',
    nextActorEmail = '',
    completedAt = null,
    findingsSummary = '',
    hasDamages = 'false',
    photosUrl = '',
    passedAt = null,
    certificateUrl = '',
    checklist = '',
  }) {
    if (!id) throw new Error('Inspection ID is required.');
    if (!turnoverId) throw new Error('Turnover ID is required.');
    if (!apartmentId) throw new Error('Apartment ID is required.');
    if (!scheduledAt) throw new Error('Scheduled date and time is required.');
    if (!assignedToEmail) throw new Error('Assigned inspector email is required.');

    this.id = id;
    this.turnoverId = turnoverId;
    this.apartmentId = apartmentId;
    this.scheduledAt = scheduledAt;
    this.assignedToEmail = assignedToEmail;
    this.inspectorName = inspectorName;
    this.locationNotes = locationNotes;
    this.nextActorEmail = nextActorEmail;
    this.completedAt = completedAt;
    this.findingsSummary = findingsSummary;
    this.hasDamages = hasDamages;
    this.photosUrl = photosUrl;
    this.passedAt = passedAt;
    this.certificateUrl = certificateUrl;
    this.checklist = checklist;
  }

  toJSON() {
    return {
      id: this.id,
      turnoverId: this.turnoverId,
      apartmentId: this.apartmentId,
      scheduledAt: this.scheduledAt,
      assignedToEmail: this.assignedToEmail,
      inspectorName: this.inspectorName,
      locationNotes: this.locationNotes,
      nextActorEmail: this.nextActorEmail,
      completedAt: this.completedAt,
      findingsSummary: this.findingsSummary,
      hasDamages: this.hasDamages,
      photosUrl: this.photosUrl,
      passedAt: this.passedAt,
      certificateUrl: this.certificateUrl,
      checklist: this.checklist,
    };
  }
}

export default Inspection;