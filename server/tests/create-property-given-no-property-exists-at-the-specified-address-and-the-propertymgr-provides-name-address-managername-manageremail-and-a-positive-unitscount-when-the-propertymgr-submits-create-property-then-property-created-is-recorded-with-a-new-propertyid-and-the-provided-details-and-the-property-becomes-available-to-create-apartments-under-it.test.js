import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './create-property-given-no-property-exists-at-the-specified-address-and-the-propertymgr-provides-name-address-managername-manageremail-and-a-positive-unitscount-when-the-propertymgr-submits-create-property-then-property-created-is-recorded-with-a-new-propertyid-and-the-provided-details-and-the-property-becomes-available-to-create-apartments-under-it.feature'));

defineFeature(feature, test => {
  test(
    'Given no property exists at the specified address and the PropertyMgr provides name, address, managerName, managerEmail and a positive unitsCount, When the PropertyMgr submits Create Property, Then Property Created is recorded with a new propertyId and the provided details, and the property becomes available to create apartments under it.',
    ({ given, when, then }) => {
      let response;
      const propertyData = {
        name: "Maple Court",
        address: "12 Main St",
        managerName: "Jordan Alvarez",
        managerEmail: "pm@rentco.com",
        unitsCount: "120"
      };

      given('no property exists at the specified address', async () => {
        // Assuming no setup is needed as the scenario states no property exists
      });

      when('the PropertyMgr submits Create Property', async () => {
        response = await request(app)
          .post('/api/v1/create-property')
          .send(propertyData)
          .set('Accept', 'application/json');
      });

      then('Property Created is recorded with a new propertyId and the provided details, and the property becomes available to create apartments under it.', async () => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(propertyData.name);
        expect(response.body.address).toBe(propertyData.address);
        expect(response.body.managerName).toBe(propertyData.managerName);
        expect(response.body.managerEmail).toBe(propertyData.managerEmail);
        expect(response.body.unitsCount).toBe(propertyData.unitsCount);
      });
    }
  );
});