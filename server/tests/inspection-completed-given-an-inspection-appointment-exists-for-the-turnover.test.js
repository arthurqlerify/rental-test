import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'inspection-completed-given-an-inspection-appointment-exists-for-the-turnover.feature'));

defineFeature(feature, test => {
  test(
    'Given an inspection appointment exists for the turnover, When the Inspector records findings and marks the inspection complete, Then Inspection Completed is recorded with a summary of results.',
    ({ given, when, then }) => {
      let inspectionId;
      let turnoverId = 'to-5001'; // Example turnoverId
      let apartmentId = 'apt-22B'; // Example apartmentId

      given('an inspection appointment exists for the turnover', async () => {
        const response = await request(app)
          .post('/api/v1/schedule-inspection')
          .send({
            turnoverId,
            apartmentId,
            scheduledAt: '2025-09-28T09:00',
            assignedToEmail: 'inspector1@rentco.com',
            locationNotes: 'Basement entry',
            nextActorEmail: 'tenant@ex.com'
          });

        expect(response.status).toBe(200);
        inspectionId = response.body.id;
      });

      when('the Inspector records findings and marks the inspection complete', async () => {
        const response = await request(app)
          .post('/api/v1/complete-inspection')
          .send({
            id: inspectionId,
            turnoverId,
            apartmentId,
            completedAt: '2025-09-28T10:15',
            findingsSummary: 'Minor scuffs',
            hasDamages: 'true',
            photosUrl: 'https://pics.io/i9001',
            nextActorEmail: 'tenant@ex.com'
          });

        expect(response.status).toBe(200);
      });

      then('Inspection Completed is recorded with a summary of results', async () => {
        const response = await request(app)
          .get(`/api/v1/get-inspection-by-id/${inspectionId}`);

        expect(response.status).toBe(200);
        expect(response.body.completedAt).toBe('2025-09-28T10:15');
        expect(response.body.findingsSummary).toBe('Minor scuffs');
        expect(response.body.hasDamages).toBe('true');
      });
    }
  );
});