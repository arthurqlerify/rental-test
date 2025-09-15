import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'schedule-lease-end-given-an-active-lease-for-the-apartment-and-a-confirmed-termination-date.feature'));

defineFeature(feature, test => {
  test(
    'Given an active lease for the apartment and a confirmed termination date, When the PropertyMgr schedules the lease end for that date, Then Lease End Scheduled is recorded with leaseId, apartmentId and endDate and next-step notifications are queued.',
    ({ given, when, then }) => {
      let leaseId;
      let apartmentId;
      let endDate;

      given('an active lease for the apartment and a confirmed termination date', async () => {
        const response = await request(app)
          .post('/api/v1/schedule-lease-end')
          .send({
            id: 'lease-1001',
            apartmentId: 'apt-22B',
            endDate: '2025-09-30',
            noticeDate: '2025-08-01',
            currentRent: '1450',
            propertyId: 'prop-001',
            nextActorEmail: 'ops@rentco.com'
          });

        expect(response.status).toBe(200);
        leaseId = response.body.id;
        apartmentId = response.body.apartmentId;
        endDate = response.body.endDate;
      });

      when('the PropertyMgr schedules the lease end for that date', async () => {
        const response = await request(app)
          .post('/api/v1/schedule-lease-end')
          .send({
            id: leaseId,
            apartmentId: apartmentId,
            endDate: endDate,
            noticeDate: '2025-08-01',
            currentRent: '1450',
            propertyId: 'prop-001',
            nextActorEmail: 'ops@rentco.com'
          });

        expect(response.status).toBe(200);
      });

      then('Lease End Scheduled is recorded with leaseId, apartmentId and endDate and next-step notifications are queued', async () => {
        const response = await request(app)
          .get(`/api/v1/get-lease-by-id/${leaseId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(leaseId);
        expect(response.body.apartmentId).toBe(apartmentId);
        expect(response.body.endDate).toBe(endDate);
      });
    }
  );
});