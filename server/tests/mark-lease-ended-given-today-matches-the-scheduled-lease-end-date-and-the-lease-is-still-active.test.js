import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'mark-lease-ended-given-today-matches-the-scheduled-lease-end-date-and-the-lease-is-still-active.feature'));

defineFeature(feature, test => {
  test(
    'Given today matches the scheduled lease end date and the lease is still active, When Automation marks the lease as ended, Then Lease Ended is recorded and the associated turnover moves to awaiting vacancy confirmation.',
    ({ given, when, then }) => {
      let leaseId;
      let turnoverId;

      given('today matches the scheduled lease end date and the lease is still active', async () => {
        const leaseResponse = await request(app)
          .post('/api/v1/schedule-lease-end')
          .send({
            id: 'lease-1001',
            apartmentId: 'apt-22B',
            endDate: '2025-09-15',
            noticeDate: '2025-08-01',
            currentRent: '1450',
            propertyId: 'prop-001',
            nextActorEmail: 'ops@rentco.com'
          })
          .expect(200);

        leaseId = leaseResponse.body.id;
        turnoverId = leaseResponse.body.turnoverId;
      });

      when('Automation marks the lease as ended', async () => {
        await request(app)
          .post('/api/v1/mark-lease-ended')
          .send({
            id: leaseId,
            apartmentId: 'apt-22B',
            endDate: '2025-09-15',
            moveOutConfirmedAt: '2025-09-15T14:27:13.485Z',
            turnoverId: turnoverId,
            nextActorEmail: 'ops@rentco.com'
          })
          .expect(200);
      });

      then('Lease Ended is recorded and the associated turnover moves to awaiting vacancy confirmation', async () => {
        const leaseResponse = await request(app)
          .get(`/api/v1/get-lease-by-id/${leaseId}`)
          .expect(200);

        expect(leaseResponse.body.endDate).toBe('2025-09-15');
        expect(leaseResponse.body.moveOutConfirmedAt).toBe('2025-09-15T14:27:13.485Z');

        const turnoverResponse = await request(app)
          .get('/api/v1/get-all-turnovers')
          .expect(200);

        const turnover = turnoverResponse.body.find(t => t.id === turnoverId);
        expect(turnover).toBeDefined();
        expect(turnover.vacatedAt).toBe('2025-09-15T14:27:13.485Z');
      });
    }
  );
});