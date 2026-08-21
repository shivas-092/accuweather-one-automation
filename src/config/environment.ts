import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://one.accuweather.com',
  DEFAULT_LOCATION: process.env.DEFAULT_LOCATION || 'Dallas, TX',
  TIMEOUT: 30000,
  ACTION_TIMEOUT: 10000,
};