import express from 'express';
import ScheduleLeaseEndCommand from '../../../domain/command/ScheduleLeaseEndCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id, apartmentId, endDate, noticeDate, currentRent, propertyId, nextActorEmail } = req.body;

    const result = await ScheduleLeaseEndCommand.execute({
      id,
      apartmentId,
      endDate,
      noticeDate,
      currentRent,
      propertyId,
      nextActorEmail,
    });

    // OpenAPI specifies 200 for success
    res.status(200).json(result);
  } catch (err) {
    // OpenAPI specifies 400 for bad request
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/schedule-lease-end', // Matches the OpenAPI path
  router,
};