import express from 'express';
import GetAllLeasesReadModel from '../../../domain/readmodel/GetAllLeasesReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const leases = await GetAllLeasesReadModel.query();
    res.status(200).json(leases);
  } catch (err) {
    console.error('Error fetching leases:', err);
    res.status(400).json({ message: 'Bad Request', error: err.message });
  }
});

export default {
  routeBase: '/get-all-leases',
  router,
};