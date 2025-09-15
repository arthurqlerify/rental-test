import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'record-apartment-vacated-given-the-tenant-has-returned-keys-and-the-apartment-is-empty.feature'));

defineFeature(feature, test => {
  test(
    'Given the tenant has returned keys and the apartment is empty, When the PropertyMgr records the apartment as vacated, Then Apartment Vacated is recorded with timestamp and actor and downstream actors are notified.',
    ({ given, when, then }) => {
      let turnoverId;
      let response;

      given('the tenant has returned keys and the apartment is empty', async () => {
        const createTurnoverResponse = await request(app)
          .post('/api/v1/create-turnover')
          .send({
            leaseId: 'lease-1001',
            apartmentId: 'apt-22B',
            targetReadyDate: '2025-10-15',
            propertyId: 'prop-001',
            nextActorEmail: 'inspections@rentco.com'
          })
          .expect(200);

        turnoverId = createTurnoverResponse.body.id;
      });

      when('the PropertyMgr records the apartment as vacated', async () => {
        response = await request(app)
          .post('/api/v1/record-apartment-vacated')
          .send({
            id: turnoverId,
            apartmentId: 'apt-22B',
            vacatedAt: '2025-09-15T14:27:46.384Z',
            keysReturned: 'true',
            notes: 'No issues',
            nextActorEmail: 'inspections@rentco.com'
          })
          .expect(200);
      });

      then('Apartment Vacated is recorded with timestamp and actor and downstream actors are notified', async () => {
        expect(response.body).toHaveProperty('id', turnoverId);
        expect(response.body).toHaveProperty('vacatedAt', '2025-09-15T14:27:46.384Z');
        expect(response.body).toHaveProperty('keysReturned', 'true');
        expect(response.body).toHaveProperty('nextActorEmail', 'inspections@rentco.com');
      });
    }
  );
});