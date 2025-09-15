import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-work-order-given-a-renovation-plan-requiring-work-has-been-selected.feature'));

defineFeature(feature, test => {
  test(
    'Given a renovation plan requiring work has been selected, When the ConstrDept creates a work order with scope, materials and access details, Then Work Order Created is recorded linked to the turnover and renovation case.',
    ({ given, when, then }) => {
      let renovationCaseId;
      let turnoverId;
      let workOrderResponse;

      given('a renovation plan requiring work has been selected', async () => {
        const renovationCaseResponse = await request(app)
          .post('/api/v1/request-renovation-estimate')
          .send({
            turnoverId: 'to-5001',
            apartmentId: 'apt-22B',
            requestedLevels: 'good,better',
            scopeNotes: 'Paint + bath reseal',
            targetReadyDate: '2025-10-20',
            nextActorEmail: 'constr@rentco.com'
          })
          .expect(200);

        renovationCaseId = renovationCaseResponse.body.id;
        turnoverId = renovationCaseResponse.body.turnoverId;
      });

      when('the ConstrDept creates a work order with scope, materials and access details', async () => {
        workOrderResponse = await request(app)
          .post('/api/v1/create-work-order')
          .send({
            renovationCaseId,
            turnoverId,
            apartmentId: 'apt-22B',
            scopeSummary: 'Paint walls, reseal bath',
            accessDetails: 'Supra 4452',
            materialsList: 'Paint, caulk',
            nextActorEmail: 'crew@rentco.com'
          })
          .expect(200);
      });

      then('Work Order Created is recorded linked to the turnover and renovation case', async () => {
        expect(workOrderResponse.body).toHaveProperty('id');
        expect(workOrderResponse.body.renovationCaseId).toBe(renovationCaseId);
        expect(workOrderResponse.body.turnoverId).toBe(turnoverId);
        expect(workOrderResponse.body.apartmentId).toBe('apt-22B');
        expect(workOrderResponse.body.scopeSummary).toBe('Paint walls, reseal bath');
        expect(workOrderResponse.body.accessDetails).toBe('Supra 4452');
        expect(workOrderResponse.body.materialsList).toBe('Paint, caulk');
        expect(workOrderResponse.body.nextActorEmail).toBe('crew@rentco.com');
      });
    }
  );
});