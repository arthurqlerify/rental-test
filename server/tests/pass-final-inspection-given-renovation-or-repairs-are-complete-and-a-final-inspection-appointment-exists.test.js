import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'pass-final-inspection-given-renovation-or-repairs-are-complete-and-a-final-inspection-appointment-exists.feature'));

defineFeature(feature, test => {
  test(
    'Given renovation or repairs are complete and a final inspection appointment exists, When the Inspector verifies all items meet standards and no defects remain, Then Final Inspection Passed is recorded with inspector sign-off.',
    ({ given, when, then }) => {
      let inspectionId;
      let turnoverId;
      let apartmentId;

      given('renovation or repairs are complete and a final inspection appointment exists', async () => {
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

        const inspectionResponse = await request(app)
          .post('/api/v1/schedule-inspection')
          .send({
            turnoverId,
            apartmentId: 'apt-22B',
            scheduledAt: '2025-09-28T09:00',
            assignedToEmail: 'inspector1@rentco.com',
            locationNotes: 'Basement entry',
            nextActorEmail: 'tenant@ex.com'
          })
          .expect(200);

        inspectionId = inspectionResponse.body.id;
        apartmentId = inspectionResponse.body.apartmentId;
      });

      when('the Inspector verifies all items meet standards and no defects remain', async () => {
        await request(app)
          .post('/api/v1/complete-inspection')
          .send({
            id: inspectionId,
            turnoverId,
            apartmentId,
            completedAt: '2025-09-28T10:15',
            findingsSummary: 'No defects',
            hasDamages: 'false',
            photosUrl: 'https://pics.io/i9001',
            nextActorEmail: 'tenant@ex.com'
          })
          .expect(200);
      });

      then('Final Inspection Passed is recorded with inspector sign-off', async () => {
        const response = await request(app)
          .post('/api/v1/pass-final-inspection')
          .send({
            id: inspectionId,
            turnoverId,
            apartmentId,
            passedAt: '2025-09-15T14:33:05.682Z',
            inspectorName: 'A. Rivera',
            certificateUrl: 'https://docs.io/c9001',
            nextActorEmail: 'tenant@ex.com'
          })
          .expect(200);

        expect(response.body.passedAt).toBe('2025-09-15T14:33:05.682Z');
        expect(response.body.inspectorName).toBe('A. Rivera');
      });
    }
  );
});