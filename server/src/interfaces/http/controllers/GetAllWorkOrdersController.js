import express from 'express';
import GetAllWorkOrdersReadModel from '../../../domain/readmodel/GetAllWorkOrdersReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const workOrders = await GetAllWorkOrdersReadModel.query();
    // According to OpenAPI spec, response is an array of objects with specific properties.
    // The `findAll` method returns an array of objects directly from the database,
    // which is assumed to conform to the schema.
    res.status(200).json(workOrders);
  } catch (err) {
    // As per rules, use 400 for errors if not 200.
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-all-work-orders',
  router,
};