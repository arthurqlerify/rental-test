import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-turnover-given-lease-end-scheduled-no-turnover-exists.feature'));

defineFeature(feature, test => {
  test(
    'Given a lease has an end date scheduled and no turnover exists for that lease, When Automation creates a turnover case for the apartment, Then Turnover Created is recorded linking the lease, apartment and target dates.',
    ({ given, when, then }) => {
      let leaseId;
      let apartmentId;
      let turnoverResponse;

      given('a lease has an end date scheduled and no turnover exists for that lease', async () => {
        const leaseResponse = await request(app)
          .post('/api/v1/schedule-lease-end')
          .send({
            id: 'lease-1001',
            apartmentId: 'apt-22B',
            endDate: '2025-09-30',
            noticeDate: '2025-08-01',
            currentRent: '1450',
            propertyId: 'prop-001',
            nextActorEmail: 'ops@rentco.com'
          })
          .expect(200);

        leaseId = leaseResponse.body.id;
        apartmentId = leaseResponse.body.apartmentId;
      });

      when('Automation creates a turnover case for the apartment', async () => {
        turnoverResponse = await request(app)
          .post('/api/v1/create-turnover')
          .send({
            leaseId: leaseId,
            apartmentId: apartmentId,
            targetReadyDate: '2025-10-15',
            propertyId: 'prop-001',
            nextActorEmail: 'inspections@rentco.com'
          })
          .expect(200);
      });

      then('Turnover Created is recorded linking the lease, apartment and target dates', async () => {
        expect(turnoverResponse.body).toEqual(expect.objectContaining({
          leaseId: leaseId,
          apartmentId: apartmentId,
          targetReadyDate: '2025-10-15',
          propertyId: 'prop-001'
        }));
      });
    }
  );
});