const { CronJob } = require('cron');
const https = require('https');
const dotenv = require('dotenv');
import { Response } from "express";


dotenv.config();

const job = new CronJob(
  '*/14 * * * *', 
  () => {
    console.log('Sending GET request');

    https
      .get(process.env.API_URL || '', (res: Response) => {
        if (res.statusCode === 200) {
          console.log('GET request sent successfully');
        } else {
          console.log('GET request failed with status code:', res.statusCode);
        }
      })
      .on('error', (e: any) => console.error('Request error:', e.message));
  },
  null,
  true, 
  'UTC' 
);

module.exports = job
