import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-apartment-given-the-specified-property-exists-and-no-apartment-with-the-same-unitnumber-exists-under-that-property-and-floorareasqm-and-bedrooms-are-positive-values-when-the-propertymgr-submits-create-apartment-with-propertyid-unitnumber-floorareasqm-bedrooms-and-a-valid-initial-status-occupied-vacant-or-ready-then-apartment-created-is-recorded-with-a-new-apartmentid-linked-to-the-property-and-the-apartment-is-available-for-leasing-and-turnover-workflows.feature'));

defineFeature(feature, test => {
  test(
    'Given the specified property exists and no apartment with the same unitNumber exists under that property, and floorAreaSqm and bedrooms are positive values, When the PropertyMgr submits Create Apartment with propertyId, unitNumber, floorAreaSqm, bedrooms and a valid initial status (Occupied, Vacant or Ready), Then Apartment Created is recorded with a new apartmentId linked to the property and the apartment is available for leasing and turnover workflows.',
    ({ given, when, then }) => {
      let propertyId;
      let response;

      given('the specified property exists and no apartment with the same unitNumber exists under that property, and floorAreaSqm and bedrooms are positive values', async () => {
        // Create a property
        const propertyResponse = await request(app)
          .post('/api/v1/create-property')
          .send({
            name: 'Maple Court',
            address: '12 Main St',
            managerName: 'Jordan Alvarez',
            managerEmail: 'pm@rentco.com',
            unitsCount: '120'
          })
          .expect(200);

        propertyId = propertyResponse.body.id;
      });

      when('the PropertyMgr submits Create Apartment with propertyId, unitNumber, floorAreaSqm, bedrooms and a valid initial status (Occupied, Vacant or Ready)', async () => {
        response = await request(app)
          .post('/api/v1/create-apartment')
          .send({
            propertyId: propertyId,
            unitNumber: '22B',
            floorAreaSqm: '62',
            bedrooms: '2',
            status: 'Vacant'
          })
          .expect(200);
      });

      then('Apartment Created is recorded with a new apartmentId linked to the property and the apartment is available for leasing and turnover workflows.', async () => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.propertyId).toBe(propertyId);
        expect(response.body.unitNumber).toBe('22B');
        expect(response.body.floorAreaSqm).toBe('62');
        expect(response.body.bedrooms).toBe('2');
        expect(['Occupied', 'Vacant', 'Ready']).toContain(response.body.status);
      });
    }
  );
});