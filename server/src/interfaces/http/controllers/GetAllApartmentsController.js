import express from 'express';
import GetAllApartmentsReadModel from '../../../domain/readmodel/GetAllApartmentsReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const apartments = await GetAllApartmentsReadModel.query();
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-all-apartments',
  router,
};