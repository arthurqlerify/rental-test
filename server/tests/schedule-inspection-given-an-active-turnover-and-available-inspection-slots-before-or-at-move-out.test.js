import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'schedule-inspection-given-an-active-turnover-and-available-inspection-slots-before-or-at-move-out.feature'));

defineFeature(feature, test => {
  test(
    'Given an active turnover and available inspection slots before or at move-out, When the PropertyMgr schedules the inspection with a date, time and inspector, Then Inspection Scheduled is recorded with the appointment details.',
    ({ given, when, then }) => {
      let turnoverId;
      let response;

      given('an active turnover and available inspection slots before or at move-out', async () => {
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
      });

      when('the PropertyMgr schedules the inspection with a date, time and inspector', async () => {
        response = await request(app)
          .post('/api/v1/schedule-inspection')
          .send({
            turnoverId: turnoverId,
            apartmentId: 'apt-22B',
            scheduledAt: '2025-09-28T09:00',
            assignedToEmail: 'inspector1@rentco.com',
            locationNotes: 'Basement entry',
            nextActorEmail: 'tenant@ex.com'
          })
          .expect(200);
      });

      then('Inspection Scheduled is recorded with the appointment details.', async () => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.turnoverId).toBe(turnoverId);
        expect(response.body.apartmentId).toBe('apt-22B');
        expect(response.body.scheduledAt).toBe('2025-09-28T09:00');
        expect(response.body.assignedToEmail).toBe('inspector1@rentco.com');
        expect(response.body.locationNotes).toBe('Basement entry');
      });
    }
  );
});