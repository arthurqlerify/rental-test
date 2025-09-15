import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'select-renovation-plan-given-estimate-options-and-projected-rent-uplift-are-available.feature'));

defineFeature(feature, test => {
  test(
    'Given estimate options and projected rent uplift are available, When the PropertyMgr selects one plan level or chooses no renovation, Then Renovation Plan Selected is recorded with the chosen level, budget and expected completion window.',
    ({ given, when, then }) => {
      let renovationCaseId;
      let response;

      given('estimate options and projected rent uplift are available', async () => {
        const requestBody = {
          turnoverId: 'to-5001',
          apartmentId: 'apt-22B',
          requestedLevels: 'good,better',
          scopeNotes: 'Paint + bath reseal',
          targetReadyDate: '2025-10-20',
          nextActorEmail: 'constr@rentco.com'
        };

        const res = await request(app)
          .post('/api/v1/request-renovation-estimate')
          .send(requestBody)
          .expect(200);

        renovationCaseId = res.body.id;
      });

      when('the PropertyMgr selects one plan level or chooses no renovation', async () => {
        const requestBody = {
          id: renovationCaseId,
          apartmentId: 'apt-22B',
          selectedLevel: 'good',
          budgetApproved: 'true',
          expectedCompletionDate: '2025-10-18',
          projectedRent: '1550',
          decisionReason: 'ROI ok',
          nextActorEmail: 'constr@rentco.com'
        };

        response = await request(app)
          .post('/api/v1/select-renovation-plan')
          .send(requestBody)
          .expect(200);
      });

      then('Renovation Plan Selected is recorded with the chosen level, budget and expected completion window.', async () => {
        expect(response.body).toEqual(expect.objectContaining({
          id: renovationCaseId,
          selectedLevel: 'good',
          budgetApproved: 'true',
          expectedCompletionDate: '2025-10-18'
        }));
      });
    }
  );
});