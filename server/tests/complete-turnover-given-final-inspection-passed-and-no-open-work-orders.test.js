import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'complete-turnover-given-final-inspection-passed-and-no-open-work-orders.feature'));

defineFeature(feature, test => {
  test(
    'Given the final inspection has passed and there are no open work orders, When Automation completes the turnover case, Then Turnover Completed is recorded and the apartment status becomes ready to rent and marketing is notified.',
    ({ given, when, then }) => {
      let turnoverId;
      let response;

      given('the final inspection has passed and there are no open work orders', async () => {
        // Create a turnover
        const turnoverResponse = await request(app)
          .post('/api/v1/create-turnover')
          .send({
            leaseId: 'lease-1001',
            apartmentId: 'apt-22B',
            targetReadyDate: '2025-10-15',
            propertyId: 'prop-001',
            nextActorEmail: 'inspections@rentco.com'
          })
          .expect(200);

        turnoverId = turnoverResponse.body.id;

        // Pass final inspection
        await request(app)
          .post('/api/v1/pass-final-inspection')
          .send({
            id: 'insp-9001',
            turnoverId: turnoverId,
            apartmentId: 'apt-22B',
            passedAt: '2025-10-19T15:30',
            inspectorName: 'A. Rivera',
            certificateUrl: 'https://docs.io/c9001',
            nextActorEmail: 'tenant@ex.com'
          })
          .expect(200);
      });

      when('Automation completes the turnover case', async () => {
        response = await request(app)
          .post('/api/v1/complete-turnover')
          .send({
            id: turnoverId,
            readyToRentDate: '2025-10-20',
            listingReady: 'true',
            marketingEmail: 'list@rentco.com',
            apartmentId: 'apt-22B',
            notes: 'No issues'
          })
          .expect(200);
      });

      then('Turnover Completed is recorded and the apartment status becomes ready to rent and marketing is notified', async () => {
        expect(response.body.id).toBe(turnoverId);
        expect(response.body.readyToRentDate).toBe('2025-10-20');
        expect(response.body.listingReady).toBe('true');
        expect(response.body.marketingEmail).toBe('list@rentco.com');
      });
    }
  );
});