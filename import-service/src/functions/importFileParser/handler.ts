import {
  formatErrorJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import middy from '@middy/core';
const csv = require('csv-parser');
import * as AWS from 'aws-sdk';
const BUCKET = 'car-csv-bucket';

const readFile = async (s3, params) => {
  const s3Stream = s3.getObject(params).createReadStream();
  await s3Stream
    .pipe(csv())
    .on('data', (chunk) => {
      console.log('data: ', chunk);
    })
    .on('error', (error) => {
      console.log(error);
    })
    .on('end', () => {
      console.log('end');
    });
};
const importFileParser: ValidatedEventAPIGatewayProxyEvent<void> = async (
  event: any
) => {
  console.log('start importFileParser: ');

  console.log('Start parsing: ', event);
  const s3 = new AWS.S3({ region: 'us-east-1' });
  console.log('Lambda importFileParser is invoked! Event: ', event);

  try {
    const csvKey = event.Records[0].s3.object.key;
    const [, fileName] = csvKey.split('/');
    const newPrefix = 'parsed';

    const params = { Bucket: BUCKET, Key: csvKey };
    const paramsToWrite = {
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${csvKey}`,
      Key: `${newPrefix}/${fileName}`,
    };

    await readFile(s3, params);

    await s3.copyObject(paramsToWrite).promise();

    await s3.deleteObject(params).promise();
  } catch (e) {
    return formatErrorJSONResponse('Bad Request', 400);
  }
};

export const main = middy(importFileParser);
