import express from 'express';
import GetAllTurnoversReadModel from '../../../domain/readmodel/GetAllTurnoversReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const turnovers = await GetAllTurnoversReadModel.query();
    res.status(200).json(turnovers);
  } catch (err) {
    // As per the example, using 500 for generic server errors.
    // If only 400 was strictly allowed for all errors, it would be res.status(400).json(...)
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-all-turnovers',
  router,
};