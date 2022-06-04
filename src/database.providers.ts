import { Sequelize } from 'sequelize-typescript';
import { Contract } from './contracts/entities/contract.entity';
import { Job } from './jobs/entities/job.entity';
import { Profile } from './profiles/entities/profile.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite3'
      });
      sequelize.addModels([Contract, Job, Profile]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
