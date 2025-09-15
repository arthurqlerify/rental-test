import express from 'express';
import RecordApartmentVacatedCommand from '../../../domain/command/RecordApartmentVacatedCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Extract all fields from the request body as defined in the OpenAPI specification
    const { id, apartmentId, vacatedAt, keysReturned, notes, nextActorEmail } = req.body;

    const result = await RecordApartmentVacatedCommand.execute({
      id,
      apartmentId,
      vacatedAt,
      keysReturned,
      notes,
      nextActorEmail,
    });

    // Per OpenAPI spec, a successful response returns status 200.
    res.status(200).json(result);
  } catch (err) {
    // Per OpenAPI spec, an error returns status 400.
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/record-apartment-vacated',
  router,
};