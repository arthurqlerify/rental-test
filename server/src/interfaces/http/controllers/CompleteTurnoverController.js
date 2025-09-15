import express from 'express';
import CompleteTurnoverCommand from '../../../domain/command/CompleteTurnoverCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Extract parameters directly from req.body as per OpenAPI specification
    const { id, readyToRentDate, listingReady, marketingEmail, apartmentId, notes } = req.body;

    // Execute the command, passing all relevant input fields.
    // Note: The 'listingReady' parameter from the request body will be overridden to 'true'
    // within the command itself, based on the GWT description "apartment status becomes ready to rent".
    const result = await CompleteTurnoverCommand.execute({
      id,
      readyToRentDate,
      listingReady, // Passed, but the command forces it to 'true' as an outcome
      marketingEmail,
      apartmentId, // Passed, but not directly used for updates in this command due to scope rules
      notes,
    });
    res.status(200).json(result); // OpenAPI spec indicates 200 for a successful response
  } catch (err) {
    res.status(400).json({ message: err.message }); // Use 400 for bad requests/validation errors
  }
});

export default {
  routeBase: '/complete-turnover', // Base route defined in OpenAPI spec
  router,
};