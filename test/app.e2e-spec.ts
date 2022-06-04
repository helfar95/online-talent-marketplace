import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Profile } from '../src/profiles/entities/profile.entity';
import { Contract } from '../src/contracts/entities/contract.entity';
import { Job } from '../src/jobs/entities/job.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Contracts', () => {
    describe('/contracts/:id (GET)', () => {
      beforeEach(async () => {
        await Contract.sync({ force: true });
        await Profile.sync({ force: true });

        await Profile.create({
          id: 1,
          firstName: 'Hossam',
          lastName: 'Ahmed',
          profession: 'SDE',
          balance: 223,
          type: 'client',
        });
        await Contract.create({
          id: 1,
          terms: 'Best contract ever',
          status: 'terminated',
          ClientId: 1,
        });
      });

      it('should return 401 when profile_id is not sent', () => {
        return request(app.getHttpServer()).get('/contracts/333').expect(401);
      });

      it('should return 404 if contract is not found', () => {
        return request(app.getHttpServer())
          .get('/contracts/333')
          .set('profile_id', '1')
          .expect(404);
      });

      it('should return 200 when profile_id is sent and there is a contract', async () => {
        return request(app.getHttpServer())
          .get('/contracts/1')
          .set('profile_id', '1')
          .expect(200);
      });
    });

    describe('/contracts (GET)', () => {
      beforeEach(async () => {
        await Contract.sync({ force: true });
        await Profile.sync({ force: true });

        await Profile.create({
          id: 1,
          firstName: 'Hossam',
          lastName: 'Ahmed',
          profession: 'SDE',
          balance: 223,
          type: 'client',
        });
        await Contract.create({
          terms: 'Best contract ever',
          status: 'terminated',
          ContractorId: 1,
        });

        await Contract.create({
          terms: 'Best contract ever 2',
          status: 'in_progress',
          ClientId: 1,
        });
      });

      it('should return 200 with 1 contract only', async () => {
        const { statusCode, body } = await request(app.getHttpServer())
          .get('/contracts')
          .set('profile_id', '1');

        expect(statusCode).toEqual(200);
        expect(body.contracts).toHaveLength(1);
      });
    });
  });

  describe('jobs', () => {
    describe('jobs/unpaid (GET)', () => {
      beforeEach(async () => {
        await Contract.sync({ force: true });
        await Job.sync({ force: true });
        await Profile.sync({ force: true });

        await Profile.create({
          id: 1,
          firstName: 'Hossam',
          lastName: 'Ahmed',
          profession: 'Manager',
          balance: 500,
          type: 'client',
        });
        await Profile.create({
          id: 2,
          firstName: '7amada',
          lastName: 'Mohsen',
          profession: 'SDE',
          balance: 100,
          type: 'contractor',
        });
        await Contract.create({
          id: 1,
          terms: 'lorem',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 2,
        });
        await Job.create({
          id: 1,
          description: 'Job 1',
          price: 10,
          ContractId: 1,
          paid: true,
        });
        await Job.create({
          id: 2,
          description: 'Job 2',
          price: 10,
          ContractId: 1,
          paid: false,
        });
      });

      it('should return 1 unpaid job', async () => {
        const { statusCode, body } = await request(app.getHttpServer())
          .get('/jobs/unpaid')
          .set('profile_id', '1');

        expect(statusCode).toEqual(200);
        expect(body.jobs).toHaveLength(1);
      });
    });
    describe('jobs/:id/pay', () => {
      beforeEach(async () => {
        await Contract.sync({ force: true });
        await Job.sync({ force: true });
        await Profile.sync({ force: true });

        await Profile.create({
          id: 1,
          firstName: 'Hossam',
          lastName: 'Ahmed',
          profession: 'Manager',
          balance: 500,
          type: 'client',
        });
        await Profile.create({
          id: 2,
          firstName: '7amada',
          lastName: 'Mohsen',
          profession: 'SDE',
          balance: 100,
          type: 'contractor',
        });
        await Contract.create({
          id: 1,
          terms: 'lorem',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 2,
        });
        await Job.create({
          id: 1,
          description: 'Job 1',
          price: 10,
          ContractId: 1,
          paid: false,
        });
      });
      it('should pay for the job', async () => {
        const { statusCode } = await request(app.getHttpServer())
          .post('/jobs/1/pay')
          .set('profile_id', '1');

        expect(statusCode).toEqual(201);
        const job = await Job.findByPk(1);
        const contractor = await Profile.findByPk(2);
        expect(job.paid).toBeTruthy();
        expect(contractor.balance).toEqual(110);
      });
    });
  });

  describe('balances', () => {
    describe('/balances/deposit/:userId', () => {
      beforeEach(async () => {
        await Contract.sync({ force: true });
        await Job.sync({ force: true });
        await Profile.sync({ force: true });

        await Profile.create({
          id: 1,
          firstName: 'Hossam',
          lastName: 'Ahmed',
          profession: 'Manager',
          balance: 500,
          type: 'client',
        });
        await Profile.create({
          id: 2,
          firstName: '7amada',
          lastName: 'Mohsen',
          profession: 'SDE',
          balance: 100,
          type: 'contractor',
        });
        await Contract.create({
          id: 1,
          terms: 'lorem',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 2,
        });
        await Job.create({
          id: 1,
          description: 'Job 1',
          price: 10,
          ContractId: 1,
          paid: true,
        });
        await Job.create({
          id: 2,
          description: 'Job 2',
          price: 900,
          ContractId: 1,
          paid: false,
        });
      });

      it('should update the client balance', async () => {
        const { statusCode } = await request(app.getHttpServer())
          .post('/balances/deposit/1')
          .send({ amount: 100 });

        expect(statusCode).toEqual(201);
        const profile = await Profile.findByPk(1);
        expect(profile.balance).toEqual(600);
      });

      it('should not update the client balance when the amount is > 25% of the sum of jobs amount', async () => {
        const { statusCode } = await request(app.getHttpServer())
          .post('/balances/deposit/1')
          .send({ amount: 1000 });

        expect(statusCode).toEqual(400);
      });
    });
  });
});
