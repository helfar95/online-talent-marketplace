import { Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { Op } from 'sequelize';
import { Profile } from '../profiles/entities/profile.entity';
import { Contract } from '../contracts/entities/contract.entity';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class AdminService {
  async getBestProfessions(startDate, endDate) {
    const job = await Job.findOne({
      attributes: [[sequelize.fn('sum', sequelize.col('price')), 'totalPaid']],
      order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
      group: ['contract.contractor.profession'],
      limit: 1,
      where: {
        paid: true,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Contract,
          attributes: ['createdAt'],
          include: [
            {
              model: Profile,
              as: 'Contractor',
              where: { type: 'contractor' },
              attributes: ['profession'],
            },
          ],
        },
      ],
    });

    return {
      contractor: job.contract.contractor.profession,
      totalAmount: job.get({ plain: true }).totalPaid
    };
  }

  async getBestClients(startDate, endDate, limit) {
    const results = await Job.findAll({
      attributes: [[sequelize.fn('sum', sequelize.col('price')), 'paid']],
      order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
      group: ['contract.client.id'],
      limit,
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Contract,
          attributes: ['id'],
          include: [
            {
              model: Profile,
              as: 'client',
              where: { type: 'client' },
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        },
      ],
    });

    return results.map((job) => ({
      paid: job.paid,
      id: job.contract.client.id,
      fullName: `${job.contract.client.firstName} ${job.contract.client.lastName}`,
    }));
  }
}
