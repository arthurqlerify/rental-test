import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './complete-work-order-given-scheduled-work-has-been-performed-when-the-constrworker-reports-completion-with-actual-dates-notes-and-photos-then-work-order-completed-is-recorded-and-any-variances-are-captured.feature'));

defineFeature(feature, test => {
  test(
    'Given scheduled work has been performed, When the ConstrWorker reports completion with actual dates, notes and photos, Then Work Order Completed is recorded and any variances are captured',
    ({ given, when, then }) => {
      let workOrderId;
      let response;

      given('scheduled work has been performed', async () => {
        const createResponse = await request(app)
          .post('/api/v1/create-work-order')
          .send({
            renovationCaseId: 'reno-6001',
            turnoverId: 'to-5001',
            apartmentId: 'apt-22B',
            scopeSummary: 'Paint walls, reseal bath',
            accessDetails: 'Supra 4452',
            materialsList: 'Paint, caulk',
            nextActorEmail: 'crew@rentco.com'
          })
          .expect(200);

        workOrderId = createResponse.body.id;

        await request(app)
          .post('/api/v1/schedule-work-order')
          .send({
            id: workOrderId,
            apartmentId: 'apt-22B',
            startDate: '2025-10-05',
            endDate: '2025-10-10',
            crewName: 'Crew Alpha',
            assignedToEmail: 'lead1@rentco.com',
            materialsReady: 'true',
            nextActorEmail: 'crew@rentco.com'
          })
          .expect(200);
      });

      when('the ConstrWorker reports completion with actual dates, notes and photos', async () => {
        response = await request(app)
          .post('/api/v1/complete-work-order')
          .send({
            id: workOrderId,
            apartmentId: 'apt-22B',
            actualStartDate: '2025-10-06',
            actualEndDate: '2025-10-09',
            completionNotes: 'On time, good',
            photosUrl: 'https://pics.io/wo8001',
            varianceNotes: '+1 day better scope',
            nextActorEmail: 'crew@rentco.com'
          })
          .expect(200);
      });

      then('Work Order Completed is recorded and any variances are captured', async () => {
        expect(response.body).toHaveProperty('id', workOrderId);
        expect(response.body).toHaveProperty('actualStartDate', '2025-10-06');
        expect(response.body).toHaveProperty('actualEndDate', '2025-10-09');
        expect(response.body).toHaveProperty('completionNotes', 'On time, good');
        expect(response.body).toHaveProperty('photosUrl', 'https://pics.io/wo8001');
        expect(response.body).toHaveProperty('varianceNotes', '+1 day better scope');
      });
    }
  );
});