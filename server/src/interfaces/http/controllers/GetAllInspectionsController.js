import express from 'express';
import GetAllInspectionsReadModel from '../../../domain/readmodel/GetAllInspectionsReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const inspections = await GetAllInspectionsReadModel.query();
    res.status(200).json(inspections);
  } catch (err) {
    // As per rules, only 200 and 400 status codes are allowed.
    // In the absence of specific client-side validation failures, a general error is mapped to 400.
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-all-inspections',
  router,
};