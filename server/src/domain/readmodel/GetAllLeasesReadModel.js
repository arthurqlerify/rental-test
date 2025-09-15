import db from '../../infrastructure/db/index.js';

class GetAllLeasesReadModel {
  static async query() {
    const allLeases = await db.findAll('Lease');
    
    // "Fetch Pending Lease Endings", "Get Due Lease Endings"
    // This implies filtering leases that have an endDate today or in the future.
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day for comparison

    const pendingOrDueLeases = allLeases.filter(lease => {
      if (!lease.endDate) {
        return false; // Leases must have an endDate to be considered for ending
      }
      const leaseEndDate = new Date(lease.endDate);
      leaseEndDate.setHours(0, 0, 0, 0); // Normalize lease end date as well

      return leaseEndDate >= today;
    });

    return pendingOrDueLeases;
  }
}

export default GetAllLeasesReadModel;