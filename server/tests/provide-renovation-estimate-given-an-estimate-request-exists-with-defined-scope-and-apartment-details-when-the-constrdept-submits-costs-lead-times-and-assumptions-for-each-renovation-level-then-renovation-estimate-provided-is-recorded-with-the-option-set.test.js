import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './provide-renovation-estimate-given-an-estimate-request-exists-with-defined-scope-and-apartment-details-when-the-constrdept-submits-costs-lead-times-and-assumptions-for-each-renovation-level-then-renovation-estimate-provided-is-recorded-with-the-option-set.feature'));

defineFeature(feature, test => {
  test(
    'Given an estimate request exists with defined scope and apartment details, When the ConstrDept submits costs, lead times and assumptions for each renovation level, Then Renovation Estimate Provided is recorded with the option set.',
    ({ given, when, then }) => {
      let renovationCaseId;

      given('an estimate request exists with defined scope and apartment details', async () => {
        const response = await request(app)
          .post('/api/v1/request-renovation-estimate')
          .send({
            turnoverId: 'to-5001',
            apartmentId: 'apt-22B',
            requestedLevels: 'good,better',
            scopeNotes: 'Paint + bath reseal',
            targetReadyDate: '2025-10-20',
            nextActorEmail: 'constr@rentco.com'
          });
        expect(response.status).toBe(200);
        renovationCaseId = response.body.id;
      });

      when('the ConstrDept submits costs, lead times and assumptions for each renovation level', async () => {
        const response = await request(app)
          .post('/api/v1/provide-renovation-estimate')
          .send({
            id: renovationCaseId,
            costGood: '1200',
            costBetter: '1800',
            costPremium: '3000',
            leadDaysGood: '5',
            leadDaysBetter: '8',
            leadDaysPremium: '12',
            nextActorEmail: 'constr@rentco.com'
          });
        expect(response.status).toBe(200);
      });

      then('Renovation Estimate Provided is recorded with the option set', async () => {
        const response = await request(app)
          .get(`/api/v1/get-all-renovation-cases`);
        expect(response.status).toBe(200);
        const renovationCase = response.body.find(rc => rc.id === renovationCaseId);
        expect(renovationCase).toBeDefined();
        expect(renovationCase.costGood).toBe('1200');
        expect(renovationCase.costBetter).toBe('1800');
        expect(renovationCase.costPremium).toBe('3000');
        expect(renovationCase.leadDaysGood).toBe('5');
        expect(renovationCase.leadDaysBetter).toBe('8');
        expect(renovationCase.leadDaysPremium).toBe('12');
      });
    }
  );
});