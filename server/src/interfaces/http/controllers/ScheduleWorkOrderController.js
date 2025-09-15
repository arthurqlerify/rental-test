import express from 'express';
import ScheduleWorkOrderCommand from '../../../domain/command/ScheduleWorkOrderCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id, apartmentId, startDate, endDate, crewName, assignedToEmail, materialsReady, nextActorEmail } = req.body;

    // Basic validation as 'id' is crucial for finding the existing Work Order
    if (!id) {
      return res.status(400).json({ message: 'Work Order ID (id) is required in the request body.' });
    }

    const result = await ScheduleWorkOrderCommand.execute({
      id,
      apartmentId,
      startDate,
      endDate,
      crewName,
      assignedToEmail,
      materialsReady,
      nextActorEmail,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/schedule-work-order',
  router,
};