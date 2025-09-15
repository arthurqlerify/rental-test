import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './schedule-work-order-given-a-work-order-exists-and-crew-and-materials-availability-are-known.feature'));

defineFeature(feature, test => {
  test(
    'Given a work order exists and crew and materials availability are known, When the ConstrDept assigns a crew and sets start and end dates, Then Work Order Scheduled is recorded with dates and assigned team.',
    ({ given, when, then }) => {
      let workOrderId;
      let response;

      given('a work order exists and crew and materials availability are known', async () => {
        const createWorkOrderResponse = await request(app)
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

        workOrderId = createWorkOrderResponse.body.id;
      });

      when('the ConstrDept assigns a crew and sets start and end dates', async () => {
        response = await request(app)
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

      then('Work Order Scheduled is recorded with dates and assigned team', async () => {
        expect(response.body).toEqual(expect.objectContaining({
          id: workOrderId,
          startDate: '2025-10-05',
          endDate: '2025-10-10',
          crewName: 'Crew Alpha',
          assignedToEmail: 'lead1@rentco.com'
        }));
      });
    }
  );
});