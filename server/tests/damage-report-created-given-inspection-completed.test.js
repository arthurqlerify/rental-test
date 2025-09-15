import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'damage-report-created-given-inspection-completed.feature'));

defineFeature(feature, test => {
  test(
    'Given an inspection has been completed and damages or issues were observed, When the Inspector itemizes damages with severity, locations and evidence, Then Damage Report Created is recorded and linked to the turnover',
    ({ given, when, then }) => {
      let turnoverId;
      let inspectionId;
      let renovationReportResponse;

      given('an inspection has been completed and damages or issues were observed', async () => {
        // Create a turnover
        const turnoverResponse = await request(app)
          .post('/api/v1/create-turnover')
          .send({
            leaseId: 'lease-1001',
            apartmentId: 'apt-22B',
            targetReadyDate: '2025-10-15',
            propertyId: 'prop-001'
          })
          .expect(200);

        turnoverId = turnoverResponse.body.id;

        // Complete an inspection with damages
        const inspectionResponse = await request(app)
          .post('/api/v1/complete-inspection')
          .send({
            id: 'insp-9001',
            turnoverId,
            apartmentId: 'apt-22B',
            completedAt: '2025-09-28T10:15',
            findingsSummary: 'Minor scuffs',
            hasDamages: 'true',
            photosUrl: 'https://pics.io/i9001'
          })
          .expect(200);

        inspectionId = inspectionResponse.body.id;
      });

      when('the Inspector itemizes damages with severity, locations and evidence', async () => {
        // Create a renovation report
        renovationReportResponse = await request(app)
          .post('/api/v1/create-renovation-report')
          .send({
            turnoverId,
            inspectionId,
            apartmentId: 'apt-22B',
            damageSeverity: 'medium',
            estimatedRepairCost: '850',
            damageSummary: 'Paint, sink leak'
          })
          .expect(200);
      });

      then('Damage Report Created is recorded and linked to the turnover', async () => {
        expect(renovationReportResponse.body).toHaveProperty('id');
        expect(renovationReportResponse.body.turnoverId).toBe(turnoverId);
        expect(renovationReportResponse.body.inspectionId).toBe(inspectionId);
        expect(renovationReportResponse.body.damageSeverity).toBe('medium');
        expect(renovationReportResponse.body.estimatedRepairCost).toBe('850');
        expect(renovationReportResponse.body.damageSummary).toBe('Paint, sink leak');
      });
    }
  );
});