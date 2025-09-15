import express from 'express';
import MarkLeaseEndedCommand from '../../../domain/command/MarkLeaseEndedCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await MarkLeaseEndedCommand.execute(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/mark-lease-ended',
  router,
};