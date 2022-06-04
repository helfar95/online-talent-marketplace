import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Op, Sequelize } from 'sequelize';
import { Profile } from '../profiles/entities/profile.entity';
import { Contract } from '../contracts/entities/contract.entity';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @Inject('JOBS_REPOSITORY')
    private jobsRepository: typeof Job,
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
  ) {}

  findUnpaidJobs(profileId) {
    return Job.findAll({
      where: {
        paid: false,
      },
      include: [
        {
          model: Contract,
          where: {
            [Op.or]: [
              {
                ClientId: profileId,
              },
              {
                ContractorId: profileId,
              },
            ],
            status: 'in_progress',
          },
        },
      ],
    });
  }

  async payForJob(jobId, profileId) {
    await this.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      },
      async (t) => {
        const job = await Job.findOne({
          where: {
            id: jobId,
          },
          include: [
            {
              model: Contract,
              required: true,
              attributes: ['ContractorId'],
              where: {
                ClientId: profileId,
              },
            },
          ],
          transaction: t,
        });

        if (!job) {
          throw new NotFoundException(404, 'Job not found');
        }

        if (job.paid) {
          throw new BadRequestException(400, 'Job is already paid');
        }

        const client = await Profile.findByPk(profileId, { transaction: t });
        const contractor = await Profile.findByPk(job.contract.ContractorId, {
          transaction: t,
        });

        if (client.balance < job.price) {
          throw new BadRequestException(400, 'Insufficient funds');
        }

        client.balance = client.balance - job.price;
        contractor.balance = contractor.balance + job.price;
        job.paid = true;
        job.paymentDate = new Date();

        await client.save({ transaction: t });
        await contractor.save({ transaction: t });
        await job.save({ transaction: t });
      },
    );
  }

  async balanceDeposit(userId, amount) {
    await this.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      },
      async (t) => {
        const client = await Profile.findByPk(userId, { transaction: t });

        if (!client || client.type !== 'client') {
          throw new NotFoundException(404, 'Client not found');
        }

        const unpaidSum: any = await Job.findAll({
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('price')), 'total_price'],
          ],
          where: {
            paid: false,
          },
          raw: true,
          include: [
            {
              model: Contract,
              required: true,
              attributes: [],
              where: {
                status: 'in_progress',
                ClientId: userId,
              },
            },
          ]
        });
        
        const depositThreshold = unpaidSum[0].total_price * 0.25;

        if (amount > depositThreshold) {
          throw new BadRequestException(400, 'Deposit exceeds the threshold');
        }

        client.balance += amount;

        await client.save({ transaction: t });
        
        return client;
      },
    );
  }
}
