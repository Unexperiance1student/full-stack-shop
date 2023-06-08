import { registerAs } from '@nestjs/config';
import { sqlConfig } from './sql.config';

export const databaseConfig = registerAs('databae', () => ({
  sql: {
    ...sqlConfig(),
  },
}));
