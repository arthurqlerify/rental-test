import express from 'express';
import ProvideRenovationEstimateCommand from '../../../domain/command/ProvideRenovationEstimateCommand.js';

const router = express.Router();
const routeBase = '/provide-renovation-estimate';

router.post('/', async (req, res) => {
  try {
    const { id, costGood, costBetter, costPremium, leadDaysGood, leadDaysBetter, leadDaysPremium, nextActorEmail } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Renovation Case ID is required.' });
    }

    const result = await ProvideRenovationEstimateCommand.execute({
      id,
      costGood,
      costBetter,
      costPremium,
      leadDaysGood,
      leadDaysBetter,
      leadDaysPremium,
      nextActorEmail,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase,
  router,
};