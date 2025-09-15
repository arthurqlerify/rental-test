import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './request-renovation-estimate-given-turnover-with-damage-or-upgrade-need.feature'));

defineFeature(feature, test => {
  test(
    'Given a turnover with a damage report or an upgrade need and apartment profile data, When the PropertyMgr requests a renovation estimate including levels none, good, better and premium, Then Renovation Estimate Requested is recorded and the construction department is notified.',
    ({ given, when, then }) => {
      let turnoverId;
      let apartmentId;
      let response;

      given('a turnover with a damage report or an upgrade need and apartment profile data', async () => {
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
        apartmentId = turnoverResponse.body.apartmentId;
      });

      when('the PropertyMgr requests a renovation estimate including levels none, good, better and premium', async () => {
        response = await request(app)
          .post('/api/v1/request-renovation-estimate')
          .send({
            turnoverId,
            apartmentId,
            requestedLevels: 'none,good,better,premium',
            scopeNotes: 'Paint + bath reseal',
            targetReadyDate: '2025-10-20',
            nextActorEmail: 'constr@rentco.com'
          })
          .expect(200);
      });

      then('Renovation Estimate Requested is recorded and the construction department is notified', async () => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.turnoverId).toBe(turnoverId);
        expect(response.body.apartmentId).toBe(apartmentId);
        expect(response.body.requestedLevels).toBe('none,good,better,premium');
        expect(response.body.nextActorEmail).toBe('constr@rentco.com');
      });
    }
  );
});