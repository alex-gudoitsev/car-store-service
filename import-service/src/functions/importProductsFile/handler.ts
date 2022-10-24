import {
  formatErrorJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'us-east-1' });

const BUCKET = 'car-csv-bucket';
//const FRONTEND_URL = 'https://d33fy6chog9gs4.cloudfront.net'

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { name } = event.queryStringParameters;
  console.log('importProductsFile is invoked: ' + name);

  try {
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const url = await s3.getSignedUrl('putObject', params);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      body: url,
    };
  } catch (e) {
    return formatErrorJSONResponse(e, 500);
  }
};

export const main = middyfy(importProductsFile);
